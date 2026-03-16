# 🚀 Quick Start - Déploiement CI/CD

## Configuration Rapide en 5 Étapes

### 1️⃣ Préparer Docker Hub

```bash
# Créer un compte sur hub.docker.com
# Créer un Access Token dans Account Settings > Security
```

### 2️⃣ Configurer les Secrets GitHub

Dans votre repository GitHub: `Settings > Secrets and variables > Actions`

Ajoutez ces secrets:
- `DOCKER_USERNAME`: Votre username Docker Hub
- `DOCKER_PASSWORD`: Votre Access Token Docker Hub
- `NEXT_PUBLIC_API_URL`: URL de votre API (ex: https://api.larosa.com)
- `SERVER_HOST`: IP de votre serveur
- `SERVER_USER`: Utilisateur SSH (ex: ubuntu)
- `SSH_PRIVATE_KEY`: Votre clé privée SSH

### 3️⃣ Préparer le Serveur

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose -y

# Créer le répertoire
sudo mkdir -p /opt/larosa
sudo chown $USER:$USER /opt/larosa
cd /opt/larosa

# Créer le fichier .env
nano .env
```

Contenu du .env:
```env
DOCKER_USERNAME=votre-username
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre-secret-securise
JWT_EXPIRE=7d
EMAIL_USER=email@gmail.com
EMAIL_PASS=mot-de-passe-app
FRONTEND_URL=https://larosa.com
NEXT_PUBLIC_API_URL=https://api.larosa.com
```


Copier docker-compose.yml sur le serveur:
```bash
nano docker-compose.yml
# Coller le contenu depuis votre repository
```

### 4️⃣ Push vers GitHub

```bash
git add .
git commit -m "Add CI/CD configuration"
git push origin main
```

Le pipeline se lance automatiquement!

### 5️⃣ Configurer Nginx (Optionnel)

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
sudo nano /etc/nginx/sites-available/larosa
```

Configuration Nginx minimale:
```nginx
server {
    listen 80;
    server_name api.larosa.com;
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name larosa.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

Activer:
```bash
sudo ln -s /etc/nginx/sites-available/larosa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d larosa.com -d api.larosa.com
```

## ✅ Vérification

- Backend: https://api.larosa.com/api/health
- Frontend: https://larosa.com

## 📝 Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Mettre à jour
docker-compose pull && docker-compose up -d
```

Pour plus de détails, consultez [DEPLOYMENT.md](./DEPLOYMENT.md)
