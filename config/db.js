const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Default XAMPP
    password: '',      // Default XAMPP kosong
    database: 'gluco_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database Gagal: ' + err.stack);
        return;
    }
    console.log('✅ Database MySQL Terkoneksi!');
});

module.exports = db;