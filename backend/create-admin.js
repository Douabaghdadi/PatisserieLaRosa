const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@larosa.tn' });
    if (existingAdmin) {
      console.log('⚠️  Un compte admin existe déjà avec cet email');
      console.log('Email:', existingAdmin.email);
      console.log('Rôle:', existingAdmin.role);
      process.exit(0);
    }

    // Créer un nouveau compte admin
    const hashedPassword = await bcrypt.hash('Admin@2024', 10);
    const admin = new User({
      name: 'Administrateur La Rosa',
      email: 'admin@larosa.tn',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    
    console.log('\n✅ Compte administrateur créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@larosa.tn');
    console.log('🔑 Password: Admin@2024');
    console.log('👤 Rôle:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error);
    process.exit(1);
  }
}

createAdmin();
