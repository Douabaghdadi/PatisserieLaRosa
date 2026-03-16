# 🔄 CI/CD Pipeline - La Rosa Pâtisserie

## 📊 Vue d'ensemble

Pipeline automatisé pour tester, construire et déployer l'application La Rosa Pâtisserie.

## 🎯 Workflows GitHub Actions

### 1. CI/CD Principal (`ci-cd.yml`)
**Déclenchement**: Push sur `main` ou `develop`, Pull Requests

**Étapes**:
- ✅ Test Backend (npm ci, check system)
- ✅ Test Frontend (npm ci, lint, build)
- 🐳 Build & Push Docker images (uniquement sur `main`)
- 🚀 Deploy automatique en production (uniquement sur `main`)

### 2. Deploy Staging (`deploy-staging.yml`)
**Déclenchement**: Push sur `develop`

**Étapes**:
- 🐳 Build images avec tag `staging`
- 🚀 Deploy sur serveur de staging

### 3. Test PR (`test-pr.yml`)
**Déclenchement**: Pull Requests vers `main` ou `develop`

**Étapes**:
- ✅ Tests backend et frontend uniquement
- Pas de build ni déploiement

## 🐳 Images Docker

### Backend
- **Base**: node:20-alpine
- **Port**: 5000
- **Health Check**: `/api/health`
- **Tags**: `latest`, `staging`, `{commit-sha}`

### Frontend
- **Base**: node:20-alpine (multi-stage)
- **Port**: 3000
- **Build**: Standalone Next.js
- **Tags**: `latest`, `staging`, `{commit-sha}`

## 📦 Docker Compose

### Production (`docker-compose.yml`)
```bash
docker-compose up -d
```

### Développement (`docker-compose.dev.yml`)
```bash
docker-compose -f docker-compose.dev.yml up
```

## 🔐 Secrets Requis

| Secret | Description | Exemple |
|--------|-------------|---------|
| `DOCKER_USERNAME` | Username Docker Hub | `larosa` |
| `DOCKER_PASSWORD` | Token Docker Hub | `dckr_pat_...` |
| `NEXT_PUBLIC_API_URL` | URL API production | `https://api.larosa.com` |
| `STAGING_API_URL` | URL API staging | `https://staging-api.larosa.com` |
| `SERVER_HOST` | IP serveur production | `203.0.113.1` |
| `STAGING_SERVER_HOST` | IP serveur staging | `203.0.113.2` |
| `SERVER_USER` | User SSH | `ubuntu` |
| `SSH_PRIVATE_KEY` | Clé privée SSH | `-----BEGIN...` |

## 🚀 Déploiement

### Automatique
```bash
git push origin main  # Deploy en production
git push origin develop  # Deploy en staging
```

### Manuel
```bash
# Sur le serveur
cd /opt/larosa
docker-compose pull
docker-compose up -d
```

## 📋 Checklist Pré-déploiement

- [ ] MongoDB Atlas configuré
- [ ] Secrets GitHub ajoutés
- [ ] Serveur préparé avec Docker
- [ ] Fichier .env créé sur serveur
- [ ] docker-compose.yml copié
- [ ] DNS configurés
- [ ] Nginx configuré (optionnel)
- [ ] SSL activé (optionnel)

## 🔍 Monitoring

### Health Checks
```bash
# Backend
curl https://api.larosa.com/api/health

# Frontend
curl https://larosa.com
```

### Logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🛠️ Dépannage

### Pipeline échoue
1. Vérifier les logs GitHub Actions
2. Vérifier les secrets configurés
3. Tester le build localement

### Déploiement échoue
1. Vérifier connexion SSH
2. Vérifier Docker sur serveur
3. Vérifier fichier .env

### Conteneurs ne démarrent pas
```bash
docker-compose logs
docker-compose config
```

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide complet
- [QUICK_START.md](./QUICK_START.md) - Démarrage rapide
- [.env.production.example](./.env.production.example) - Variables d'environnement

## 🔄 Workflow de Développement

```
develop → PR → Tests → Merge → main → Build → Deploy Production
   ↓
Staging Deploy
```

## 📞 Support

Pour toute question sur le CI/CD, consultez la documentation ou contactez l'équipe DevOps.
