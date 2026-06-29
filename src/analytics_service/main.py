"""
Analytics service for Lab 05.
Integrates MQTT to consume IoT telemetry and provide calculated metrics.
"""

import os
import json
import ssl
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import paho.mqtt.client as mqtt
from dotenv import load_dotenv
import uuid
from collections import Counter

load_dotenv()

SERVICE_NAME = "analytics-service"
SERVICE_VERSION = "0.6.0"

MQTT_HOST = os.getenv("MQTT_HOST", "mqtt")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_USERNAME = os.getenv("MQTT_USERNAME", "")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD", "")
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "smart-campus/events/sensor")
CAMERA_TOPIC = os.getenv("CAMERA_TOPIC", "smart-campus/events/camera")
ACCESS_TOPIC = os.getenv("ACCESS_TOPIC", "smart-campus/events/access")
ALERT_TOPIC = os.getenv("ALERT_TOPIC", "smart-campus/events/alert")

HIVEMQ_HOST = os.getenv("HIVEMQ_HOST", "")
HIVEMQ_PORT = int(os.getenv("HIVEMQ_PORT", 8883))
HIVEMQ_USERNAME = os.getenv("HIVEMQ_USERNAME", "")
HIVEMQ_PASSWORD = os.getenv("HIVEMQ_PASSWORD", "")

# In-memory Storage
room_stats: Dict[str, Dict[str, float]] = {}  # { "location": {"temp_sum": 0, "temp_count": 0, "humid_sum": 0, "humid_count": 0} }
daily_alerts: Dict[str, Dict[str, int]] = {}  # { "YYYY-MM-DD": {"warning": 0, "danger": 0} }
device_battery: Dict[str, float] = {}         # { "deviceId": batteryPercent }
history_timeline: List[Dict] = []             # list of readings
smoke_co2_alerts_count: Dict[str, int] = {"smoke": 0, "co2": 0}
camera_events: List[Dict[str, Any]] = []
access_stats = {"total_in": 0, "denied_count": 0, "hourly_counts": Counter()}
core_alerts: List[Dict[str, Any]] = []

LOW_BATTERY_THRESHOLD = 20.0

def on_connect(client, userdata, flags, reason_code, properties=None):
    print("MQTT Connected:", reason_code)
    client.subscribe(MQTT_TOPIC, qos=1)
    client.subscribe(CAMERA_TOPIC, qos=1)
    client.subscribe(ACCESS_TOPIC, qos=1)
    client.subscribe(ALERT_TOPIC, qos=1)

