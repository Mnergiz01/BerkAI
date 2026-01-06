#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../backend/src/FashionEcommerce.WebAPI"
nohup dotnet run > backend.log 2>&1 &
echo "Backend started, PID=$!"
