-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Jan 2026 pada 16.24
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gluco_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `daily_logs`
--

CREATE TABLE `daily_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `food_name` varchar(100) DEFAULT NULL,
  `sugar_intake` float NOT NULL,
  `calories_intake` float DEFAULT 0,
  `date_log` date DEFAULT curdate(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `daily_logs`
--

INSERT INTO `daily_logs` (`id`, `user_id`, `food_id`, `food_name`, `sugar_intake`, `calories_intake`, `date_log`, `created_at`) VALUES
(1, 2, NULL, 'Nasi Putih', 0.5, 204, '2026-01-23', '2026-01-23 08:30:25'),
(2, 2, NULL, 'Boba Brown Sugar', 35, 400, '2026-01-23', '2026-01-23 08:31:19'),
(3, 2, NULL, 'Kopi Susu Gula Aren', 25, 250, '2026-01-23', '2026-01-23 08:31:40'),
(4, 3, NULL, 'Soto Ayam (Tanpa Nasi)', 2, 250, '2026-01-23', '2026-01-23 08:43:34'),
(5, 3, NULL, 'Thai Tea', 35, 300, '2026-01-23', '2026-01-23 08:44:29'),
(6, 3, NULL, 'Mie Instan Goreng', 4, 380, '2026-01-23', '2026-01-23 09:20:09'),
(7, 2, NULL, 'Es Teh Manis', 20, 90, '2026-01-28', '2026-01-28 14:40:11'),
(8, 2, NULL, 'Nasi Putih', 0.5, 204, '2026-01-28', '2026-01-28 14:40:42'),
(9, 2, NULL, 'Sate Ayam (Tanpa Bumbu Kacang)', 1, 150, '2026-01-28', '2026-01-28 14:41:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `foods`
--

CREATE TABLE `foods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sugar_g` float NOT NULL,
  `calories` float DEFAULT NULL,
  `portion_desc` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `foods`
--

INSERT INTO `foods` (`id`, `name`, `sugar_g`, `calories`, `portion_desc`) VALUES
(1, 'Boba Brown Sugar', 35, 400, '1 Gelas Regular'),
(2, 'Kopi Susu Gula Aren', 25, 250, '1 Cup'),
(3, 'Donat Coklat', 15, 200, '1 Buah'),
(4, 'Nasi Putih', 0.5, 204, '1 Mangkok'),
(5, 'Soda Kaleng', 33, 140, '1 Kaleng (330ml)'),
(6, 'Air Mineral', 0, 0, '1 Botol (600ml)'),
(7, 'Teh Tawar Hangat', 0, 2, '1 Gelas'),
(8, 'Kopi Hitam (Tanpa Gula)', 0, 4, '1 Cangkir'),
(9, 'Telur Rebus', 0.6, 77, '1 Butir Besar'),
(10, 'Tempe Goreng', 0, 34, '1 Potong'),
(11, 'Tahu Goreng', 0, 35, '1 Potong'),
(12, 'Dada Ayam Bakar', 0, 165, '1 Potong'),
(13, 'Ikan Goreng', 0, 200, '1 Ekor Sedang'),
(14, 'Sate Ayam (Tanpa Bumbu Kacang)', 1, 150, '5 Tusuk'),
(15, 'Kerupuk Putih', 0, 65, '1 Keping'),
(16, 'Sayur Bayam Bening', 1.5, 40, '1 Mangkok'),
(17, 'Sayur Asem', 3, 80, '1 Mangkok'),
(18, 'Soto Ayam (Tanpa Nasi)', 2, 250, '1 Mangkok'),
(19, 'Bakso Sapi Kuah', 3, 300, '1 Mangkok (5 butir)'),
(20, 'Mie Instan Goreng', 4, 380, '1 Bungkus'),
(22, 'Roti Tawar Gandum', 3, 90, '1 Lembar'),
(23, 'Alpukat', 1, 160, '1 Buah Sedang'),
(24, 'Kacang Rebus', 2, 150, '1 Mangkok Kecil'),
(25, 'Bubur Ayam (Polos)', 2, 270, '1 Porsi'),
(26, 'Nasi Goreng Spesial', 6, 450, '1 Piring'),
(27, 'Gado-Gado', 8, 320, '1 Porsi (Bumbu Kacang)'),
(28, 'Ketoprak', 10, 400, '1 Porsi'),
(29, 'Sate Ayam (Full Bumbu)', 9, 350, '10 Tusuk'),
(30, 'Apel Merah', 10, 52, '1 Buah Besar'),
(31, 'Pisang Ambon', 12, 105, '1 Buah Sedang'),
(32, 'Jus Jeruk Murni', 8, 110, '1 Gelas'),
(33, 'Susu UHT Full Cream', 11, 150, '1 Kotak (250ml)'),
(34, 'Yoghurt Plain', 7, 100, '1 Cup'),
(35, 'Roti Bakar Coklat', 14, 350, '1 Tangkup'),
(36, 'Es Teh Manis', 20, 90, '1 Gelas'),
(37, 'Kopi Susu Gula Aren', 25, 250, '1 Cup'),
(38, 'Donat Gula Halus', 15, 200, '1 Buah'),
(39, 'Bubur Kacang Hijau', 22, 250, '1 Mangkok'),
(40, 'Es Kelapa Muda (Pake Sirup)', 25, 180, '1 Gelas'),
(41, 'Jus Alpukat (Susu Coklat)', 28, 350, '1 Gelas'),
(42, 'Kolak Pisang', 26, 300, '1 Mangkok'),
(43, 'Minuman Isotonik', 26, 140, '1 Botol (500ml)'),
(44, 'Wafer Coklat', 18, 250, '1 Bungkus Kecil'),
(45, 'Kue Lapis Legit', 17, 300, '1 Potong Kecil'),
(46, 'Soda / Soft Drink', 33, 140, '1 Kaleng (330ml)'),
(47, 'Boba Brown Sugar Milk', 45, 400, '1 Gelas Regular'),
(48, 'Es Campur', 40, 350, '1 Mangkok'),
(49, 'Martabak Manis (Coklat Keju)', 55, 450, '2 Potong'),
(50, 'Minuman Energy Drink', 38, 160, '1 Botol'),
(51, 'Thai Tea', 35, 300, '1 Gelas Besar'),
(52, 'Es Krim Coklat', 32, 280, '1 Cup Sedang'),
(53, 'Kue Brownies', 35, 400, '1 Potong Besar'),
(54, 'Milkshake Strawberry', 50, 450, '1 Gelas Besar'),
(55, 'Cendol / Dawet', 35, 300, '1 Gelas');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `weight` float NOT NULL,
  `height` float NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `activity_level` float NOT NULL,
  `sugar_limit_gram` float DEFAULT 50,
  `calorie_limit` int(11) DEFAULT 2000,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `weight`, `height`, `age`, `gender`, `activity_level`, `sugar_limit_gram`, `calorie_limit`, `created_at`) VALUES
(1, 'Mahasiswa1', NULL, 70, 175, 21, 'M', 1.375, 50, 2000, '2026-01-23 07:23:43'),
(2, 'Febri', 'febri123', 70, 170, 22, 'M', 1.2, 50, 2000, '2026-01-23 08:30:04'),
(3, 'budi', 'budi123', 95, 180, 22, 'M', 1.725, 85, 2000, '2026-01-23 08:35:52');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `daily_logs`
--
ALTER TABLE `daily_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `daily_logs`
--
ALTER TABLE `daily_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `foods`
--
ALTER TABLE `foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `daily_logs`
--
ALTER TABLE `daily_logs`
  ADD CONSTRAINT `daily_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
