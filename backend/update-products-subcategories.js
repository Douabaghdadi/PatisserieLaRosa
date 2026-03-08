const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Subcategory = require('./models/Subcategory');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wstore')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

async function updateProductsWithSubcategories() {
  try {
    console.log('🔄 Mise à jour des produits avec sous-catégories...\n');

    // Récupérer toutes les sous-catégories
    const subcategories = await Subcategory.find().populate('category');
    console.log(`✅ ${subcategories.length} sous-catégories trouvées\n`);

    // Créer un mapping des sous-catégories par nom
    const subcategoryMap = {};
    subcategories.forEach(sub => {
      subcategoryMap[sub.name.toLowerCase()] = sub;
    });

    // Récupérer tous les produits
    const products = await Product.find().populate('category');
    console.log(`✅ ${products.length} produits trouvés\n`);

    let updatedCount = 0;

    // Associer les sous-catégories aux produits en fonction de leur nom
    for (const product of products) {
      const productName = product.name.toLowerCase();
      const matchingSubcategories = [];

      // Chercher les sous-catégories qui correspondent au nom du produit
      if (productName.includes('macaron')) {
        const macaronSub = subcategories.find(s => s.name.toLowerCase().includes('macaron'));
        if (macaronSub) matchingSubcategories.push(macaronSub._id);
      }
      
      if (productName.includes('éclair') || productName.includes('eclair')) {
        const eclairSub = subcategories.find(s => s.name.toLowerCase().includes('éclair'));
        if (eclairSub) matchingSubcategories.push(eclairSub._id);
      }
      
      if (productName.includes('tarte')) {
        const tarteSub = subcategories.find(s => s.name.toLowerCase().includes('tarte'));
        if (tarteSub) matchingSubcategories.push(tarteSub._id);
      }
      
      if (productName.includes('millefeuille')) {
        const millefeuileSub = subcategories.find(s => s.name.toLowerCase().includes('millefeuille'));
        if (millefeuileSub) matchingSubcategories.push(millefeuileSub._id);
      }
      
      if (productName.includes('glace')) {
        const glaceSub = subcategories.find(s => s.name.toLowerCase().includes('glace'));
        if (glaceSub) matchingSubcategories.push(glaceSub._id);
      }
      
      if (productName.includes('sorbet')) {
        const sorbetSub = subcategories.find(s => s.name.toLowerCase().includes('sorbet'));
        if (sorbetSub) matchingSubcategories.push(sorbetSub._id);
      }
      
      if (productName.includes('croissant')) {
        const croissantSub = subcategories.find(s => s.name.toLowerCase().includes('croissant'));
        if (croissantSub) matchingSubcategories.push(croissantSub._id);
      }
      
      if (productName.includes('pain au chocolat') || productName.includes('chocolatine')) {
        const painChocolatSub = subcategories.find(s => s.name.toLowerCase().includes('pain'));
        if (painChocolatSub) matchingSubcategories.push(painChocolatSub._id);
      }
      
      if (productName.includes('praliné') || productName.includes('praline')) {
        const pralineSub = subcategories.find(s => s.name.toLowerCase().includes('praliné'));
        if (pralineSub) matchingSubcategories.push(pralineSub._id);
      }
      
      if (productName.includes('truffe')) {
        const truffeSub = subcategories.find(s => s.name.toLowerCase().includes('truffe'));
        if (truffeSub) matchingSubcategories.push(truffeSub._id);
      }

      // Si des sous-catégories correspondent, mettre à jour le produit
      if (matchingSubcategories.length > 0) {
        product.subcategories = matchingSubcategories;
        await product.save();
        updatedCount++;
        console.log(`✅ ${product.name} -> ${matchingSubcategories.length} sous-catégorie(s) associée(s)`);
      }
    }

    console.log(`\n🎉 Mise à jour terminée! ${updatedCount} produits mis à jour.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateProductsWithSubcategories();
