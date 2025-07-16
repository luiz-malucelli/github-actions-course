# Use a lightweight Python image
FROM python:3.13-alpine3.19

# Creates and moves into /app inside the container
WORKDIR /app

# Copies your local main.py into /app/main.py
COPY main.py .

# (Optional) Copy requirements if you have dependencies
COPY requirements.txt .

#Debug
RUN ls -la /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt || true

# Run the script when the container starts
CMD [ "python", "/app/main.py"]