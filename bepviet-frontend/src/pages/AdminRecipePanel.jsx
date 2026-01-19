import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import '../Admin.css';

const AdminRecipePanel = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get('/admin/recipes')
            .then(res => {
            // SỬA TẠI ĐÂY: Phải dùng setRecipes mới đúng với biến đã khai báo bên trên
            setRecipes(res.data); 
            setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh sách công thức:", err);
                setLoading(false);
            });
    }, []);

    // Hàm chuyển đổi trạng thái DB sang tiếng Việt theo thiết kế
    const renderStatus = (status) => {
        switch(status) {
            case 'Published': 
                return <span className="status-badge green">Đã duyệt</span>;
            case 'Draft': 
                return <span className="status-badge yellow">Chờ duyệt</span>;
            default: 
                return <span className="status-badge red">Bị ẩn</span>;
        }
    };

    if (loading) return <div className="admin-page-content">Đang tải dữ liệu công thức...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header-content">
                <div className="header-info">
                    <h1>Quản lý Bài viết / Công thức (Recipe Management)</h1>
                    <p>Mục tiêu: Duyệt bài hoặc Xóa bài rác. Layout: Table kèm ảnh thumbnail nhỏ.</p>
                </div>
            </div>

            <div className="admin-actions">
                <div style={{ display: 'flex', gap: '15px' }}>
                    <select className="chart-select">
                        <option>Tất cả bài viết</option>
                    </select>
                    <button className="page-num">🔍 Lọc</button>
                </div>
                <button className="add-btn">+ Thêm bài viết</button>
            </div>

            <div className="data-table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3>Quản lý công thức</h3>
                    <div>
                        <button className="page-num">🔳</button>
                        <button className="page-num">田</button>
                    </div>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ẢNH</th>
                            <th>TÊN</th>
                            <th>TÁC GIẢ</th>
                            <th>TRẠNG THÁI</th>
                            <th>TÁC VỤ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* THÊM 'index' vào hàm map để lấy số thứ tự */}
                        {recipes.map((recipe, index) => (
                            <tr key={recipe.recipe_id}>
                                {/* HIỂN THỊ THEO THỨ TỰ 01, 02, 03... */}
                                <td>
                                    {(index + 1) < 10 ? `0${index + 1}` : index + 1}
                                </td>
                                
                                <td>
                                    <img 
                                        src={recipe.image_url || '/logo.png'} 
                                        alt={recipe.title} 
                                        className="recipe-thumb" 
                                    />
                                </td>
                                <td>
                                    <b>{recipe.title}</b><br/>
                                    <small style={{color: '#999'}}>
                                        {recipe.categories?.[0]?.name || 'Chưa phân loại'}
                                    </small>
                                </td>
                                <td>{recipe.author?.full_name}</td>
                                <td>{renderStatus(recipe.status)}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" title="Xem">👁️</button>
                                    <button className="lock-btn" title="Duyệt">✔️</button>
                                    <button className="delete-btn" title="Xóa">❌</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRecipePanel;