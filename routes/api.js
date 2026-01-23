// File: routes/api.js
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authController = require('../controllers/authController');

// --- AUTHENTICATION ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- DASHBOARD FEATURES ---
router.post('/dashboard-data', foodController.checkDashboardData); 
router.get('/search', foodController.searchFood);                  
router.post('/log-food', foodController.addFoodLog);               
router.get('/today-logs', foodController.getTodayLogs);            

// --- PROFILE & HISTORY FEATURES (BARU) ---
router.get('/user-profile', foodController.getUserProfile);
router.get('/history-all', foodController.getAllHistory);

module.exports = router;