# Guide de Déploiement - La Rosa Pâtisserie

## Prérequis sur le serveur

Votre serveur doit avoir :
- Ubuntu 20.04+ ou Debian 11+
- Docker et Docker Compose installés
- Nginx installé
- Accès SSH configuré

## Étape 1 : Connexion au serveur

```bash
ssh votre_user@51.178.19.166
```

## Étape 2 : Installation de Docker (si pas déjà installé)

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installation de Docker Compose
sudo apt install docker-compose -y

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

## Étape 3 : Installation de Nginx (si pas déjà installé)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Étape 4 : Création de la structure de dossiers

```bash
# Créer le dossier du projet
sudo mkdir -p /opt/larosa
sudo chown $USER:$USER /opt/larosa
cd /opt/larosa

# Créer le dossier uploads
mkdir -p backend/uploads
```

## Étape 5 : Copier les fichiers de configuration

Depuis votre machine locale, copiez les fichiers :

```bash
# Copier docker-compose.yml
scp docker-compose.yml votre_user@51.178.19.166:/opt/larosa/

# Copier .env.production (renommé en .env)
scp .env.production votre_user@51.178.19.166:/opt/larosa/.env

# Copier la configuration Nginx
scp nginx.conf votre_user@51.178.19.166:/tmp/larosa-nginx.conf
```

## Étape 6 : Configuration de Nginx

Sur le serveur :

```bash
# Copier la configuration Nginx
sudo cp /tmp/larosa-nginx.conf /etc/nginx/sites-available/larosa

# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/larosa /etc/nginx/sites-enabled/

# Supprimer la configuration par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

## Étape 7 : Éditer le fichier .env

Sur le serveur, éditez `/opt/larosa/.env` avec vos vraies valeurs :

```bash
cd /opt/larosa
nano .env
```

Remplacez :
- `votre_username_dockerhub` par votre username Docker Hub
- `votre_mongodb_uri` par votre URI MongoDB Atlas
- `votre_jwt_secret_production` par un secret fort
- `votre_email@gmail.com` et `votre_app_password` par vos identifiants email

## Étape 8 : Démarrer les conteneurs

```bash
cd /opt/larosa
docker-compose pull
docker-compose up -d
```

## Étape 9 : Vérifier les logs

```bash
# Voir tous les logs
docker-compose logs -f

# Voir les logs du backend uniquement
docker-compose logs -f backend

# Voir les logs du frontend uniquement
docker-compose logs -f frontend
```

## Étape 10 : Vérifier que tout fonctionne

```bash
# Vérifier les conteneurs
docker-compose ps

# Vérifier Nginx
sudo systemctl status nginx

# Tester l'API
curl http://localhost:5000/api/health

# Tester le frontend
curl http://localhost:3000
```

## Ouvrir les ports du firewall (si nécessaire)

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# OU iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Accéder à l'application

Ouvrez votre navigateur et allez sur : `http://51.178.19.166`

## Dépannage

### Les conteneurs ne démarrent pas

```bash
docker-compose logs
docker-compose down
docker-compose up -d
```

### Nginx ne fonctionne pas

```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx -f
```

### Problème de connexion MongoDB

Vérifiez que votre IP serveur est autorisée dans MongoDB Atlas :
1. Allez sur MongoDB Atlas
2. Network Access
3. Ajoutez l'IP : 51.178.19.166

## Mise à jour de l'application

Le workflow GitHub Actions met à jour automatiquement l'application à chaque push sur la branche `PatisserieLaRosa`.

Pour forcer une mise à jour manuelle :

```bash
cd /opt/larosa
docker-compose pull
docker-compose up -d
```

## Commandes utiles

```bash
# Redémarrer les services
docker-compose restart

# Arrêter les services
docker-compose down

# Voir l'utilisation des ressources
docker stats

# Nettoyer les images inutilisées
docker system prune -a
```
