const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');

async function updateCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Mettre à jour "Cadeaux et Coffrets" vers "Gâteaux"
    const cadeauxUpdate = await Category.findOneAndUpdate(
      { name: { $regex: /cadeaux/i } },
      { 
        name: 'Gâteaux',
        description: 'Gâteaux d\'anniversaire, mariages et occasions spéciales'
      },
      { new: true }
    );

    if (cadeauxUpdate) {
      console.log('✅ Catégorie mise à jour: "Cadeaux et Coffrets" → "Gâteaux"');
      console.log('   ID:', cadeauxUpdate._id);
      console.log('   Nouveau nom:', cadeauxUpdate.name);
    } else {
      console.log('⚠️  Catégorie "Cadeaux" non trouvée');
    }

    // Mettre à jour "Pâtisserie" vers "Pâtisserie Fine"
    const patisserieUpdate = await Category.findOneAndUpdate(
      { name: { $regex: /^pâtisserie$/i } },
      { 
        name: 'Pâtisserie Fine',
        description: 'Pâtisseries françaises traditionnelles et créations raffinées'
      },
      { new: true }
    );

    if (patisserieUpdate) {
      console.log('✅ Catégorie mise à jour: "Pâtisserie" → "Pâtisserie Fine"');
      console.log('   ID:', patisserieUpdate._id);
      console.log('   Nouveau nom:', patisserieUpdate.name);
    } else {
      console.log('⚠️  Catégorie "Pâtisserie" non trouvée');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Mise à jour terminée !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Afficher toutes les catégories
    const allCategories = await Category.find({});
    console.log('📋 Liste des catégories actuelles:');
    allCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name}`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    process.exit(1);
  }
}

updateCategories();
