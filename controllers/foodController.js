const db = require('../config/db');

// --- 1. SEARCH FOOD ---
exports.searchFood = (req, res) => {
    const keyword = req.query.q;
    if (!keyword) return res.json({ results: [] });
    const sql = `SELECT id, name, serving_desc, calories, sugar_g, protein_g, fat_g, carbs_g, fiber_g FROM foods WHERE name LIKE ? LIMIT 15`;
    db.query(sql, [`%${keyword}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ results });
    });
};

// --- 2. SIMPAN LOG MAKANAN ---
exports.addFoodLog = (req, res) => {
    const { user_id, food_name, portion, sugar, calories, protein, fat, carbs, fiber, manual_time } = req.body;

    // Logic Waktu Otomatis
    let mealTime = manual_time; 
    if (!mealTime) {
        const now = new Date();
        const hour = now.getHours();
        mealTime = 'Malam'; 
        if (hour >= 4 && hour < 11) mealTime = 'Pagi';
        else if (hour >= 11 && hour < 15) mealTime = 'Siang';
        else if (hour >= 15 && hour < 18) mealTime = 'Snack';
    }

    const p = parseFloat(portion) || 1;
    const totalSugar = (parseFloat(sugar) || 0) * p;
    const totalCals  = (parseFloat(calories) || 0) * p;
    const totalProt  = (parseFloat(protein) || 0) * p;
    const totalFat   = (parseFloat(fat) || 0) * p;
    const totalCarbs = (parseFloat(carbs) || 0) * p;
    const totalFiber = (parseFloat(fiber) || 0) * p;

    const sql = `INSERT INTO daily_logs (user_id, food_name, portion_amount, meal_time, log_time, date_log, sugar_intake, calories_intake, protein_intake, fat_intake, carbs_intake, fiber_intake) VALUES (?, ?, ?, ?, CURTIME(), CURDATE(), ?, ?, ?, ?, ?, ?)`;
    const values = [user_id, food_name, p, mealTime, totalSugar, totalCals, totalProt, totalFat, totalCarbs, totalFiber];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 'success', message: `Tercatat sebagai ${mealTime}!` });
    });
};

// --- 3. DASHBOARD DATA ---
exports.checkDashboardData = (req, res) => {
    const { user_id } = req.body;
    db.query('SELECT sugar_limit_gram, calorie_limit FROM users WHERE id = ?', [user_id], (err, resUser) => {
        if (err || resUser.length === 0) return res.status(404).json({ message: "User not found" });

        const limitGula = resUser[0].sugar_limit_gram;
        const limitKalori = resUser[0].calorie_limit;

        const sql = `
            SELECT 
                SUM(sugar_intake) as total_sugar, 
                SUM(calories_intake) as total_calories,
                SUM(protein_intake) as total_protein,
                SUM(fiber_intake) as total_fiber
            FROM daily_logs 
            WHERE user_id = ? AND date_log = CURDATE()
        `;
        
        db.query(sql, [user_id], (err, resLog) => {
            if(err) return res.status(500).json({ error: err.message });

            const curGula = resLog[0].total_sugar || 0;
            const curKal = resLog[0].total_calories || 0;
            const curProt = resLog[0].total_protein || 0;
            const curFiber = resLog[0].total_fiber || 0;
            
            let colorGula = "green"; if ((curGula/limitGula) > 1) colorGula = "red"; else if ((curGula/limitGula) > 0.8) colorGula = "yellow";
            let colorKal = "blue"; if ((curKal/limitKalori) > 1) colorKal = "red"; else if ((curKal/limitKalori) > 0.8) colorKal = "orange";

            res.json({
                limit_user: limitGula,
                current_intake: parseFloat(curGula).toFixed(1),
                persentase: Math.round((curGula/limitGula) * 100) + "%",
                ui_color: colorGula,
                limit_kalori: limitKalori,
                current_kalori: curKal,
                persentase_kalori: Math.round((curKal/limitKalori) * 100) + "%",
                color_kalori: colorKal,
                total_protein: parseFloat(curProt).toFixed(1),
                total_fiber: parseFloat(curFiber).toFixed(1)
            });
        });
    });
};

// --- 4. GET LIFESTYLE (Kirim Data Lengkap) ---
exports.getLifestyleLogs = (req, res) => {
    const user_id = req.query.user_id;
    db.query(`SELECT * FROM lifestyle_logs WHERE user_id = ? AND date_log = CURDATE()`, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.json({ water: 0, exercise: 0, calories: 0, last_type: '-' });
        }
        res.json({ 
            water: results[0].water_intake_ml, 
            exercise: results[0].exercise_minutes,
            calories: results[0].calories_burned || 0,
            last_type: results[0].exercise_type || '-'
        });
    });
};

// --- 5. UPDATE LIFESTYLE (Tangkap Nama Olahraga & Hitung Kalori) ---
exports.updateLifestyleLog = (req, res) => {
    // Tangkap sport_name dari Frontend
    const { user_id, type, value, sport_name } = req.body; 
    
    // Estimasi Kalori: Durasi * 7
    let calBurned = 0;
    if(type === 'exercise') {
        calBurned = parseInt(value) * 7; 
    }

    db.query(`SELECT id FROM lifestyle_logs WHERE user_id = ? AND date_log = CURDATE()`, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            // INSERT BARU
            let sql = "";
            let val = [];
            if(type === 'water') {
                sql = `INSERT INTO lifestyle_logs (user_id, date_log, water_intake_ml, exercise_minutes, calories_burned) VALUES (?, CURDATE(), ?, 0, 0)`;
                val = [user_id, value];
            } else {
                // Simpan exercise_type dan calories_burned
                sql = `INSERT INTO lifestyle_logs (user_id, date_log, water_intake_ml, exercise_minutes, exercise_type, calories_burned) VALUES (?, CURDATE(), 0, ?, ?, ?)`;
                val = [user_id, value, sport_name, calBurned];
            }
            db.query(sql, val, (err2) => {
                if(err2) return res.status(500).json({ error: err2.message });
                res.json({ status: 'success', added_cal: calBurned });
            });
        } else {
            // UPDATE EXISTING
            let sql = "";
            let val = [];
            if(type === 'water') {
                sql = `UPDATE lifestyle_logs SET water_intake_ml = water_intake_ml + ? WHERE id = ?`;
                val = [value, results[0].id];
            } else {
                // Update Menit + Kalori + Nama Olahraga
                sql = `UPDATE lifestyle_logs SET exercise_minutes = exercise_minutes + ?, exercise_type = ?, calories_burned = calories_burned + ? WHERE id = ?`;
                val = [value, sport_name, calBurned, results[0].id];
            }
            db.query(sql, val, (err2) => {
                if(err2) return res.status(500).json({ error: err2.message });
                res.json({ status: 'success', added_cal: calBurned });
            });
        }
    });
};

// --- FUNGSI LAIN ---
exports.getTodayLogs = (req, res) => {
    const user_id = req.query.user_id;
    db.query(`SELECT * FROM daily_logs WHERE user_id = ? AND date_log = CURDATE() ORDER BY log_time DESC`, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};

exports.getUserProfile = (req, res) => {
    const user_id = req.query.user_id;
    db.query(`SELECT * FROM users WHERE id = ?`, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "User not found" });
        res.json({ data: result[0] });
    });
};

exports.getAllHistory = (req, res) => {
    const user_id = req.query.user_id;
    db.query(`SELECT * FROM daily_logs WHERE user_id = ? ORDER BY date_log DESC, log_time DESC`, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};

exports.updateWeight = (req, res) => {
    const { user_id, new_weight } = req.body;
    db.query(`UPDATE users SET weight = ? WHERE id = ?`, [new_weight, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query(`INSERT INTO weight_logs (user_id, weight, recorded_at) VALUES (?, ?, NOW())`, [user_id, new_weight], (err2) => {
            res.json({ status: 'success', message: 'Berat diperbarui!' });
        });
    });
};

exports.getWeightHistory = (req, res) => {
    const user_id = req.query.user_id;
    db.query(`SELECT weight, DATE_FORMAT(recorded_at, '%d %b') as date_label FROM weight_logs WHERE user_id = ? ORDER BY recorded_at ASC LIMIT 10`, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};