const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/parapharmacie');

async function migrate() {
  try {
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    const products = await productsCollection.find({}).toArray();
    console.log(`Nombre de produits: ${products.length}`);
    
    for (const product of products) {
      console.log(`\nProduit: ${product.name}`);
      console.log(`  subcategory: ${product.subcategory}`);
      console.log(`  subcategories: ${product.subcategories}`);
      
      if (product.subcategory && (!product.subcategories || product.subcategories.length === 0)) {
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { subcategories: [product.subcategory] } }
        );
        console.log(`  -> Migré !`);
      }
    }
    
    console.log('\nMigration terminée !');
    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
}

setTimeout(migrate, 1000);
