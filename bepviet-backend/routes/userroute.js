const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// Định nghĩa đường dẫn API, ví dụ: /api/user/dashboard
router.get('/dashboard', userController.getUserDashboard);

module.exports = router;