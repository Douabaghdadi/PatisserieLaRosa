const express = require('express');
const router = express.Router();
const flavorController = require('../controllers/flavorController');
const { protect, admin } = require('../middleware/auth');

// Routes publiques
router.get('/', flavorController.getAllFlavors);
router.get('/:id', flavorController.getFlavorById);

// Routes protégées (admin uniquement)
router.post('/', protect, admin, flavorController.createFlavor);
router.put('/:id', protect, admin, flavorController.updateFlavor);
router.delete('/:id', protect, admin, flavorController.deleteFlavor);

module.exports = router;
