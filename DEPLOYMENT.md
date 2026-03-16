# Guide de Déploiement CI/CD - La Rosa Pâtisserie

## 📋 Vue d'ensemble

Ce projet utilise GitHub Actions pour automatiser le processus de CI/CD avec Docker et Docker Compose.

## 🏗️ Architecture

- **Backend**: Node.js/Express + MongoDB Atlas (Port 5000)
- **Frontend**: Next.js (Port 3000)
- **Conteneurisation**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions

## 🚀 Configuration Initiale

### 1. Prérequis

- Compte GitHub
- Compte Docker Hub
- Serveur de production (VPS/Cloud) avec Docker installé
- MongoDB Atlas configuré

### 2. Secrets GitHub

Allez dans `Settings > Secrets and variables > Actions` de votre repository et ajoutez:

```
DOCKER_USERNAME=votre-username-dockerhub
DOCKER_PASSWORD=votre-token-dockerhub
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
SERVER_HOST=ip-de-votre-serveur
SERVER_USER=utilisateur-ssh
SSH_PRIVATE_KEY=votre-clé-privée-ssh
```

### 3. Configuration du Serveur de Production

#### Installation de Docker

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installation de Docker Compose
sudo apt install docker-compose -y

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
```

#### Préparation du répertoire

```bash
# Créer le répertoire de l'application
sudo mkdir -p /opt/larosa
sudo chown $USER:$USER /opt/larosa
cd /opt/larosa

# Créer le fichier .env
nano .env
```

#### Contenu du fichier .env de production

```env
# Docker Hub
DOCKER_USERNAME=votre-username-dockerhub

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/larosa?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=votre-secret-jwt-super-securise
JWT_EXPIRE=7d

# Email Configuration
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app

# URLs
FRONTEND_URL=https://votre-domaine.com
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
```

#### Copier docker-compose.yml

```bash
# Copier le fichier docker-compose.yml depuis votre repository
nano docker-compose.yml
# Coller le contenu du fichier docker-compose.yml
```

## 🔄 Workflow CI/CD

### Déclenchement

Le pipeline se déclenche automatiquement sur:
- Push sur les branches `main` ou `develop`
- Pull Request vers `main` ou `develop`

### Étapes du Pipeline

1. **Test Backend**
   - Installation des dépendances
   - Vérification du système

2. **Test Frontend**
   - Installation des dépendances
   - Lint du code
   - Build de l'application

3. **Build & Push** (uniquement sur `main`)
   - Construction des images Docker
   - Push vers Docker Hub avec tags `latest` et SHA du commit

4. **Deploy** (uniquement sur `main`)
   - Connexion SSH au serveur
   - Pull des nouvelles images
   - Redémarrage des conteneurs
   - Nettoyage des anciennes images

## 🛠️ Commandes Utiles

### Développement Local avec Docker

```bash
# Build des images
docker-compose build

# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Sur le Serveur de Production

```bash
# Voir l'état des conteneurs
docker ps

# Voir les logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend

# Mettre à jour manuellement
docker-compose pull
docker-compose up -d

# Nettoyer les anciennes images
docker system prune -f
```

## 🔒 Configuration Nginx (Reverse Proxy)

### Installation

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Configuration

```bash
sudo nano /etc/nginx/sites-available/larosa
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.votre-domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activation et SSL

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/larosa /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Obtenir les certificats SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com -d api.votre-domaine.com
```

## 📊 Monitoring

### Health Checks

- Backend: `http://api.votre-domaine.com/api/health`
- Frontend: `http://votre-domaine.com`

### Logs

```bash
# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Dernières 100 lignes
docker-compose logs --tail=100
```

## 🔧 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier les variables d'environnement
docker-compose config
```

### Problèmes de connexion MongoDB

```bash
# Tester la connexion depuis le conteneur
docker exec -it larosa-backend node test-atlas-connection.js
```

### Mise à jour manuelle

```bash
cd /opt/larosa
docker-compose pull
docker-compose up -d --force-recreate
```

## 📝 Checklist de Déploiement

- [ ] MongoDB Atlas configuré et accessible
- [ ] Secrets GitHub configurés
- [ ] Serveur de production préparé
- [ ] Docker et Docker Compose installés
- [ ] Fichier .env créé sur le serveur
- [ ] Nginx configuré avec SSL
- [ ] DNS configurés (A records)
- [ ] Premier déploiement testé
- [ ] Health checks fonctionnels
- [ ] Logs vérifiés

## 🎯 Prochaines Étapes

1. Configurer les sauvegardes automatiques MongoDB
2. Mettre en place un monitoring (Prometheus/Grafana)
3. Configurer les alertes
4. Implémenter le rollback automatique
5. Ajouter des tests automatisés

## 📞 Support

Pour toute question, consultez la documentation ou contactez l'équipe de développement.
