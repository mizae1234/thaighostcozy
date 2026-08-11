#!/bin/bash
# =============================================
# Thai Folklore Survival Deploy Script
# Domain: game.technomand-ai.cloud
# Port:   3050
# Path:   /home/web/thaifolkloresurvival
# =============================================

set -e

SERVER="root@srv1100100.hstgr.cloud"
REPO="https://github.com/mizae1234/thaighostcozy.git"
APP_DIR="/home/web/thaifolkloresurvival"
CONTAINER="thaifolkloresurvival-app"
BRANCH="main"
DOMAIN="game.technomand-ai.cloud"

echo "🚀 Deploying Thai Folklore Survival to $SERVER ..."

ssh $SERVER << 'ENDSSH'
set -e

APP_DIR="/home/web/thaifolkloresurvival"
REPO="https://github.com/mizae1234/thaighostcozy.git"
BRANCH="main"
CONTAINER="thaifolkloresurvival-app"
DOMAIN="game.technomand-ai.cloud"

# Ensure directory exists
mkdir -p /home/web

# Clone or pull
if [ ! -d "$APP_DIR/.git" ]; then
    echo "📦 Cloning repository..."
    git clone "$REPO" "$APP_DIR"
else
    echo "📥 Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin "$BRANCH"
fi

cd "$APP_DIR"

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://pop_user:%40Kanitta12PRD@127.0.0.1:5432/thaiflok?schema=public&options=-c%20timezone%3DAsia/Bangkok"
TZ=Asia/Bangkok
ENVEOF
    echo "✅ .env created"
fi

# Docker compose down → build → up
echo "🔨 Rebuilding containers..."
docker compose down || true
docker compose build --no-cache
docker compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to start..."
sleep 10

# Run database seeding
echo "🗄️ Seeding database content inside the container..."
docker exec "$CONTAINER" npx tsx prisma/seed.ts || true

# ── Nginx reverse proxy setup ──────────────────────────────
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
if [ ! -f "$NGINX_CONF" ]; then
    echo "🌐 Setting up Nginx reverse proxy for $DOMAIN ..."

    cat > "$NGINX_CONF" << 'NGINXEOF'
server {
    listen 80;
    server_name game.technomand-ai.cloud;

    location / {
        proxy_pass http://127.0.0.1:3050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        client_max_body_size 500M;
    }
}
NGINXEOF

    # Enable site
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    echo "✅ Nginx configured"

    # SSL with Certbot
    echo "🔒 Setting up SSL with Certbot..."
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@popcorn-creator.com --redirect || echo "⚠️  Certbot failed — SSL not configured. You can run manually: certbot --nginx -d $DOMAIN"
else
    echo "✅ Nginx config already exists for $DOMAIN"
    nginx -t && systemctl reload nginx
fi

# Check container status
echo ""
echo "📋 Container status:"
docker ps --filter "name=$CONTAINER"

# Show recent logs
echo ""
echo "📄 App logs - last 20 lines:"
docker logs --tail 20 "$CONTAINER" 2>&1 || true

echo ""
echo "✅ Deploy complete! → https://$DOMAIN"
ENDSSH
