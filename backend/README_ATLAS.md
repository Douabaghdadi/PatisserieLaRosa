# 🗄️ Configuration MongoDB Atlas - La Rosa Pâtisserie

## 📖 Documentation disponible

Votre projet est maintenant configuré pour MongoDB Atlas. Voici les guides disponibles :

### 🚀 Pour commencer rapidement
- **`ETAPES_MIGRATION.txt`** - Guide visuel étape par étape (RECOMMANDÉ POUR DÉBUTER)
- **`ATLAS_QUICKSTART.md`** - Guide rapide en markdown

### 📚 Pour plus de détails
- **`MIGRATION_ATLAS.md`** - Guide complet avec dépannage

### 🔧 Scripts utiles
- **`test-atlas-connection.js`** - Teste la connexion à Atlas
- **`check-atlas-setup.js`** - Vérifie votre configuration

## ⚡ Commandes rapides

```bash
# Vérifier que votre .env est bien configuré
npm run check-atlas

# Tester la connexion à MongoDB Atlas
npm run test-atlas

# Démarrer le serveur en mode développement
npm run dev

# Démarrer le serveur en mode production
npm run start

# Peupler la base de données
npm run seed
```

## 📋 Checklist rapide

1. ✅ Créer un compte sur [MongoDB Atlas](https://cloud.mongodb.com)
2. ✅ Créer un cluster gratuit (M0)
3. ✅ Créer un utilisateur de base de données
4. ✅ Autoriser votre IP (0.0.0.0/0 pour le dev)
5. ✅ Obtenir l'URI de connexion
6. ✅ Mettre à jour `backend/.env` avec votre URI
7. ✅ Exécuter `npm run check-atlas`
8. ✅ Exécuter `npm run test-atlas`
9. ✅ Migrer vos données avec MongoDB Compass
10. ✅ Démarrer votre application avec `npm run dev`

## 🎯 Format de l'URI Atlas

Votre URI dans `.env` doit ressembler à :

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/larosa?retryWrites=true&w=majority
```

**Points importants :**
- Utilisez `mongodb+srv://` (pas `mongodb://`)
- Remplacez `username` et `password` par vos identifiants
- Ajoutez `/larosa` pour spécifier le nom de la base de données
- Gardez les options `?retryWrites=true&w=majority`

## 🔐 Sécurité

- ⚠️ Ne commitez JAMAIS votre fichier `.env`
- ✅ Le `.env` est déjà dans `.gitignore`
- ✅ Utilisez `.env.example` comme template
- 🔒 Utilisez des mots de passe forts
- 🌐 En production, limitez l'accès aux IPs spécifiques

## 🆘 Problèmes courants

### Erreur : "bad auth"
→ Vérifiez votre username et password dans l'URI

### Erreur : "MongoServerSelectionError"
→ Vérifiez que votre IP est autorisée dans Network Access

### Erreur : "ENOTFOUND"
→ Vérifiez l'URI de connexion et votre connexion internet

### Caractères spéciaux dans le mot de passe
Si votre mot de passe contient `@`, `:`, `/`, etc., encodez-les :
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`

## 📞 Support

- Documentation MongoDB Atlas : https://docs.atlas.mongodb.com/
- MongoDB University (gratuit) : https://university.mongodb.com/
- Support MongoDB : https://support.mongodb.com/

## 🎉 Prêt à commencer ?

Ouvrez `ETAPES_MIGRATION.txt` et suivez le guide étape par étape !
