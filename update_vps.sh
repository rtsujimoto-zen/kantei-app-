#!/bin/bash
set -e

echo "📦 Packaging application..."
# Zip files, excluding heavy folders and temp files
zip -r sanmei_app_update.zip . -x "venv/*" "webapp/frontend/node_modules/*" "webapp/frontend/.next/*" "__pycache__/*" ".git/*" ".gemini/*" "webapp/frontend/.swc/*" "*.DS_Store" "*_log.txt" "*.zip"

echo "🚀 Uploading to VPS..."
scp -i the-zen-terra.pem -o StrictHostKeyChecking=no sanmei_app_update.zip root@85.131.247.18:~/sanmei_app.zip

echo "🔄 Deploying on VPS..."
ssh -i the-zen-terra.pem -o StrictHostKeyChecking=no root@85.131.247.18 "bash deploy_remote.sh"

echo "🧹 Cleaning up..."
rm sanmei_app_update.zip

echo "✅ Update Complete!"
