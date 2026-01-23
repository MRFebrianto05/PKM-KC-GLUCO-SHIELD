// File: controllers/authController.js
const db = require('../config/db');

// REGISTER (Update: Simpan calorie_limit juga)
exports.register = (req, res) => {
    const { username, password, weight, height, age, gender, activity_level } = req.body;

    if (!username || !password || !weight) {
        return res.status(400).json({ message: "Semua data wajib diisi!" });
    }

    // 1. Hitung BMR (Mifflin-St Jeor)
    let bmr;
    if (gender === 'M') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // 2. Hitung Batas Kalori (TDEE) & Batas Gula
    const tdee = Math.round(bmr * activity_level); // Batas Kalori
    const sugarLimit = Math.round((tdee * 0.10) / 4); // Batas Gula (10% energi)

    // 3. Simpan ke DB
    const sql = `INSERT INTO users (username, password, weight, height, age, gender, activity_level, sugar_limit_gram, calorie_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [username, password, weight, height, age, gender, activity_level, sugarLimit, tdee], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
            status: 'success',
            message: 'Registrasi Berhasil!',
            user_id: result.insertId,
            username: username
        });
    });
};

// LOGIN
exports.login = (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({
                status: 'success',
                message: 'Login Berhasil!',
                user_id: results[0].id,
                username: results[0].username
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Username atau Password salah!' });
        }
    });
};