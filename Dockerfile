# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Cloud Run uses port 8080 by default. Expose it.
ENV PORT 8080

# Run uvicorn when the container launches
# Assuming webapp package is in root
CMD uvicorn webapp.backend.api:app --host 0.0.0.0 --port ${PORT}
