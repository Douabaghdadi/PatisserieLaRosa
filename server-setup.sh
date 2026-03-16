#!/bin/bash
# Script de configuration du serveur pour La Rosa Pâtisserie

echo "🚀 Configuration du serveur pour La Rosa Pâtisserie"
echo "=================================================="

# Mise à jour du système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation de Docker
echo "🐳 Installation de Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Installation de Docker Compose
echo "🔧 Installation de Docker Compose..."
sudo apt install docker-compose -y

# Ajouter l'utilisateur au groupe docker
echo "👤 Configuration des permissions Docker..."
sudo usermod -aG docker ubuntu

# Créer le répertoire de l'application
echo "📁 Création du répertoire de l'application..."
sudo mkdir -p /opt/larosa
sudo chown ubuntu:ubuntu /opt/larosa

# Créer le fichier docker-compose.yml
echo "📝 Création du fichier docker-compose.yml..."
cat > /opt/larosa/docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    image: ${DOCKER_USERNAME}/larosa-backend:latest
    container_name: larosa-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRE=${JWT_EXPIRE}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
      - FRONTEND_URL=${FRONTEND_URL}
    volumes:
      - ./uploads:/app/uploads
    networks:
      - larosa-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    image: ${DOCKER_USERNAME}/larosa-frontend:latest
    container_name: larosa-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - larosa-network

networks:
  larosa-network:
    driver: bridge
EOF

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Créer le fichier .env dans /opt/larosa"
echo "2. Configurer Nginx (optionnel)"
echo "3. Obtenir les certificats SSL"
echo ""
echo "Pour créer le fichier .env, exécutez:"
echo "nano /opt/larosa/.env"
