#!/bin/bash
set -e

# Update System
echo "Updating system..."
apt-get update && apt-get upgrade -y

# Install Basic Tools
echo "Installing basic tools..."
apt-get install -y git curl wget unzip build-essential nginx

# Install Python 3.12 (Ubuntu 24.04 comes with 3.12 by default) & venv
echo "Installing Python tools..."
apt-get install -y python3-pip python3-venv

# Install Node.js 20.x LTS
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 (Process Manager)
echo "Installing PM2..."
npm install -g pm2

# Setup Nginx
echo "Configuring Nginx..."
# (Basic config will be overwritten later)
systemctl enable nginx
systemctl start nginx

echo "Setup Complete!"
node -v
python3 --version
nginx -v
