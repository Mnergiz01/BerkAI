#!/bin/bash

echo "🐘 Starting PostgreSQL 17 via launchctl..."
echo "⚠️  This requires admin password"
echo ""

# PostgreSQL servisini başlat
sudo launchctl load /Library/LaunchDaemons/postgresql-17.plist 2>&1

# Biraz bekle
sleep 3

# Kontrol et
export PATH="/Library/PostgreSQL/17/bin:$PATH"
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "✅ PostgreSQL started successfully!"

    # Database oluştur
    echo ""
    echo "📦 Creating database..."
    PGPASSWORD=123456 psql -U postgres -h localhost -c "CREATE DATABASE \"FashionEcommerceDb\";" 2>&1 | grep -v "already exists" || echo "✅ Database ready!"
else
    echo "❌ PostgreSQL failed to start"
    echo "Trying to check status..."
    sudo launchctl list | grep postgres
fi
