const mongoose = require('mongoose');
require('dotenv').config();

const Flavor = require('./models/Flavor');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wstore')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

const flavors = [
  { name: 'Chocolat', description: 'Saveur chocolat', color: '#6F4E37' },
  { name: 'Vanille', description: 'Saveur vanille', color: '#F3E5AB' },
  { name: 'Fraise', description: 'Saveur fraise', color: '#FC5A8D' },
  { name: 'Pistache', description: 'Saveur pistache', color: '#93C572' },
  { name: 'Café', description: 'Saveur café', color: '#6F4E37' },
  { name: 'Caramel', description: 'Saveur caramel', color: '#C68E17' },
  { name: 'Citron', description: 'Saveur citron', color: '#FFF44F' },
  { name: 'Framboise', description: 'Saveur framboise', color: '#E30B5C' },
  { name: 'Noisette', description: 'Saveur noisette', color: '#8B4513' },
  { name: 'Amande', description: 'Saveur amande', color: '#FFEBCD' },
  { name: 'Noix de coco', description: 'Saveur noix de coco', color: '#FFFFFF' },
  { name: 'Mangue', description: 'Saveur mangue', color: '#FFB347' },
  { name: 'Passion', description: 'Saveur fruit de la passion', color: '#FFA500' },
  { name: 'Rose', description: 'Saveur rose', color: '#FFB6C1' },
  { name: 'Menthe', description: 'Saveur menthe', color: '#98FF98' },
  { name: 'Orange', description: 'Saveur orange', color: '#FFA500' },
  { name: 'Cassis', description: 'Saveur cassis', color: '#2E0854' },
  { name: 'Spéculoos', description: 'Saveur spéculoos', color: '#C19A6B' },
  { name: 'Tiramisu', description: 'Saveur tiramisu', color: '#D2B48C' },
  { name: 'Praliné', description: 'Saveur praliné', color: '#8B4513' }
];

async function seedFlavors() {
  try {
    await Flavor.deleteMany({});
    console.log('Goûts existants supprimés');
    
    await Flavor.insertMany(flavors);
    console.log(`${flavors.length} goûts ajoutés avec succès`);
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

seedFlavors();
