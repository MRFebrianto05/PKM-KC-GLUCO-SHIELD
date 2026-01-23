const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path'); // Tambahan modul path biar lebih aman

const app = express();
const PORT = 3000;

// Middleware standar
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =========================================================
// BAGIAN PENTING: Sambungkan ke Folder Public (Frontend)
// =========================================================
app.use(express.static(path.join(__dirname, 'public'))); 
// Artinya: "Hei Server, kalau ada yang buka web, cari filenya di folder 'public'"

// Routing API (Backend)
app.use('/api', apiRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`🚀 GLUCO-SHIELD Server berjalan di http://localhost:${PORT}`);
});