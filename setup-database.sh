#!/bin/bash

echo "🔧 Setting up PostgreSQL database..."

# PostgreSQL kurulu mu kontrol et
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "Please install PostgreSQL first:"
    echo "1. Download Postgres.app from https://postgresapp.com/"
    echo "2. Or use Homebrew: brew install postgresql@15"
    exit 1
fi

# Veritabanı oluştur
echo "📦 Creating database..."
createdb -U postgres FashionEcommerceDb 2>/dev/null || echo "Database might already exist"

# Kullanıcı oluştur (gerekirse)
psql -U postgres -c "CREATE USER postgres WITH PASSWORD '123456';" 2>/dev/null || echo "User might already exist"

# Bağlantıyı test et
echo "🔌 Testing connection..."
psql -U postgres -d FashionEcommerceDb -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database setup complete!"
else
    echo "⚠️  Could not connect to database. Please check your PostgreSQL installation."
    echo ""
    echo "Try manually:"
    echo "  createdb FashionEcommerceDb"
    echo "  psql FashionEcommerceDb"
fi
