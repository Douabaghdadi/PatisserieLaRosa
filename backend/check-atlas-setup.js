require('dotenv').config();

console.log('🔍 Vérification de la configuration MongoDB Atlas\n');

let hasErrors = false;

// Vérifier que MONGODB_URI existe
if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI n\'est pas défini dans .env');
  hasErrors = true;
} else {
  const uri = process.env.MONGODB_URI;
  
  // Vérifier le format de l'URI
  if (uri.includes('localhost')) {
    console.log('⚠️  Vous utilisez encore MongoDB local');
    console.log('   URI actuelle:', uri);
    console.log('   Changez-la pour une URI Atlas comme:');
    console.log('   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/larosa?retryWrites=true&w=majority\n');
    hasErrors = true;
  } else if (uri.startsWith('mongodb+srv://')) {
    console.log('✅ Format URI Atlas détecté');
    
    // Vérifier si l'URI contient des placeholders
    if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('<cluster-url>')) {
      console.log('❌ L\'URI contient encore des placeholders');
      console.log('   Remplacez <username>, <password> et <cluster-url> par vos vraies valeurs\n');
      hasErrors = true;
    } else {
      // Masquer le mot de passe
      const displayUri = uri.replace(/:([^:@]{3})[^:@]*@/, ':***@');
      console.log('   URI:', displayUri);
      
      // Vérifier le nom de la base de données
      if (uri.includes('/larosa')) {
        console.log('✅ Nom de base de données "larosa" trouvé');
      } else {
        console.log('⚠️  Le nom de base de données "larosa" n\'est pas dans l\'URI');
        console.log('   Ajoutez /larosa après .mongodb.net/');
      }
      
      // Vérifier les options recommandées
      if (uri.includes('retryWrites=true') && uri.includes('w=majority')) {
        console.log('✅ Options de connexion recommandées présentes');
      } else {
        console.log('⚠️  Options de connexion recommandées manquantes');
        console.log('   Ajoutez: ?retryWrites=true&w=majority');
      }
    }
  } else if (uri.startsWith('mongodb://') && !uri.includes('localhost')) {
    console.log('⚠️  Vous utilisez mongodb:// au lieu de mongodb+srv://');
    console.log('   Pour Atlas, utilisez mongodb+srv://\n');
  } else {
    console.log('❌ Format URI non reconnu');
    console.log('   URI actuelle:', uri);
    hasErrors = true;
  }
}

console.log('');

// Vérifier les autres variables importantes
const requiredVars = ['JWT_SECRET', 'FRONTEND_URL', 'BACKEND_URL'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`⚠️  ${varName} n'est pas défini`);
  }
});

console.log('');

if (hasErrors) {
  console.log('❌ Des erreurs ont été détectées dans votre configuration');
  console.log('📖 Consultez ATLAS_QUICKSTART.md ou MIGRATION_ATLAS.md pour de l\'aide\n');
  console.log('Étapes suivantes:');
  console.log('1. Obtenez votre URI Atlas depuis https://cloud.mongodb.com');
  console.log('2. Mettez à jour MONGODB_URI dans backend/.env');
  console.log('3. Relancez ce script: npm run check-atlas');
  console.log('4. Testez la connexion: npm run test-atlas\n');
  process.exit(1);
} else {
  console.log('✅ Configuration Atlas semble correcte!');
  console.log('');
  console.log('Prochaines étapes:');
  console.log('1. Testez la connexion: npm run test-atlas');
  console.log('2. Migrez vos données avec MongoDB Compass');
  console.log('3. Démarrez votre serveur: npm run dev\n');
  process.exit(0);
}
