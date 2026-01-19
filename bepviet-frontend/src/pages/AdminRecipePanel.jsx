import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import '../Admin.css';

const AdminRecipePanel = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();// thêm 

    useEffect(() => {
            fetchRecipes();
        }, []);
    
        const fetchRecipes = () => {
            setLoading(true);
            axiosClient.get('/admin/recipes')
                .then(res => {
                    // Sửa lỗi: dùng setRecipes thay vì setUsers
                    setRecipes(Array.isArray(res.data) ? res.data : []); 
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi:", err);
                    setLoading(false);
                });
        };
    
        // --- CHỨC NĂNG XEM BÀI ---
        const handleView = (id) => {
            navigate(`/recipes/${id}`); // Chuyển đến trang chi tiết đã có
        };
    
        // --- CHỨC NĂNG DUYỆT BÀI ---
        // 1. Thêm hàm xử lý Duyệt bài
        const handleApprove = (id) => {
            if (window.confirm("Bạn có chắc chắn muốn duyệt bài viết này không?")) {
                axiosClient.patch(`/admin/recipes/${id}/approve`)
                    .then(res => {
                        alert("Duyệt bài thành công!");
                        // Cập nhật lại state local: Tìm bài viết vừa duyệt và thay thế bằng dữ liệu mới từ Server
                        setRecipes(recipes.map(r => r.recipe_id === id ? res.data : r));
                    })
                    .catch(err => {
                        alert("Lỗi khi duyệt bài: " + (err.response?.data?.message || err.message));
                    });
            }
        };
    
        // --- CHỨC NĂNG XÓA BÀI ---
        const handleDelete = (id) => {
            if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này?")) {
                axiosClient.delete(`/admin/recipes/${id}`)
                    .then(() => {
                        alert("Đã xóa bài viết");
                        setRecipes(recipes.filter(r => r.recipe_id !== id));
                    })
                    .catch(err => alert("Lỗi khi xóa: " + err.message));
            }
        };
    // Hàm chuyển đổi trạng thái DB sang tiếng Việt theo thiết kế
    const handleToggleStatus = (id) => {
        axiosClient.patch(`/admin/recipes/${id}/status`)
            .then(res => {
                // Cập nhật lại danh sách ngay lập tức trên màn hình
                setRecipes(recipes.map(r => r.recipe_id === id ? res.data : r));
            })
            .catch(err => alert("Lỗi hệ thống: " + err.message));
    };
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
                        {recipes.map((recipe, index) => (
                            <tr key={recipe.recipe_id}>
                                {/* CHỈNH ID ĐÚNG THỨ TỰ */}
                                <td>{(index + 1) < 10 ? `0${index + 1}` : index + 1}</td>
                                
                                <td>
                                    <img src={recipe.image_url || '/logo.png'} className="recipe-thumb" alt="thumb" />
                                </td>
                                <td>
                                    <b>{recipe.title}</b><br/>
                                    <small>{recipe.categories?.[0]?.name || 'N/A'}</small>
                                </td>
                                <td>{recipe.author?.full_name || recipe.user?.full_name}</td>
                                <td>{renderStatus(recipe.status)}</td>
                                <td className="action-buttons">
                                    {/* Nút Xem: icon con mắt */}
                                    <button className="edit-btn" onClick={() => handleView(recipe.recipe_id)}>👁️</button>
                                    
                                    {/* NÚT TÙY CHỈNH DUYỆT (Luôn hiện lên) */}
                                    <button 
                                        className={`lock-btn ${recipe.status === 'Published' ? 'active-green' : ''}`} 
                                        title={recipe.status === 'Published' ? "Hủy duyệt" : "Duyệt bài"}
                                        onClick={() => handleToggleStatus(recipe.recipe_id)}
                                        style={{ 
                                            backgroundColor: recipe.status === 'Published' ? '#dcfce7' : '#fefce8',
                                            color: recipe.status === 'Published' ? '#15803d' : '#ca8a04'
                                        }}
                                    >
                                        {recipe.status === 'Published' ? '✔️' : '⏳'}
                                    </button>
                                    {/* Nút Xóa: icon X đỏ */}
                                    <button className="delete-btn" onClick={() => handleDelete(recipe.recipe_id)}>❌</button>
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