const mongoose = require('mongoose');

const flavorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  color: String // Couleur pour l'affichage (optionnel)
}, {
  timestamps: true
});

module.exports = mongoose.model('Flavor', flavorSchema);
