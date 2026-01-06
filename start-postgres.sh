#!/bin/bash

echo "🐘 Starting PostgreSQL 17..."

# PostgreSQL path'i ekle
export PATH="/Library/PostgreSQL/17/bin:$PATH"

# Data dizinini kontrol et
DATA_DIR="/Library/PostgreSQL/17/data"

if [ ! -d "$DATA_DIR" ]; then
    echo "❌ PostgreSQL data directory not found at $DATA_DIR"
    echo "Please check your PostgreSQL installation"
    exit 1
fi

# PostgreSQL'in çalışıp çalışmadığını kontrol et
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "✅ PostgreSQL is already running!"
else
    echo "Starting PostgreSQL server..."
    echo "⚠️  This requires admin password (sudo)"

    # PostgreSQL servisini başlat
    sudo -u postgres /Library/PostgreSQL/17/bin/pg_ctl -D "$DATA_DIR" start

    # Başlamasını bekle
    sleep 3

    if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
        echo "✅ PostgreSQL started successfully!"
    else
        echo "❌ Failed to start PostgreSQL"
        echo "Try starting it manually with pgAdmin 4"
        exit 1
    fi
fi

# Veritabanını oluştur
echo ""
echo "📦 Creating database..."
PGPASSWORD=123456 psql -U postgres -h localhost -c "CREATE DATABASE \"FashionEcommerceDb\";" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
else
    echo "ℹ️  Database might already exist"
fi

echo ""
echo "✅ PostgreSQL is ready!"
echo "Connection: localhost:5432"
echo "Database: FashionEcommerceDb"
echo "User: postgres"
