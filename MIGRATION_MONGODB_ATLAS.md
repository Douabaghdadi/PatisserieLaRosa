# 🚀 Migration vers MongoDB Atlas - La Rosa Pâtisserie

Votre application est maintenant configurée pour utiliser MongoDB Atlas au lieu de MongoDB local.

## 📋 Ce qui a été modifié

### Fichiers mis à jour :
- ✅ `backend/server.js` - Connexion Atlas avec gestion d'erreurs améliorée
- ✅ `backend/.env` - Template pour URI Atlas
- ✅ `backend/.env.production` - Configuration production
- ✅ `backend/package.json` - Nouveaux scripts utiles
- ✅ `.gitignore` - Protection des fichiers sensibles

### Nouveaux fichiers créés :
- 📖 `backend/ATLAS_QUICKSTART.md` - Guide rapide (COMMENCEZ ICI)
- 📖 `backend/MIGRATION_ATLAS.md` - Guide détaillé complet
- 🔧 `backend/test-atlas-connection.js` - Script de test de connexion
- 🔧 `backend/check-atlas-setup.js` - Vérification de configuration
- 📝 `backend/.env.example` - Template de configuration

## 🎯 Prochaines étapes

### 1. Obtenir votre URI MongoDB Atlas

Puisque vous utilisez déjà MongoDB Compass :

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Connectez-vous ou créez un compte gratuit
3. Cliquez sur votre cluster → **Connect** → **Connect your application**
4. Copiez l'URI de connexion

### 2. Configurer votre .env

```bash
cd backend
```

Ouvrez `backend/.env` et remplacez la ligne MONGODB_URI par votre URI Atlas :

```env
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/larosa?retryWrites=true&w=majority
```

### 3. Vérifier la configuration

```bash
npm run check-atlas
```

### 4. Tester la connexion

```bash
npm run test-atlas
```

### 5. Migrer vos données

Utilisez MongoDB Compass pour migrer vos données de local vers Atlas :

**Export depuis local :**
- Connectez-vous à `mongodb://localhost:27017`
- Exportez chaque collection en JSON

**Import vers Atlas :**
- Connectez-vous avec votre URI Atlas
- Importez les fichiers JSON

Voir `backend/ATLAS_QUICKSTART.md` pour les détails.

### 6. Démarrer votre application

```bash
npm run dev
```

## 🛠️ Commandes disponibles

```bash
npm run check-atlas   # Vérifier la configuration Atlas
npm run test-atlas    # Tester la connexion à Atlas
npm run dev          # Démarrer le serveur (développement)
npm run start        # Démarrer le serveur (production)
```

## 📚 Documentation

- **Guide rapide** : `backend/ATLAS_QUICKSTART.md` ⭐ COMMENCEZ ICI
- **Guide complet** : `backend/MIGRATION_ATLAS.md`
- **Documentation Atlas** : https://docs.atlas.mongodb.com/

## 🆘 Besoin d'aide ?

1. Consultez `backend/MIGRATION_ATLAS.md` pour le dépannage
2. Vérifiez que votre IP est autorisée dans Atlas (Network Access)
3. Assurez-vous que l'utilisateur de base de données existe (Database Access)

## ⚠️ Important

- Ne commitez JAMAIS votre fichier `.env` (déjà dans .gitignore)
- Utilisez des mots de passe forts pour Atlas
- En production, limitez l'accès réseau aux IPs spécifiques
- Créez des sauvegardes régulières

## ✅ Checklist de migration

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster créé et actif
- [ ] Utilisateur de base de données créé
- [ ] IP autorisée dans Network Access
- [ ] URI Atlas obtenue
- [ ] Fichier `.env` mis à jour
- [ ] Configuration vérifiée (`npm run check-atlas`)
- [ ] Connexion testée (`npm run test-atlas`)
- [ ] Données migrées avec Compass
- [ ] Application testée et fonctionnelle

Bonne migration ! 🎉
