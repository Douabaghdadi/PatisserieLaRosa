// Script de seed pour La Rosa Pâtisserie & Glace
// Exécuter avec: node seed-patisserie.js

const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schémas simplifiés
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
});

const subcategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

const brandSchema = new mongoose.Schema({
  name: String,
  description: String,
  logo: String
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount: Number,
  stock: Number,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }
});

const Category = mongoose.model('Category', categorySchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);
const Brand = mongoose.model('Brand', brandSchema);
const Product = mongoose.model('Product', productSchema);

async function seedDatabase() {
  try {
    console.log('🌹 Début du seed pour La Rosa Pâtisserie...\n');

    // Nettoyer les données existantes
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Données existantes supprimées\n');

    // Créer la marque La Rosa
    const laRosa = await Brand.create({
      name: 'La Rosa',
      description: 'Pâtisserie artisanale de qualité supérieure',
      logo: '/img/logo-la-rosa.png'
    });
    console.log('✅ Marque La Rosa créée\n');

    // Créer les catégories
    const categories = await Category.insertMany([
      {
        name: 'Gâteaux',
        description: 'Gâteaux d\'anniversaire, mariages et occasions spéciales',
        image: '/img/categories/gateaux.jpg'
      },
      {
        name: 'Pâtisseries',
        description: 'Pâtisseries françaises traditionnelles',
        image: '/img/categories/patisseries.jpg'
      },
      {
        name: 'Glaces',
        description: 'Glaces artisanales aux saveurs variées',
        image: '/img/categories/glaces.jpg'
      },
      {
        name: 'Macarons',
        description: 'Macarons français aux saveurs délicates',
        image: '/img/categories/macarons.jpg'
      },
      {
        name: 'Viennoiseries',
        description: 'Croissants, pains au chocolat et brioches',
        image: '/img/categories/viennoiseries.jpg'
      },
      {
        name: 'Chocolats',
        description: 'Chocolats fins et pralinés',
        image: '/img/categories/chocolats.jpg'
      }
    ]);
    console.log('✅ Catégories créées:', categories.map(c => c.name).join(', '), '\n');

    // Créer les sous-catégories
    const subcategories = await Subcategory.insertMany([
      // Gâteaux
      { name: 'Gâteaux d\'anniversaire', category: categories[0]._id },
      { name: 'Gâteaux de mariage', category: categories[0]._id },
      { name: 'Gâteaux personnalisés', category: categories[0]._id },
      
      // Pâtisseries
      { name: 'Éclairs', category: categories[1]._id },
      { name: 'Tartes', category: categories[1]._id },
      { name: 'Millefeuilles', category: categories[1]._id },
      { name: 'Choux', category: categories[1]._id },
      
      // Glaces
      { name: 'Glaces en pot', category: categories[2]._id },
      { name: 'Sorbets', category: categories[2]._id },
      { name: 'Coupes glacées', category: categories[2]._id },
      
      // Macarons
      { name: 'Macarons classiques', category: categories[3]._id },
      { name: 'Macarons spéciaux', category: categories[3]._id },
      
      // Viennoiseries
      { name: 'Croissants', category: categories[4]._id },
      { name: 'Pains au chocolat', category: categories[4]._id },
      { name: 'Brioches', category: categories[4]._id },
      
      // Chocolats
      { name: 'Pralinés', category: categories[5]._id },
      { name: 'Truffes', category: categories[5]._id },
      { name: 'Tablettes', category: categories[5]._id }
    ]);
    console.log('✅ Sous-catégories créées\n');

    // Créer des produits exemples
    const products = await Product.insertMany([
      // Gâteaux
      {
        name: 'Gâteau Forêt Noire',
        description: 'Délicieux gâteau au chocolat avec crème chantilly et cerises',
        price: 45.000,
        discount: 0,
        stock: 5,
        image: '/img/products/foret-noire.jpg',
        category: categories[0]._id,
        subcategory: subcategories[0]._id,
        brand: laRosa._id
      },
      {
        name: 'Gâteau Fraisier',
        description: 'Gâteau léger à la crème mousseline et fraises fraîches',
        price: 42.000,
        discount: 10,
        stock: 8,
        image: '/img/products/fraisier.jpg',
        category: categories[0]._id,
        subcategory: subcategories[0]._id,
        brand: laRosa._id
      },
      {
        name: 'Opéra',
        description: 'Gâteau au café et chocolat, un classique de la pâtisserie française',
        price: 38.000,
        discount: 0,
        stock: 6,
        image: '/img/products/opera.jpg',
        category: categories[0]._id,
        subcategory: subcategories[0]._id,
        brand: laRosa._id
      },
      
      // Pâtisseries
      {
        name: 'Éclair au Chocolat',
        description: 'Éclair garni de crème pâtissière au chocolat',
        price: 4.500,
        discount: 0,
        stock: 20,
        image: '/img/products/eclair-chocolat.jpg',
        category: categories[1]._id,
        subcategory: subcategories[3]._id,
        brand: laRosa._id
      },
      {
        name: 'Tarte aux Fruits',
        description: 'Tarte sablée garnie de crème pâtissière et fruits frais',
        price: 35.000,
        discount: 15,
        stock: 4,
        image: '/img/products/tarte-fruits.jpg',
        category: categories[1]._id,
        subcategory: subcategories[4]._id,
        brand: laRosa._id
      },
      {
        name: 'Millefeuille',
        description: 'Feuilletage croustillant et crème pâtissière vanille',
        price: 6.000,
        discount: 0,
        stock: 15,
        image: '/img/products/millefeuille.jpg',
        category: categories[1]._id,
        subcategory: subcategories[5]._id,
        brand: laRosa._id
      },
      
      // Glaces
      {
        name: 'Glace Vanille Bourbon',
        description: 'Glace artisanale à la vanille de Madagascar (500ml)',
        price: 12.000,
        discount: 0,
        stock: 30,
        image: '/img/products/glace-vanille.jpg',
        category: categories[2]._id,
        subcategory: subcategories[7]._id,
        brand: laRosa._id
      },
      {
        name: 'Glace Pistache',
        description: 'Glace onctueuse à la pistache (500ml)',
        price: 14.000,
        discount: 0,
        stock: 25,
        image: '/img/products/glace-pistache.jpg',
        category: categories[2]._id,
        subcategory: subcategories[7]._id,
        brand: laRosa._id
      },
      {
        name: 'Sorbet Citron',
        description: 'Sorbet rafraîchissant au citron (500ml)',
        price: 10.000,
        discount: 20,
        stock: 20,
        image: '/img/products/sorbet-citron.jpg',
        category: categories[2]._id,
        subcategory: subcategories[8]._id,
        brand: laRosa._id
      },
      
      // Macarons
      {
        name: 'Boîte de 6 Macarons',
        description: 'Assortiment de 6 macarons aux saveurs variées',
        price: 15.000,
        discount: 0,
        stock: 50,
        image: '/img/products/macarons-6.jpg',
        category: categories[3]._id,
        subcategory: subcategories[10]._id,
        brand: laRosa._id
      },
      {
        name: 'Boîte de 12 Macarons',
        description: 'Assortiment de 12 macarons aux saveurs variées',
        price: 28.000,
        discount: 10,
        stock: 40,
        image: '/img/products/macarons-12.jpg',
        category: categories[3]._id,
        subcategory: subcategories[10]._id,
        brand: laRosa._id
      },
      
      // Viennoiseries
      {
        name: 'Croissant au Beurre',
        description: 'Croissant pur beurre croustillant',
        price: 2.500,
        discount: 0,
        stock: 100,
        image: '/img/products/croissant.jpg',
        category: categories[4]._id,
        subcategory: subcategories[12]._id,
        brand: laRosa._id
      },
      {
        name: 'Pain au Chocolat',
        description: 'Viennoiserie feuilletée avec deux barres de chocolat',
        price: 3.000,
        discount: 0,
        stock: 80,
        image: '/img/products/pain-chocolat.jpg',
        category: categories[4]._id,
        subcategory: subcategories[13]._id,
        brand: laRosa._id
      },
      
      // Chocolats
      {
        name: 'Boîte de Pralinés 250g',
        description: 'Assortiment de pralinés fins au chocolat',
        price: 25.000,
        discount: 0,
        stock: 30,
        image: '/img/products/pralines.jpg',
        category: categories[5]._id,
        subcategory: subcategories[15]._id,
        brand: laRosa._id
      },
      {
        name: 'Truffes au Chocolat',
        description: 'Truffes au chocolat noir 70% cacao (200g)',
        price: 22.000,
        discount: 15,
        stock: 25,
        image: '/img/products/truffes.jpg',
        category: categories[5]._id,
        subcategory: subcategories[16]._id,
        brand: laRosa._id
      }
    ]);
    
    console.log('✅ Produits créés:', products.length, 'produits\n');
    
    console.log('🎉 Seed terminé avec succès!\n');
    console.log('📊 Résumé:');
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${subcategories.length} sous-catégories`);
    console.log(`   - ${products.length} produits`);
    console.log(`   - 1 marque (La Rosa)\n`);
    
    console.log('🌹 La Rosa Pâtisserie est prête!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedDatabase();
