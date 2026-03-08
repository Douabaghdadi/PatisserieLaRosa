const User = require('../models/User');

// Récupérer les favoris d'un utilisateur
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un produit aux favoris
exports.addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ error: 'Produit déjà dans les favoris' });
    }
    
    user.favorites.push(productId);
    await user.save();
    
    res.json({ message: 'Produit ajouté aux favoris', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un produit des favoris
exports.removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    
    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Produit retiré des favoris', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vérifier si un produit est dans les favoris
exports.checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    
    const isFavorite = user.favorites && user.favorites.some(id => id.toString() === productId);
    res.json({ isFavorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
