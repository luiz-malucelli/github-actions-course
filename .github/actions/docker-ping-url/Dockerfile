# Use a lightweight Python image
FROM python:3.13-alpine3.19

# Creates and moves into /app inside the container
WORKDIR /app

# (Optional) Copy requirements if you have dependencies
COPY requirements.txt .

# Install dependencies
RUN python -V
RUN pip install --no-cache-dir -r requirements.txt || true

COPY . .

# Run the script when the container starts
CMD [ "python", "app/main.py"]