const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController');

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);

// Food & Dashboard
router.get('/search', foodController.searchFood);
router.post('/log-food', foodController.addFoodLog);
router.post('/dashboard-data', foodController.checkDashboardData);
router.get('/today-logs', foodController.getTodayLogs);

// Lifestyle (Minum & Olahraga) -- BARU
router.get('/lifestyle', foodController.getLifestyleLogs);
router.post('/update-lifestyle', foodController.updateLifestyleLog);

// Profile & History
router.get('/user-profile', foodController.getUserProfile);
router.get('/history-all', foodController.getAllHistory);
router.post('/update-weight', foodController.updateWeight);
router.get('/weight-history', foodController.getWeightHistory);

module.exports = router;