def on_message(client, userdata, message):
    try:
        payload_str = message.payload.decode()
        print(f"[{message.topic}] Received data: {payload_str}")
        data = json.loads(payload_str)
        
        if message.topic == CAMERA_TOPIC:
            if data.get("event_type") == "camera.motion.analyzed":
                camera_events.append(data)
                if len(camera_events) > 1000:
                    camera_events.pop(0)
            return
            
        if message.topic == ACCESS_TOPIC:
            decision = data.get("decision", "").lower()
            if decision == "granted":
                access_stats["total_in"] += 1
            elif decision == "denied":
                access_stats["denied_count"] += 1
            
            ts = data.get("timestamp")
            if ts:
                try:
                    # e.g., "2026-06-07T07:30:00Z" -> "07:00-08:00"
                    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                    hour_str = f"{dt.hour:02d}:00-{dt.hour+1:02d}:00"
                    access_stats["hourly_counts"][hour_str] += 1
                except:
                    pass
            return
            
        if message.topic == ALERT_TOPIC:
            core_alerts.append(data)
            if len(core_alerts) > 1000:
                core_alerts.pop(0)
            
            # Cập nhật số đếm từ Core Alert
            severity = data.get("severity", "").lower()
            today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            if today not in daily_alerts:
                daily_alerts[today] = {"warning": 0, "danger": 0}
            
            if severity == "critical" or severity == "danger":
                daily_alerts[today]["danger"] += 1
            elif severity == "warning" or severity == "medium":
                daily_alerts[today]["warning"] += 1
                
            return
            
        # Xử lý Sensor events
        location = data.get("location", "Unknown")
        temp = data.get("temperatureC")
        humid = data.get("humidityPercent")
        
        if location not in room_stats:
            room_stats[location] = {"temp_sum": 0, "temp_count": 0, "humid_sum": 0, "humid_count": 0}
            
        if temp is not None:
            room_stats[location]["temp_sum"] += temp
            room_stats[location]["temp_count"] += 1
        if humid is not None:
            room_stats[location]["humid_sum"] += humid
            room_stats[location]["humid_count"] += 1
            
        # 2. Đếm số lần warning/danger theo ngày
        alert_level = data.get("alertLevel")
        if alert_level in ["warning", "danger"]:
            today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            if today not in daily_alerts:
                daily_alerts[today] = {"warning": 0, "danger": 0}
            daily_alerts[today][alert_level] += 1
            
        # 3. Pin yếu
        device_id = data.get("deviceId")
        battery = data.get("batteryPercent")
        if device_id and battery is not None:
            device_battery[device_id] = battery
            
        # Cập nhật số đếm CO2 / Smoke
        reason = data.get("reason", "")
        if "co2" in reason.lower() or data.get("co2Ppm", 0) > 1000:
            smoke_co2_alerts_count["co2"] += 1
        if "smoke" in reason.lower() or data.get("smokePpm", 0) > 0.1:
            smoke_co2_alerts_count["smoke"] += 1
            
        # 4. History timeline
        if temp is not None and data.get("co2Ppm") is not None:
            timestamp = data.get("timestamp", datetime.now(timezone.utc).isoformat())
            history_timeline.append({
                "timestamp": timestamp,
                "temperatureC": temp,
                "humidityPercent": humid,
                "co2Ppm": data.get("co2Ppm"),
                "smokePpm": data.get("smokePpm")
            })
            # Keep last 1000 records
            if len(history_timeline) > 1000:
                history_timeline.pop(0)

    except Exception as e:
        print("Error parsing MQTT message:", e)

# MQTT Client initialization
mqtt_client = mqtt.Client(protocol=mqtt.MQTTv5)
if MQTT_USERNAME and MQTT_PASSWORD:
    mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    mqtt_client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

hive_client = None
if HIVEMQ_HOST:
    hive_client = mqtt.Client(protocol=mqtt.MQTTv5)
    if HIVEMQ_USERNAME and HIVEMQ_PASSWORD:
        hive_client.username_pw_set(HIVEMQ_USERNAME, HIVEMQ_PASSWORD)
    if HIVEMQ_PORT == 8883:
        hive_client.tls_set()
    def on_hive_connect(client, userdata, flags, reason_code, properties=None):
        print("HiveMQ Connected:", reason_code)
        client.subscribe(ACCESS_TOPIC, qos=1)
    hive_client.on_connect = on_hive_connect
    hive_client.on_message = on_message

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Connecting to MQTT Broker at {MQTT_HOST}:{MQTT_PORT}...")
    try:
        mqtt_client.connect(MQTT_HOST, MQTT_PORT)
        mqtt_client.loop_start()
    except Exception as e:
        print("Failed to connect to MQTT:", e)
        
    if hive_client:
        print(f"Connecting to HiveMQ at {HIVEMQ_HOST}:{HIVEMQ_PORT}...")
        try:
            hive_client.connect(HIVEMQ_HOST, HIVEMQ_PORT, 60)
            hive_client.loop_start()
        except Exception as e:
            print("Failed to connect to HiveMQ:", e)
            
    yield
    print("Stopping MQTT clients...")
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    if hive_client:
        hive_client.loop_stop()
        hive_client.disconnect()

app = FastAPI(
    title="FIT4110 Lab 05 - Analytics Service",
    version=SERVICE_VERSION,
    description="Analytics service with MQTT IoT integration",
    lifespan=lifespan
)

# Models
class DashboardMetric(BaseModel):
    metricName: str
    currentValue: float
    trend: str
    updatedAt: str

