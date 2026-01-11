#!/bin/bash
set -e

# 1. Apply Nginx Subdomain Config
cp nginx.conf /etc/nginx/sites-available/default
nginx -t
systemctl restart nginx

# 2. Install Certbot (Ensure installed)
apt-get update
# Suppress interactive prompts for restart
export DEBIAN_FRONTEND=noninteractive
apt-get install -y certbot python3-certbot-nginx

# 3. Obtain Certificate (Non-interactive)
# Using --expand to update if exists, though this is a new sub domain
certbot --nginx -d app.the-zen-terra.com --non-interactive --agree-tos -m admin@the-zen-terra.com --redirect

echo "SSL Setup for Subdomain Complete!"
