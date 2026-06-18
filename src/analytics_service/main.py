"""
Analytics service mock for Lab 05.

This service exposes two endpoints:

* `GET /health` – returns status, service name and version.
* `GET /stats` – returns dummy statistics of the sensor readings.

In a real scenario, this would connect to TimescaleDB to aggregate data.
"""

from fastapi import FastAPI
from pydantic import BaseModel
import random

SERVICE_NAME = "analytics-service"
SERVICE_VERSION = "0.5.0"

app = FastAPI(
    title="FIT4110 Lab 05 - Analytics Service",
    version=SERVICE_VERSION,
    description="Mock Analytics service used in Docker Compose stack. Replaces AI service for team-analytics.",
)


class Stats(BaseModel):
    avg_temperature: float
    max_temperature: float
    min_temperature: float
    reading_count: int


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": SERVICE_NAME, "version": SERVICE_VERSION}


@app.get("/stats", response_model=Stats)
def get_stats() -> Stats:
    # This dummy implementation returns random stats
    return Stats(
        avg_temperature=round(random.uniform(20.0, 30.0), 2),
        max_temperature=round(random.uniform(30.0, 40.0), 2),
        min_temperature=round(random.uniform(10.0, 20.0), 2),
        reading_count=random.randint(100, 1000)
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)