class KPIStatistic(BaseModel):
    kpiId: str
    metricName: str
    value: float
    unit: str
    trend: str
    calculatedAt: str
    description: str

@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": SERVICE_NAME, "version": SERVICE_VERSION}

@app.get("/analytics/dashboard", response_model=List[DashboardMetric])
def get_dashboard_metrics() -> List[DashboardMetric]:
    now = datetime.now(timezone.utc).isoformat()
    
    total_temp = 0
    temp_count = 0
    total_humid = 0
    humid_count = 0
    for stats in room_stats.values():
        total_temp += stats["temp_sum"]
        temp_count += stats["temp_count"]
        total_humid += stats["humid_sum"]
        humid_count += stats["humid_count"]
        
    avg_temp = total_temp / temp_count if temp_count > 0 else 0
    avg_humid = total_humid / humid_count if humid_count > 0 else 0
    
    low_battery_count = sum(1 for b in device_battery.values() if b < LOW_BATTERY_THRESHOLD)
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    danger_count = daily_alerts.get(today, {}).get("danger", 0)
    warning_count = daily_alerts.get(today, {}).get("warning", 0)
    
    metrics = [
        DashboardMetric(metricName="avg_temperature", currentValue=round(avg_temp, 2), trend="STABLE", updatedAt=now),
        DashboardMetric(metricName="avg_humidity", currentValue=round(avg_humid, 2), trend="STABLE", updatedAt=now),
        DashboardMetric(metricName="low_battery_devices", currentValue=low_battery_count, trend="STABLE", updatedAt=now),
        DashboardMetric(metricName="danger_events_today", currentValue=danger_count, trend="STABLE", updatedAt=now),
        DashboardMetric(metricName="warning_events_today", currentValue=warning_count, trend="STABLE", updatedAt=now),
        DashboardMetric(metricName="co2_warnings", currentValue=smoke_co2_alerts_count["co2"], trend="STABLE", updatedAt=now),
        DashboardMetric(metricName="smoke_alerts", currentValue=smoke_co2_alerts_count["smoke"], trend="STABLE", updatedAt=now),
    ]
    return metrics

@app.get("/analytics/kpi", response_model=List[KPIStatistic])
def get_kpi_statistics() -> List[KPIStatistic]:
    now = datetime.now(timezone.utc).isoformat()
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    danger_count = daily_alerts.get(today, {}).get("danger", 0)
    
    return [
        KPIStatistic(
            kpiId=str(uuid.uuid4()),
            metricName="danger-event-rate",
            value=float(danger_count),
            unit="count",
            trend="STABLE",
            calculatedAt=now,
            description="Number of danger events occurred today"
        )
    ]

@app.get("/analytics/timeline")
def get_timeline() -> List[Dict]:
    return history_timeline

@app.get("/api/v1/events/camera")
def get_camera_events():
    return {
        "total": len(camera_events),
        "items": camera_events
    }

@app.get("/api/v1/metrics/camera")
def get_camera_metrics():
    risk_counter = Counter(e.get("risk_level", "unknown") for e in camera_events)
    camera_counter = Counter(e.get("camera_id", "unknown") for e in camera_events)
    location_counter = Counter(e.get("location", "unknown") for e in camera_events)
    motion_level_counter = Counter(e.get("motion_level", "unknown") for e in camera_events)

    unknown_person_count = sum(1 for e in camera_events if e.get("unknown_person") is True)
    alert_candidate_count = sum(1 for e in camera_events if e.get("alert_candidate") is True)

    return {
        "total_camera_events": len(camera_events),
        "risk_level_count": dict(risk_counter),
        "motion_level_count": dict(motion_level_counter),
        "events_by_camera": dict(camera_counter),
        "events_by_location": dict(location_counter),
        "unknown_person_count": unknown_person_count,
        "alert_candidate_count": alert_candidate_count
    }

