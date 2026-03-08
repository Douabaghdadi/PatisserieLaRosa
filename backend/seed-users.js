const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Ne pas supprimer tous les utilisateurs, juste ajouter ceux qui n'existent pas
    console.log('📝 Création des utilisateurs de test...\n');

    const users = [
      {
        name: 'Administrateur La Rosa',
        email: 'admin@larosa.tn',
        password: 'Admin@2024',
        role: 'admin',
        phone: '+216 70 123 456'
      },
      {
        name: 'Admin Test',
        email: 'admin@wstore.com',
        password: 'admin123',
        role: 'admin',
        phone: '+216 70 111 222'
      },
      {
        name: 'Dina Baghdadi',
        email: 'dousabaghdadi45@live.fr',
        password: 'client123',
        role: 'client',
        phone: '+216 98 765 432',
        facebookId: '6977486922454577f744b6'
      },
      {
        name: 'Mohamed Ben Ali',
        email: 'mohamed.benali@gmail.com',
        password: 'client123',
        role: 'client',
        phone: '+216 22 333 444',
        address: 'Avenue Habib Bourguiba, Tunis'
      },
      {
        name: 'Fatma Trabelsi',
        email: 'fatma.trabelsi@yahoo.fr',
        password: 'client123',
        role: 'client',
        phone: '+216 55 666 777',
        address: 'Rue de la République, Sousse'
      },
      {
        name: 'Ahmed Mansour',
        email: 'ahmed.mansour@hotmail.com',
        password: 'client123',
        role: 'client',
        phone: '+216 23 888 999',
        address: 'Boulevard 7 Novembre, Sfax'
      },
      {
        name: 'Leila Hamdi',
        email: 'leila.hamdi@gmail.com',
        password: 'client123',
        role: 'client',
        phone: '+216 98 111 222',
        address: 'Avenue de la Liberté, Nabeul'
      },
      {
        name: 'Karim Jebali',
        email: 'karim.jebali@outlook.com',
        password: 'client123',
        role: 'client',
        phone: '+216 52 333 444'
      },
      {
        name: 'Sonia Gharbi',
        email: 'sonia.gharbi@gmail.com',
        password: 'client123',
        role: 'client',
        phone: '+216 26 555 666',
        address: 'Rue Mongi Slim, Bizerte'
      },
      {
        name: 'Youssef Khelifi',
        email: 'youssef.khelifi@gmail.com',
        password: 'client123',
        role: 'client',
        phone: '+216 99 777 888'
      },
      {
        name: 'Amira Sassi',
        email: 'amira.sassi@yahoo.fr',
        password: 'client123',
        role: 'client',
        phone: '+216 54 999 000',
        address: 'Avenue Farhat Hached, Monastir'
      },
      {
        name: 'Mehdi Bouazizi',
        email: 'mehdi.bouazizi@gmail.com',
        password: 'client123',
        role: 'client',
        phone: '+216 21 222 333'
      }
    ];

    let created = 0;
    let skipped = 0;

    for (const userData of users) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⏭️  ${userData.email} existe déjà`);
        skipped++;
        continue;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Créer l'utilisateur
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ ${userData.name} (${userData.email}) - ${userData.role}`);
      created++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${created} utilisateurs créés`);
    console.log(`⏭️  ${skipped} utilisateurs déjà existants`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Comptes de test:');
    console.log('   Admin: admin@larosa.tn / Admin@2024');
    console.log('   Admin: admin@wstore.com / admin123');
    console.log('   Client: dousabaghdadi45@live.fr / client123');
    console.log('   Client: mohamed.benali@gmail.com / client123');
    console.log('   (et autres clients avec mot de passe: client123)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
    process.exit(1);
  }
}

seedUsers();
