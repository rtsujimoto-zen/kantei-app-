#!/bin/bash
set -e

# 1. Apply Nginx Domain Config
cp nginx.conf /etc/nginx/sites-available/default
nginx -t
systemctl restart nginx

# 2. Install Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 3. Obtain Certificate (Non-interactive)
# Replace with user's email if possible, or use a placeholder
certbot --nginx -d the-zen-terra.com -d www.the-zen-terra.com --non-interactive --agree-tos -m admin@the-zen-terra.com --redirect

echo "SSL Setup Complete!"