@app.get("/stats")
def get_stats() -> dict:
    """Trả về chính xác các metric theo yêu cầu đề bài"""
    avg_temp_by_room = {}
    avg_humid_by_room = {}
    
    for room, stats in room_stats.items():
        if stats["temp_count"] > 0:
            avg_temp_by_room[room] = round(stats["temp_sum"] / stats["temp_count"], 2)
        if stats["humid_count"] > 0:
            avg_humid_by_room[room] = round(stats["humid_sum"] / stats["humid_count"], 2)
            
    low_battery_count = sum(1 for b in device_battery.values() if b < LOW_BATTERY_THRESHOLD)
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    danger_count = daily_alerts.get(today, {}).get("danger", 0)
    warning_count = daily_alerts.get(today, {}).get("warning", 0)
    
    peak_hour = ""
    if access_stats["hourly_counts"]:
        peak_hour = max(access_stats["hourly_counts"], key=access_stats["hourly_counts"].get)
    
    return {
        "date": today,
        "avg_temperature_by_room": avg_temp_by_room,
        "avg_humidity_by_room": avg_humid_by_room,
        "danger_event_count": danger_count,
        "warning_event_count": warning_count,
        "low_battery_device_count": low_battery_count,
        "total_access_in": access_stats["total_in"],
        "denied_access_count": access_stats["denied_count"],
        "peak_access_hour": peak_hour,
        "co2_warning_count": smoke_co2_alerts_count["co2"],
        "smoke_alert_count": smoke_co2_alerts_count["smoke"]
    }

