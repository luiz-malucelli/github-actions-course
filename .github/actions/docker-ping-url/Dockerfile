# Use a lightweight Python image
FROM python:3.13-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Copy the Python files into the container
COPY main.py .

# (Optional) Copy requirements if you have dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt || true

# Run the script when the container starts
CMD ["python", "main.py"]