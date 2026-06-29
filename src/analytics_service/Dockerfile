FROM python:3.11-slim

WORKDIR /service

# Pre-install dependencies so the container starts instantly
RUN pip install --no-cache-dir fastapi uvicorn pydantic paho-mqtt python-dotenv

COPY main.py .

EXPOSE 9000

CMD ["python", "main.py"]