@app.get("/view-dashboard", response_class=HTMLResponse)
def view_dashboard():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Smart Campus Super Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            :root { --primary: #3b82f6; --danger: #ef4444; --warning: #f59e0b; --bg: #f8fafc; --card: #ffffff; --text: #1e293b; }
            body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); margin: 0; padding: 0; color: var(--text); }
            
            /* Navbar */
            .navbar { background: white; padding: 1rem 2rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            .nav-brand { font-size: 1.5rem; font-weight: bold; background: linear-gradient(to right, #3b82f6, #8b5cf6); -webkit-background-clip: text; color: transparent; }
            .nav-links { display: flex; gap: 1rem; }
            .nav-btn { padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b; }
            .nav-btn.active { background: #e0e7ff; color: #4338ca; }
            .nav-btn:hover:not(.active) { background: #f1f5f9; }

            .container { padding: 0 2rem 2rem 2rem; max-width: 1400px; margin: 0 auto; }
            
            .tab-content { display: none; animation: fadeIn 0.3s ease-in-out; }
            .tab-content.active { display: block; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
            .card { background: var(--card); padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
            .card h3 { margin: 0 0 0.5rem 0; color: #64748b; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
            .card p { margin: 0; font-size: 2.5rem; font-weight: 700; color: #0f172a; }
            .danger { color: var(--danger) !important; }
            .warning { color: var(--warning) !important; }
            .room-list { list-style: none; padding: 0; margin: 0; font-size: 1.1rem; }
            .room-list li { padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
            .room-list li:last-child { border-bottom: none; }
            .chart-container { background: var(--card); padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; margin-bottom: 2rem; height: 400px; }
            
            .live-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #dcfce7; color: #166534; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.875rem; }
            .pulse { width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        </style>
    </head>
    <body>
        <nav class="navbar">
            <div class="nav-brand">Smart Campus</div>
            <div class="nav-links">
                <button class="nav-btn active" onclick="switchTab('sensor-tab', this)">🌡️ IoT Sensors</button>
                <button class="nav-btn" onclick="switchTab('camera-tab', this)">📹 Camera AI</button>
                <button class="nav-btn" onclick="switchTab('access-tab', this)">🚪 Access Gate</button>
            </div>
            <div class="live-badge"><div class="pulse"></div> Live</div>
        </nav>

        <div class="container">
            <!-- SENSOR DASHBOARD -->
            <div id="sensor-tab" class="tab-content active">
                <div class="grid">
                    <div class="card"><h3>Avg Temperature by Room</h3><ul id="temp-list" class="room-list"></ul></div>
                    <div class="card"><h3>Avg Humidity by Room</h3><ul id="humid-list" class="room-list"></ul></div>
                </div>
                <div class="grid">
                    <div class="card"><h3>Danger Events Today</h3><p id="danger-count" class="danger">0</p></div>
                    <div class="card"><h3>Warning Events Today</h3><p id="warning-count" class="warning">0</p></div>
                    <div class="card"><h3>CO2 Warnings</h3><p id="co2-count" class="warning">0</p></div>
                    <div class="card"><h3>Smoke Alerts</h3><p id="smoke-count" class="danger">0</p></div>
                    <div class="card"><h3>Low Battery Devices</h3><p id="battery-count">0</p></div>
                </div>
                <div class="chart-container">
                    <canvas id="envChart"></canvas>
                </div>
            </div>

            <!-- CAMERA DASHBOARD -->
            <div id="camera-tab" class="tab-content">
                <div class="grid">
                    <div class="card"><h3>Total AI Events</h3><p id="cam-total" style="color: #4f46e5;">0</p></div>
                    <div class="card"><h3>High Risk Threats</h3><p id="cam-high-risk" class="danger">0</p></div>
                    <div class="card"><h3>Unknown Persons</h3><p id="cam-unknown" class="warning">0</p></div>
                    <div class="card"><h3>Alert Candidates</h3><p id="cam-alerts" class="danger">0</p></div>
                </div>
                <div class="grid">
                    <div class="card">
                        <h3>Events by Location</h3>
                        <ul id="cam-locations" class="room-list"></ul>
                    </div>
                    <div class="card">
                        <h3>Motion Intensity</h3>
                        <ul id="cam-motions" class="room-list"></ul>
                    </div>
                </div>
                <div class="chart-container" style="height: 300px; margin-top: 2rem;">
                    <canvas id="cameraChart"></canvas>
                </div>
            </div>

            <!-- ACCESS DASHBOARD -->
            <div id="access-tab" class="tab-content">
                <div class="grid">
                    <div class="card"><h3>Total Access In (Granted)</h3><p id="acc-total-in" style="color: #22c55e;">0</p></div>
                    <div class="card"><h3>Denied Access</h3><p id="acc-denied" class="danger">0</p></div>
                    <div class="card"><h3>Peak Access Hour</h3><p id="acc-peak-hour" class="warning">-</p></div>
                </div>
                <div class="chart-container" style="height: 300px; margin-top: 2rem;">
                    <canvas id="accessChart"></canvas>
                </div>
            </div>
        </div>

        <script>
            // Chuyển Tab
            function switchTab(tabId, btnElement) {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                
                document.getElementById(tabId).classList.add('active');
                btnElement.classList.add('active');
            }

            // Chart.js
            const ctx = document.getElementById('envChart').getContext('2d');
            const envChart = new Chart(ctx, {
                type: 'line',
                data: { labels: [], datasets: [
                    { label: 'Temperature (°C)', data: [], borderColor: '#ef4444', tension: 0.4, yAxisID: 'yTemp', spanGaps: true },
                    { label: 'CO2 (ppm)', data: [], borderColor: '#8b5cf6', tension: 0.4, yAxisID: 'yCo2', spanGaps: true },
                    { label: 'Smoke (ppm)', data: [], borderColor: '#64748b', tension: 0.4, yAxisID: 'ySmoke', borderDash: [5, 5], spanGaps: true }
                ]},
                options: {
                    responsive: true, maintainAspectRatio: false, animation: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        yTemp: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Temperature (°C)'} },
                        yCo2: { type: 'linear', display: true, position: 'right', title: {display: true, text: 'CO2 (ppm)'}, grid: {drawOnChartArea: false} },
                        ySmoke: { type: 'linear', display: true, position: 'right', title: {display: true, text: 'Smoke (ppm)'}, grid: {drawOnChartArea: false} }
                    }
                }
            });

            // CAMERA CHART INIT
            const camCtx = document.getElementById('cameraChart').getContext('2d');
            const cameraChart = new Chart(camCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' },
                        title: { display: true, text: 'Threat Risk Analysis', font: { size: 16 } }
                    },
                    cutout: '70%'
                }
            });

            // ACCESS CHART INIT
            const accCtx = document.getElementById('accessChart').getContext('2d');
            const accessChart = new Chart(accCtx, {
                type: 'pie',
                data: {
                    labels: ['Granted', 'Denied'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: ['#22c55e', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' },
                        title: { display: true, text: 'Access Decision Ratio', font: { size: 16 } }
                    }
                }
            });

            async function fetchData() {
                try {
                    // SENSOR & STATS DATA
                    const statsRes = await fetch('/stats');
                    const stats = await statsRes.json();
                    document.getElementById('danger-count').innerText = stats.danger_event_count;
                    document.getElementById('warning-count').innerText = stats.warning_event_count;
                    document.getElementById('battery-count').innerText = stats.low_battery_device_count;
                    document.getElementById('co2-count').innerText = stats.co2_warning_count;
                    document.getElementById('smoke-count').innerText = stats.smoke_alert_count;

                    // ACCESS DATA
                    document.getElementById('acc-total-in').innerText = stats.total_access_in;
                    document.getElementById('acc-denied').innerText = stats.denied_access_count;
                    document.getElementById('acc-peak-hour').innerText = stats.peak_access_hour || '-';

                    // ACCESS CHART UPDATE
                    accessChart.data.datasets[0].data = [stats.total_access_in, stats.denied_access_count];
                    accessChart.update();

                    const tempList = document.getElementById('temp-list');
                    tempList.innerHTML = '';
                    for (const [room, temp] of Object.entries(stats.avg_temperature_by_room)) {
                        tempList.innerHTML += `<li><span>${room}</span> <strong>${temp}°C</strong></li>`;
                    }

                    const humidList = document.getElementById('humid-list');
                    humidList.innerHTML = '';
                    for (const [room, humid] of Object.entries(stats.avg_humidity_by_room)) {
                        humidList.innerHTML += `<li><span>${room}</span> <strong>${humid}%</strong></li>`;
                    }

                    const timelineRes = await fetch('/analytics/timeline');
                    const timeline = await timelineRes.json();
                    const recentData = timeline.slice(-30);
                    envChart.data.labels = recentData.map(d => new Date(d.timestamp).toLocaleTimeString());
                    envChart.data.datasets[0].data = recentData.map(d => d.temperatureC);
                    envChart.data.datasets[1].data = recentData.map(d => d.co2Ppm);
                    envChart.data.datasets[2].data = recentData.map(d => d.smokePpm);
                    envChart.update('none');

                    // CAMERA DATA
                    const camRes = await fetch('/api/v1/metrics/camera');
                    const cam = await camRes.json();
                    
                    document.getElementById('cam-total').innerText = cam.total_camera_events;
                    document.getElementById('cam-high-risk').innerText = cam.risk_level_count.high || 0;
                    document.getElementById('cam-unknown').innerText = cam.unknown_person_count;
                    document.getElementById('cam-alerts').innerText = cam.alert_candidate_count;

                    const camLocs = document.getElementById('cam-locations');
                    camLocs.innerHTML = '';
                    for (const [loc, count] of Object.entries(cam.events_by_location)) {
                        camLocs.innerHTML += `<li><span>${loc}</span> <strong>${count}</strong></li>`;
                    }

                    const camMotions = document.getElementById('cam-motions');
                    camMotions.innerHTML = '';
                    for (const [motion, count] of Object.entries(cam.motion_level_count)) {
                        camMotions.innerHTML += `<li><span>${motion}</span> <strong>${count}</strong></li>`;
                    }

                    // UPDATE CAMERA CHART (Risk Levels)
                    const riskData = [
                        cam.risk_level_count.low || 0, 
                        cam.risk_level_count.medium || 0, 
                        cam.risk_level_count.high || 0
                    ];
                    cameraChart.data.datasets[0].data = riskData;
                    cameraChart.update('none');

                } catch (err) {
                    console.error("Lỗi khi tải dữ liệu:", err);
                }
            }

            fetchData();
            setInterval(fetchData, 5000);
        </script>
    </body>
    </html>
    """
    return html_content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)