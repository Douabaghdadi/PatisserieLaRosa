const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.get('/', protect, favoriteController.getFavorites);
router.post('/', protect, favoriteController.addFavorite);
router.delete('/:productId', protect, favoriteController.removeFavorite);
router.get('/check/:productId', protect, favoriteController.checkFavorite);

module.exports = router;
