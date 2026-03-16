const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔄 Test de connexion à MongoDB Atlas...\n');

// Masquer le mot de passe dans l'affichage
const displayUri = process.env.MONGODB_URI.replace(/:([^:@]{3})[^:@]*@/, ':***@');
console.log('URI de connexion:', displayUri);
console.log('');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(async () => {
    console.log('✅ Connexion réussie à MongoDB Atlas!\n');
    
    // Afficher les informations de connexion
    const connection = mongoose.connection;
    console.log('📊 Informations de connexion:');
    console.log('   - Base de données:', connection.db.databaseName);
    console.log('   - Host:', connection.host);
    console.log('   - Port:', connection.port);
    console.log('');
    
    // Lister les collections
    try {
      const collections = await connection.db.listCollections().toArray();
      console.log('📁 Collections disponibles:', collections.length);
      collections.forEach(col => {
        console.log('   -', col.name);
      });
      console.log('');
      
      // Compter les documents dans chaque collection
      if (collections.length > 0) {
        console.log('📈 Nombre de documents par collection:');
        for (const col of collections) {
          const count = await connection.db.collection(col.name).countDocuments();
          console.log(`   - ${col.name}: ${count} documents`);
        }
      }
    } catch (error) {
      console.log('⚠️  Impossible de lister les collections:', error.message);
    }
    
    console.log('\n✅ Test terminé avec succès!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MongoDB Atlas:\n');
    console.error('Message:', err.message);
    console.error('');
    
    // Suggestions basées sur le type d'erreur
    if (err.message.includes('bad auth')) {
      console.log('💡 Suggestions:');
      console.log('   - Vérifiez votre nom d\'utilisateur et mot de passe');
      console.log('   - Assurez-vous que l\'utilisateur existe dans Database Access');
      console.log('   - Si le mot de passe contient des caractères spéciaux, encodez-les en URL');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.log('💡 Suggestions:');
      console.log('   - Vérifiez l\'URI de connexion dans votre fichier .env');
      console.log('   - Vérifiez votre connexion internet');
      console.log('   - Assurez-vous que le cluster est actif dans Atlas');
    } else if (err.message.includes('MongoServerSelectionError')) {
      console.log('💡 Suggestions:');
      console.log('   - Vérifiez que votre IP est autorisée dans Network Access');
      console.log('   - Essayez d\'autoriser toutes les IPs (0.0.0.0/0) pour le test');
      console.log('   - Vérifiez que le cluster est actif');
    }
    
    console.log('');
    console.log('📖 Consultez MIGRATION_ATLAS.md pour plus d\'aide');
    process.exit(1);
  });
