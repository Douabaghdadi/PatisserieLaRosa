const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, statsController.getDashboardStats);

module.exports = router;
