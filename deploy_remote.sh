#!/bin/bash
set -e

APP_DIR="/root/sanmei_app"

echo "Deploying to $APP_DIR..."

# 1. Unzip
mkdir -p $APP_DIR
unzip -o ~/sanmei_app.zip -d $APP_DIR

# 2. Python Backend Setup
cd $APP_DIR
echo "Setting up Python backend..."
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic python-dateutil

# 3. Node.js Frontend Setup
cd $APP_DIR/webapp/frontend
echo "Setting up Node.js frontend..."
npm install
npm run build

# 4. Start Processes with PM2
echo "Starting processes..."
cd $APP_DIR

# Backend
pm2 delete sanmei-backend || true
pm2 start "venv/bin/uvicorn webapp.backend.api:app --host 0.0.0.0 --port 8000" --name sanmei-backend

# Frontend
cd webapp/frontend
pm2 delete sanmei-frontend || true
pm2 start "npm start -- -p 3000" --name sanmei-frontend

pm2 save
pm2 list

echo "Deployment Script Completed!"
