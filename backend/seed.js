const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import des modèles
const User = require('./models/User');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Brand = require('./models/Brand');
const Product = require('./models/Product');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Nettoyer la base de données
    await User.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});

    // Créer un utilisateur admin avec mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@wstore.com',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Utilisateur admin créé');

    // Créer des catégories
    const categories = [
      { name: 'Smartphones', description: 'Téléphones intelligents' },
      { name: 'Accessoires', description: 'Accessoires pour appareils' },
      { name: 'Audio', description: 'Équipements audio' }
    ];

    const createdCategories = [];
    for (const cat of categories) {
      const category = new Category(cat);
      await category.save();
      createdCategories.push(category);
      console.log(`Catégorie créée: ${category.name}`);
    }

    // Créer des marques
    const brands = [
      { name: 'Apple', description: 'Marque technologique américaine' },
      { name: 'Samsung', description: 'Marque technologique coréenne' },
      { name: 'Sony', description: 'Marque électronique japonaise' }
    ];

    const createdBrands = [];
    for (const brand of brands) {
      const newBrand = new Brand(brand);
      await newBrand.save();
      createdBrands.push(newBrand);
      console.log(`Marque créée: ${newBrand.name}`);
    }

    // Créer des sous-catégories
    const subcategories = [
      { name: 'iPhone', category: createdCategories[0]._id },
      { name: 'Galaxy', category: createdCategories[0]._id },
      { name: 'Coques', category: createdCategories[1]._id },
      { name: 'Écouteurs', category: createdCategories[2]._id }
    ];

    const createdSubcategories = [];
    for (const subcat of subcategories) {
      const subcategory = new Subcategory(subcat);
      await subcategory.save();
      createdSubcategories.push(subcategory);
      console.log(`Sous-catégorie créée: ${subcategory.name}`);
    }

    // Créer des produits
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Le dernier iPhone d\'Apple',
        price: 1199,
        category: createdCategories[0]._id,
        subcategories: [createdSubcategories[0]._id],
        brand: createdBrands[0]._id,
        stock: 50,
        images: ['iphone15pro.jpg']
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Smartphone Samsung haut de gamme',
        price: 999,
        category: createdCategories[0]._id,
        subcategories: [createdSubcategories[1]._id],
        brand: createdBrands[1]._id,
        stock: 30,
        images: ['galaxys24.jpg']
      },
      {
        name: 'AirPods Pro',
        description: 'Écouteurs sans fil Apple',
        price: 279,
        category: createdCategories[2]._id,
        subcategories: [createdSubcategories[3]._id],
        brand: createdBrands[0]._id,
        stock: 100,
        images: ['airpods.jpg']
      }
    ];

    for (const prod of products) {
      const product = new Product(prod);
      await product.save();
      console.log(`Produit créé: ${product.name}`);
    }

    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('👤 Admin: admin@wstore.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

seedDatabase();