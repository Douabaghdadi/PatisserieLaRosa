# 🚀 Migration MongoDB Atlas - Guide Rapide

## Étapes Rapides

### 1️⃣ Obtenir votre URI Atlas

Dans MongoDB Compass, vous avez déjà accès à votre cluster. Pour obtenir l'URI :

1. Ouvrez MongoDB Compass
2. Cliquez sur "New Connection"
3. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
4. Cliquez sur "Connect" → "Connect your application"
5. Copiez l'URI qui ressemble à :
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

### 2️⃣ Mettre à jour .env

Ouvrez `backend/.env` et remplacez la ligne MONGODB_URI :

```env
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/larosa?retryWrites=true&w=majority
```

⚠️ **Important** : Ajoutez `/larosa` après `.net` pour spécifier le nom de la base de données

### 3️⃣ Tester la connexion

```bash
cd backend
npm run test-atlas
```

Si tout fonctionne, vous verrez : ✅ Connexion réussie à MongoDB Atlas!

### 4️⃣ Migrer vos données avec Compass

**Depuis votre base locale :**
1. Connectez-vous à `mongodb://localhost:27017` dans Compass
2. Sélectionnez la base `larosa`
3. Pour chaque collection :
   - Cliquez sur la collection
   - Export Collection → JSON
   - Sauvegardez le fichier

**Vers Atlas :**
1. Connectez-vous à Atlas avec votre URI dans Compass
2. Créez la base `larosa` si nécessaire
3. Pour chaque collection :
   - Add Data → Import File
   - Sélectionnez le fichier JSON
   - Import

### 5️⃣ Démarrer votre application

```bash
npm run dev
```

Vous devriez voir : ✅ MongoDB Atlas connecté avec succès

## 🆘 Problèmes ?

Consultez le guide complet : `MIGRATION_ATLAS.md`

## 📝 Commandes utiles

```bash
npm run test-atlas    # Tester la connexion Atlas
npm run dev          # Démarrer le serveur en mode développement
npm run start        # Démarrer le serveur en production
```
