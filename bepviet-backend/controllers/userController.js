// backend/controllers/userController.js
const db = require('../config/db'); // File kết nối CSDL của bạn

exports.getUserDashboard = async (req, res) => {
    const userId = req.user.id; // Lấy ID từ token đăng nhập

    try {
        // 1. Lấy thông tin User
        const [userData] = await db.query('SELECT full_name, avatar_url, rank_name FROM users WHERE id = ?', [userId]);

        // 2. Lấy thống kê (Bài viết & Lượt xem)
        const [stats] = await db.query(`
            SELECT COUNT(id) as total_recipes, SUM(views) as total_views 
            FROM recipes WHERE user_id = ?
        `, [userId]);

        // 3. Lấy bài viết gần đây
        const [recipes] = await db.query(`
            SELECT id, title, image_url, status, created_at 
            FROM recipes WHERE user_id = ? ORDER BY created_at DESC
        `, [userId]);

        // Trả về JSON cho Frontend
        res.json({
            user: userData[0],
            stats: {
                recipes: stats[0].total_recipes || 0,
                views: stats[0].total_views || 0,
                saved: 0 // Tạm thời hardcode hoặc query thêm bảng saved
            },
            recipes: recipes
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};