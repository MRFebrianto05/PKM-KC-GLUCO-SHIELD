// File: controllers/foodController.js
const db = require('../config/db');

// 1. CEK STATUS DASHBOARD (GULA & KALORI)
exports.checkDashboardData = (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: "User ID missing" });

    // Ambil Limit Gula & Kalori User
    db.query('SELECT sugar_limit_gram, calorie_limit FROM users WHERE id = ?', [user_id], (err, resUser) => {
        if (err || resUser.length === 0) return res.status(404).json({ message: "User not found" });

        const limitGula = resUser[0].sugar_limit_gram;
        const limitKalori = resUser[0].calorie_limit;

        // Ambil Total Intake Hari Ini (Gula & Kalori)
        db.query('SELECT SUM(sugar_intake) as total_sugar, SUM(calories_intake) as total_calories FROM daily_logs WHERE user_id = ? AND date_log = CURDATE()', [user_id], (err, resLog) => {
            
            // --- LOGIC GULA ---
            const curGula = resLog[0].total_sugar || 0;
            const perGula = Math.round((curGula / limitGula) * 100);
            
            let colorGula = "green";
            if (perGula > 100) colorGula = "red";
            else if (perGula > 80) colorGula = "yellow";

            // --- LOGIC KALORI (BARU) ---
            const curKal = resLog[0].total_calories || 0;
            const perKal = Math.round((curKal / limitKalori) * 100);
            
            let colorKal = "blue";
            if (perKal > 100) colorKal = "red";
            else if (perKal > 80) colorKal = "orange";

            res.json({
                // Data Gula
                limit_user: limitGula,
                current_intake: curGula,
                persentase: perGula + "%",
                ui_color: colorGula,
                
                // Data Kalori
                limit_kalori: limitKalori,
                current_kalori: curKal,
                persentase_kalori: perKal + "%",
                color_kalori: colorKal
            });
        });
    });
};

// ... (Fungsi searchFood, addFoodLog, getTodayLogs, dll TETAP SAMA seperti sebelumnya) ...
// Agar tidak error, pastikan copy fungsi lain di bawah ini:

exports.searchFood = (req, res) => {
    const keyword = req.query.q;
    if (!keyword) return res.json({ results: [] });
    db.query(`SELECT * FROM foods WHERE name LIKE ?`, [`%${keyword}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ results });
    });
};

exports.addFoodLog = (req, res) => {
    const { user_id, food_name, sugar_g, calories } = req.body;
    const sql = `INSERT INTO daily_logs (user_id, food_name, sugar_intake, calories_intake, date_log) VALUES (?, ?, ?, ?, CURDATE())`;
    db.query(sql, [user_id, food_name, sugar_g, calories], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 'success', message: 'Makanan berhasil dicatat!' });
    });
};

exports.getTodayLogs = (req, res) => {
    const user_id = req.query.user_id;
    const sql = `SELECT * FROM daily_logs WHERE user_id = ? AND date_log = CURDATE() ORDER BY id DESC`;
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};

exports.getUserProfile = (req, res) => {
    const user_id = req.query.user_id;
    const sql = `SELECT username, weight, height, age, gender, activity_level, sugar_limit_gram, calorie_limit FROM users WHERE id = ?`; // update query
    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });
        res.json({ data: result[0] });
    });
};

exports.getAllHistory = (req, res) => {
    const user_id = req.query.user_id;
    const sql = `SELECT * FROM daily_logs WHERE user_id = ? ORDER BY date_log DESC, id DESC`;
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};