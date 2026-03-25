require('dotenv').config();
const mongoose = require('mongoose');

async function fixImageUrls() {
  // Connexion à MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connecté à MongoDB');
  
  try {
    // Récupérer toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections trouvées:', collections.map(c => c.name).join(', '));

    let totalUpdated = 0;

    // Fixer les URLs dans chaque collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = mongoose.connection.db.collection(collectionName);

      // Trouver tous les documents avec localhost dans les champs image
      const docsWithLocalhost = await collection.find({
        $or: [
          { image: /localhost/ },
          { images: /localhost/ },
          { photo: /localhost/ }
        ]
      }).toArray();

      if (docsWithLocalhost.length > 0) {
        console.log(`\n🔧 Collection "${collectionName}": ${docsWithLocalhost.length} documents à corriger`);

        for (const doc of docsWithLocalhost) {
          const updates = {};

          // Corriger le champ image
          if (doc.image && doc.image.includes('localhost')) {
            updates.image = doc.image
              .replace(/http:\/\/localhost:5000/g, '')
              .replace(/https:\/\/localhost:5000/g, '');
            console.log(`  - ${doc._id}: image "${doc.image}" -> "${updates.image}"`);
          }

          // Corriger le champ images (array)
          if (doc.images && Array.isArray(doc.images)) {
            updates.images = doc.images.map(img => 
              img.replace(/http:\/\/localhost:5000/g, '')
                 .replace(/https:\/\/localhost:5000/g, '')
            );
            if (JSON.stringify(doc.images) !== JSON.stringify(updates.images)) {
              console.log(`  - ${doc._id}: images array corrigé`);
            }
          }

          // Corriger le champ photo
          if (doc.photo && doc.photo.includes('localhost')) {
            updates.photo = doc.photo
              .replace(/http:\/\/localhost:5000/g, '')
              .replace(/https:\/\/localhost:5000/g, '');
            console.log(`  - ${doc._id}: photo "${doc.photo}" -> "${updates.photo}"`);
          }

          // Appliquer les mises à jour
          if (Object.keys(updates).length > 0) {
            await collection.updateOne({ _id: doc._id }, { $set: updates });
            totalUpdated++;
          }
        }
      }
    }

    console.log(`\n✅ Migration terminée ! ${totalUpdated} documents mis à jour.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

fixImageUrls();
