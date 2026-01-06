#!/bin/bash

echo "🚀 BerkAI Fashion E-commerce Platform"
echo "======================================"
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend dizinine git
cd "$(dirname "$0")/backend/src/FashionEcommerce.WebAPI"

echo "📋 Checking prerequisites..."
echo ""

# .NET kontrol
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ .NET SDK not found!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ .NET SDK: $(dotnet --version)${NC}"
fi

# Node.js kontrol
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
fi

# PostgreSQL kontrol
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL not found!${NC}"
    echo ""
    echo "Please install PostgreSQL:"
    echo "1. Postgres.app: https://postgresapp.com/"
    echo "2. Or Homebrew: brew install postgresql@15"
    exit 1
else
    echo -e "${GREEN}✅ PostgreSQL installed${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Setting up backend...${NC}"

# Database migrations çalıştır
echo "Running database migrations..."
dotnet ef database update

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Migration failed! Check PostgreSQL connection.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🌱 Seeding admin user...${NC}"
cd "$(dirname "$0")/backend"
dotnet script seed-admin.csx 2>/dev/null || echo "Admin might already exist"

echo ""
echo -e "${YELLOW}Starting servers...${NC}"
echo ""

# Backend'i arka planda başlat
echo -e "${GREEN}🟢 Starting Backend API (http://localhost:5195)${NC}"
cd "$(dirname "$0")/backend/src/FashionEcommerce.WebAPI"
dotnet run > backend.log 2>&1 &
BACKEND_PID=$!

# Backend'in başlamasını bekle
sleep 5

# Frontend dependencies yükle
echo ""
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd "$(dirname "$0")/frontend"

if [ ! -d "node_modules" ]; then
    npm install
fi

# Frontend'i başlat
echo ""
echo -e "${GREEN}🟢 Starting Frontend (http://localhost:3000)${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "======================================"
echo -e "${GREEN}✅ BerkAI Platform is running!${NC}"
echo "======================================"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5195"
echo "📚 Swagger: http://localhost:5195/swagger"
echo ""
echo "👤 Admin Login:"
echo "   Email: admin@berkai.com"
echo "   Password: 123456"
echo ""
echo "📝 Logs:"
echo "   Backend: backend/src/FashionEcommerce.WebAPI/backend.log"
echo ""
echo "Press Ctrl+C to stop all servers..."
echo ""

# Trap SIGINT ve SIGTERM sinyallerini yakala
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

# Sonsuz döngü - kullanıcı Ctrl+C yapana kadar bekle
wait
