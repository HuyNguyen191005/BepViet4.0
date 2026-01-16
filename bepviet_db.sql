-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 14, 2026 lúc 05:05 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bepviet_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `image_url`) VALUES
(1, 'Món ăn sáng', 'Các món nhẹ nhàng khởi đầu ngày mới', 'logo.png'),
(2, 'Món chính', 'Món mặn ăn với cơm', 'logo.png'),
(3, 'Món tráng miệng', 'Che, banh ngot, hoa qua', 'logo.png'),
(4, 'Miền Bắc', 'Ẩm thực tinh tế đất Bắc', 'logo.png'),
(5, 'Miền Nam', 'Hương vị đậm đà miền Nam', 'logo.png'),
(6, 'Ăn kiêng', 'Low carb, Keto, Eat clean', 'logo.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `collections`
--

CREATE TABLE `collections` (
  `collection_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `collection_recipes`
--

CREATE TABLE `collection_recipes` (
  `collection_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ingredients`
--

INSERT INTO `ingredients` (`ingredient_id`, `name`, `type`) VALUES
(1, 'Thịt bò', 'Thịt'),
(2, 'Thịt gà', 'Thịt'),
(3, 'Trứng gà', 'Trứng/Sữa'),
(4, 'Cà chua', 'Rau củ'),
(5, 'Hành tây', 'Rau củ'),
(6, 'Bánh phở', 'Tinh bột'),
(7, 'Nước mắm', 'Gia vị'),
(8, 'Đường phèn', 'Gia vị'),
(9, 'Gừng', 'Gia vị'),
(10, 'Cá lóc', 'Thủy hải sản');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 4, 'auth_token', 'b15009144c920b2288b77583c14df4fb0af7678f795ad5f39739f52d9e05d63e', '[\"*\"]', NULL, NULL, '2026-01-12 03:30:59', '2026-01-12 03:30:59'),
(2, 'App\\Models\\User', 5, 'auth_token', 'a35f04c97aa729c2f340fee5066903e2b00e853c810d6f0df6e3429b31bda7d5', '[\"*\"]', NULL, NULL, '2026-01-12 08:39:07', '2026-01-12 08:39:07'),
(3, 'App\\Models\\User', 5, 'auth_token', '97d65eef155cc31da9d6452450dcabe2030a98b1dfe9f1fe8dc2fa0cac749bc8', '[\"*\"]', NULL, NULL, '2026-01-12 08:42:33', '2026-01-12 08:42:33'),
(4, 'App\\Models\\User', 5, 'auth_token', 'e901a74e64a6457f11811f77f797c07679b251019ff0b450f18f015b1ea29af4', '[\"*\"]', NULL, NULL, '2026-01-12 08:55:00', '2026-01-12 08:55:00'),
(5, 'App\\Models\\User', 7, 'auth_token', '32bb6645bd7ce78282c0efcf856ad53c930bcc6338613ce2d6d4ba1686d2534f', '[\"*\"]', NULL, NULL, '2026-01-12 09:29:15', '2026-01-12 09:29:15'),
(6, 'App\\Models\\User', 7, 'auth_token', '9e5fbecae8e9ab390062f3940dca9681787c2b1b709749c4b899f6504bfcafd4', '[\"*\"]', NULL, NULL, '2026-01-12 10:33:33', '2026-01-12 10:33:33'),
(7, 'App\\Models\\User', 7, 'auth_token', 'bf7e7c717f2536a5dc52c077c6eeeb3d6e44930331271c083ec67e2f6fdb147b', '[\"*\"]', NULL, NULL, '2026-01-12 11:05:00', '2026-01-12 11:05:00'),
(8, 'App\\Models\\User', 7, 'auth_token', '4e88a96ecc1e9937a809759127fc81ae82d8e3957efc51a8d5c92997361cc13a', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:41', '2026-01-13 21:31:41'),
(9, 'App\\Models\\User', 7, 'auth_token', '2e028f412a52da842e06da3e2913247abb845261681200499f7d566cc697dca0', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:42', '2026-01-13 21:31:42'),
(10, 'App\\Models\\User', 7, 'auth_token', 'ecc083acfb979854e81adbfedcda44b1ac85c0fb3477f9c0d79fc414b6857091', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:43', '2026-01-13 21:31:43'),
(11, 'App\\Models\\User', 7, 'auth_token', '588effaaac54c6f7598725f05e3df20937f7130213ae468c6942b6bd89b6ed8b', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:43', '2026-01-13 21:31:43'),
(12, 'App\\Models\\User', 7, 'auth_token', '5178e48dc8a44ff8cfbb365c5ed6e0a64b80489f68f1955e68e1e3ad16960155', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:44', '2026-01-13 21:31:44'),
(13, 'App\\Models\\User', 7, 'auth_token', '582bab01ca3c6985ff22d14646768078c31435071d940a376e6bf8902f673c3e', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:44', '2026-01-13 21:31:44'),
(14, 'App\\Models\\User', 7, 'auth_token', '3d3734b6dcea8d743bf36fdf25768248b38cf9b8940fdddaaebdd32916a18d9a', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:45', '2026-01-13 21:31:45'),
(15, 'App\\Models\\User', 7, 'auth_token', '59c2301a7c848f01219b4ee66c58469affd95e193a65fa908b8f7c72e742ab77', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:45', '2026-01-13 21:31:45'),
(16, 'App\\Models\\User', 7, 'auth_token', 'aeb874322e9201fdc8d5e0ba422cfbd4fa3f1b0127dd86fb590cd6055704672f', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:47', '2026-01-13 21:31:47'),
(17, 'App\\Models\\User', 7, 'auth_token', 'f18eabda7ea61d44dfa6fa52b9013e7e52eebd6a63f8e508d5dc515bd576403b', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:47', '2026-01-13 21:31:47'),
(18, 'App\\Models\\User', 7, 'auth_token', '397963de62cf960b0c77c7f32e56d9a3f0318a20643710ade5d791fc9e897daa', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:48', '2026-01-13 21:31:48'),
(19, 'App\\Models\\User', 7, 'auth_token', 'd21f4b5961f011de5b3b090d4dd2e3568fa4555790d49b525c66243713fe6f89', '[\"*\"]', NULL, NULL, '2026-01-13 21:31:48', '2026-01-13 21:31:48'),
(20, 'App\\Models\\User', 7, 'auth_token', 'b31454ffa83e1d223a149e0e7b14380d3df2b24ebad755cd1e5af1213c5c453a', '[\"*\"]', NULL, NULL, '2026-01-13 21:32:56', '2026-01-13 21:32:56'),
(21, 'App\\Models\\User', 7, 'auth_token', 'ac2b27ef6b3c932b156f7c531e06ae6536b26e26325880759d1c358d9fc3e644', '[\"*\"]', NULL, NULL, '2026-01-13 21:59:04', '2026-01-13 21:59:04'),
(22, 'App\\Models\\User', 7, 'auth_token', 'a4f19cc13eac4dbbbd092c2370802ceb6fd78bd7a44185e222145ca0243f34f6', '[\"*\"]', NULL, NULL, '2026-01-14 03:21:08', '2026-01-14 03:21:08'),
(23, 'App\\Models\\User', 7, 'auth_token', 'e4646f341e21523fac50445ded4fde220e8f9893b79fe1c2f57c68c55d3cdd2c', '[\"*\"]', NULL, NULL, '2026-01-14 03:25:27', '2026-01-14 03:25:27'),
(24, 'App\\Models\\User', 7, 'auth_token', '287e1b86d105aac29264e9e436cfc2586d0a324a330362c9a223b4bae023ec21', '[\"*\"]', NULL, NULL, '2026-01-14 07:12:57', '2026-01-14 07:12:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `type` enum('Blog','Mẹo vặt') DEFAULT 'Blog',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `title`, `content`, `thumbnail`, `type`, `created_at`) VALUES
(1, 2, '5 mẹo khử mùi tanh của cá cực đơn giản', '<p>Dùng nước vo gạo hoặc chanh tươi là cách hiệu quả nhất...</p>', 'logo.png', 'Mẹo vặt', '2026-01-11 17:11:49'),
(2, 3, 'Review quán Bún Chả Hương Liên - Obama đã ăn', '<p>Hương vị đậm đà, nem cua bể rất giòn và ngon...</p>', 'logo.png', '', '2026-01-11 17:11:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cooking_time` int(11) DEFAULT NULL COMMENT 'Phút',
  `servings` int(11) DEFAULT NULL COMMENT 'Số người',
  `difficulty` enum('Dễ','Trung bình','Khó') DEFAULT 'Trung bình',
  `image_url` varchar(255) NOT NULL,
  `status` enum('Draft','Published','Hidden') DEFAULT 'Published',
  `created_at` datetime DEFAULT current_timestamp(),
  `views` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `title`, `description`, `cooking_time`, `servings`, `difficulty`, `image_url`, `status`, `created_at`, `views`) VALUES
(1, 3, 'Phở Bò Gia Truyền Nam Định', 'Món phở bò tái chín nước dùng trong veo, ngọt từ xương.', 180, 4, 'Khó', 'logo.png', 'Published', '2026-01-11 17:11:49', 0),
(2, 2, 'Trứng chiên cà chua siêu tốc', 'Món ăn đơn giản cho sinh viên và người bận rộn.', 15, 2, 'Dễ', 'logo.png', 'Published', '2026-01-11 17:11:49', 0),
(3, 2, 'Canh chua cá lóc miền Tây', 'Vị chua thanh của me, ngọt của cá, đậm chất miền Tây.', 45, 4, 'Trung bình', 'logo.png', 'Published', '2026-01-11 17:11:49', 0),
(4, 2, 'Bún Bò Huế Chuẩn Vị', 'Hương vị cay nồng, thơm mùi sả và mắm ruốc đặc trưng cố đô.', 120, 5, 'Khó', 'bunbo.jpg', 'Published', '2026-01-14 16:42:19', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recipe_categories`
--

CREATE TABLE `recipe_categories` (
  `recipe_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `recipe_categories`
--

INSERT INTO `recipe_categories` (`recipe_id`, `category_id`) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 2),
(3, 5),
(4, 1),
(4, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recipe_ingredients`
--

CREATE TABLE `recipe_ingredients` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` float NOT NULL,
  `unit` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `recipe_ingredients`
--

INSERT INTO `recipe_ingredients` (`id`, `recipe_id`, `ingredient_id`, `quantity`, `unit`) VALUES
(1, 1, 1, 500, 'gram'),
(2, 1, 6, 1, 'kg'),
(3, 1, 9, 1, 'củ'),
(4, 2, 3, 3, 'quả'),
(5, 2, 4, 2, 'quả'),
(6, 2, 7, 1, 'thìa'),
(7, 4, 1, 1, 'kg'),
(8, 4, 7, 3, 'thìa'),
(9, 4, 9, 2, 'củ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT 5,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `recipe_id`, `rating`, `content`, `created_at`) VALUES
(1, 2, 1, 5, 'Công thức chuẩn quá chef ơi, nước dùng rất ngọt!', '2026-01-11 17:11:49'),
(2, 3, 2, 4, 'Món này làm nhanh gọn, ăn đưa cơm lắm.', '2026-01-11 17:11:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shopping_list`
--

CREATE TABLE `shopping_list` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ingredient_name` varchar(255) NOT NULL,
  `quantity` varchar(100) DEFAULT NULL,
  `is_bought` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `steps`
--

CREATE TABLE `steps` (
  `step_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `step_order` int(11) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `steps`
--

INSERT INTO `steps` (`step_id`, `recipe_id`, `step_order`, `content`, `image_url`) VALUES
(1, 1, 1, 'Rửa sạch xương bò, nướng gừng và hành tím cho thơm rồi bỏ vào nồi nước hầm trong 3 tiếng.', NULL),
(2, 1, 2, 'Thịt bò thái lát mỏng. Bánh phở chần qua nước sôi.', NULL),
(3, 1, 3, 'Xếp bánh phở ra bát, xếp thịt bò lên, chan nước dùng đang sôi vào và thưởng thức.', NULL),
(4, 2, 1, 'Đập trứng ra bát, thêm nước mắm, tiêu rồi đánh tan.', NULL),
(5, 2, 2, 'Cà chua rửa sạch, cắt múi cau. Phi thơm hành, xào cà chua cho mềm.', NULL),
(6, 2, 3, 'Đổ trứng vào chảo cà chua, đậy nắp chờ chín hoặc đảo đều tay tùy sở thích.', NULL),
(7, 4, 1, 'Hầm xương bò với sả đập dập và hành tây nướng trong 2 tiếng.', NULL),
(8, 4, 2, 'Phi thơm sả băm với dầu điều và mắm ruốc, đổ vào nồi nước dùng.', NULL),
(9, 4, 3, 'Trụng bún, xếp thịt bò, chả cua, tiết luộc lên trên rồi chan nước dùng.', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('User','Admin') DEFAULT 'User',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `full_name`, `avatar`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@bepviet.com', '$2y$10$demoHashAdmin', 'Quản Trị Viên', 'logo.png', 'Admin', '2026-01-11 17:11:49', NULL),
(2, 'me_bap', 'mebap@gmail.com', '$2y$10$demoHashUser1', 'Mẹ Bắp', 'logo.png\r\n', 'User', '2026-01-11 17:11:49', NULL),
(3, 'chef_huy', 'huynguyen@yahoo.com', '$2y$10$demoHashUser2', 'Đầu Bếp Huy', 'logo.png', 'User', '2026-01-11 17:11:49', NULL),
(4, 'HuyDZ', 'HuyDZ@gmail.com', '$2y$10$PQsjG6/EPuskXeXKRvxZx.f99/Hjjf3bt9S5X6qlkfZqqQdux..Kq', 'Huy', NULL, 'User', '2026-01-12 17:27:59', NULL),
(5, 'Test', 'Test@gmail.com', '$2y$10$1Spyoc03XUZYgJdo.EAm2.q7L7IN6pNr29OuAlLy7715JlGZvNN5e', 'NguyenDucHuy', NULL, 'User', '2026-01-12 22:38:44', NULL),
(6, 'Test1', 'Test1@gmail.com', '$2y$10$wSkFU6RFQBFwx49L0KeOV.e9yI3uQALdMM2o.DmrlkLrcz4vSJR9G', 'huy', NULL, 'User', '2026-01-12 22:42:16', NULL),
(7, 'nguyenduchuy', 'nguyenduchuy@gmail.com', '$2y$10$UOPb8dDDYFqrNPYXOUSJheKeZp7TW8ax7lRPOvPxN6VsRXqq3s3VW', 'huy', NULL, 'User', '2026-01-12 23:29:01', NULL),
(8, 'nguyenduchuytest', 'nguyenduchuytest@gmail.com', '$2y$10$3Jqv0nP6rBTA2MTWMtM92eXFdO8LJln7rFuJpN7eNNbb8ohV0izpG', 'huy', NULL, 'User', '2026-01-14 17:21:03', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`collection_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `collection_recipes`
--
ALTER TABLE `collection_recipes`
  ADD PRIMARY KEY (`collection_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Chỉ mục cho bảng `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `recipe_categories`
--
ALTER TABLE `recipe_categories`
  ADD PRIMARY KEY (`recipe_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Chỉ mục cho bảng `shopping_list`
--
ALTER TABLE `shopping_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `steps`
--
ALTER TABLE `steps`
  ADD PRIMARY KEY (`step_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `collections`
--
ALTER TABLE `collections`
  MODIFY `collection_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `shopping_list`
--
ALTER TABLE `shopping_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `steps`
--
ALTER TABLE `steps`
  MODIFY `step_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `collection_recipes`
--
ALTER TABLE `collection_recipes`
  ADD CONSTRAINT `collection_recipes_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`collection_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `collection_recipes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `recipe_categories`
--
ALTER TABLE `recipe_categories`
  ADD CONSTRAINT `recipe_categories_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `shopping_list`
--
ALTER TABLE `shopping_list`
  ADD CONSTRAINT `shopping_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `steps`
--
ALTER TABLE `steps`
  ADD CONSTRAINT `steps_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
