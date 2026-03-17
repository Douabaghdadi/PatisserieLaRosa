// Script de vérification du système
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const checkSystem = async () => {
  console.log('🔍 Vérification du système...\n');

  // 1. Vérifier les variables d'environnement
  console.log('📋 Variables d\'environnement:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Manquant');
  console.log('   PORT:', process.env.PORT || '5000 (par défaut)');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Défini' : '❌ Manquant');
  console.log('');

  // 2. Vérifier la connexion MongoDB
  console.log('🗄️  Connexion à MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ MongoDB connecté avec succès\n');

    // 3. Vérifier les collections
    console.log('📊 Statistiques de la base de données:');
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const User = require('./models/User');
    const Order = require('./models/Order');

    const productsCount = await Product.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();

    console.log(`   Produits: ${productsCount}`);
    console.log(`   Catégories: ${categoriesCount}`);
    console.log(`   Utilisateurs: ${usersCount}`);
    console.log(`   Commandes: ${ordersCount}`);
    console.log('');

    // 4. Vérifier les admins
    const admins = await User.find({ role: 'admin' });
    console.log(`👤 Administrateurs: ${admins.length}`);
    if (admins.length > 0) {
      admins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.name || 'Sans nom'})`);
      });
    } else {
      console.log('   ⚠️  Aucun administrateur trouvé !');
    }
    console.log('');

    // 5. Recommandations
    console.log('💡 Recommandations:');
    if (productsCount === 0) {
      console.log('   ⚠️  Aucun produit - Ajoutez des produits via l\'interface admin');
    }
    if (categoriesCount === 0) {
      console.log('   ⚠️  Aucune catégorie - Créez des catégories d\'abord');
    }
    if (admins.length === 0) {
      console.log('   ⚠️  Aucun admin - Créez un compte admin pour accéder au dashboard');
    }
    if (productsCount > 0 && categoriesCount > 0 && admins.length > 0) {
      console.log('   ✅ Tout semble bon ! Vous pouvez démarrer l\'application.');
    }
    console.log('');

    console.log('✨ Vérification terminée !');
    process.exit(0);
  } catch (error) {
    console.log('   ❌ Erreur de connexion à MongoDB');
    console.log('   Erreur:', error.message);
    console.log('');
    console.log('💡 Solutions possibles:');
    console.log('   1. Vérifiez que MongoDB est démarré');
    console.log('   2. Vérifiez votre MONGODB_URI dans le fichier .env');
    console.log('   3. Essayez: mongosh (pour tester la connexion)');
    process.exit(1);
  }
};

checkSystem();
