#!/bin/bash
set -e

echo "=========================================="
echo " Starting PulseWatch on Ubuntu / Linux    "
echo "=========================================="

# Ensure docker-compose is available or install the plugin
if ! docker compose version &>/dev/null && ! which docker-compose &>/dev/null; then
    echo "Installing docker-compose plugin on Ubuntu..."
    sudo apt-get update -y
    sudo apt-get install -y docker-compose-plugin || sudo apt-get install -y docker-compose
fi

# Ensure .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Building and launching containers..."
if docker compose version &>/dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "=========================================="
echo " PulseWatch is running!                   "
echo "=========================================="
echo " Access frontend at: http://<YOUR-EC2-PUBLIC-IP>:3000"
echo " Access backend  at: http://<YOUR-EC2-PUBLIC-IP>:8080"
echo " View logs: docker compose logs -f"
echo "=========================================="
