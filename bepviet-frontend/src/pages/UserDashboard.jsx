import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import './UserDashboard.css';

const UserDashboard = () => {
    // 1. Dữ liệu giả lập ban đầu (Sau này sẽ gọi API để lấy thật)
    // Chúng ta đưa danh sách món ăn vào biến 'myRecipes'
    const [myRecipes, setMyRecipes] = useState([
        {
            id: 1,
            title: 'Phở Bò - 20/11/2024',
            image: 'img/phobo.jpg',
            status: 'pending', // pending hoặc published
            statusText: 'Chờ duyệt'
        },
        {
            id: 2,
            title: 'Canh chua - 19/11/2024',
            image: 'img/canhchuachay.jpg',
            status: 'published',
            statusText: 'Đã duyệt'
        }
    ]);

    // 2. Hàm Xử lý Đăng xuất
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    // 3. Hàm Xử lý Xóa món ăn (MỚI THÊM)
    const handleDeleteRecipe = (id) => {
        // Hỏi xác nhận trước khi xóa
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) {
            
            // Cách 1: Nếu đã có API backend
            /*
            axiosClient.delete(`/recipes/${id}`)
                .then(() => {
                    alert("Đã xóa thành công!");
                    // Cập nhật giao diện: Lọc bỏ món có id vừa xóa
                    setMyRecipes(currentRecipes => currentRecipes.filter(item => item.id !== id));
                })
                .catch(err => {
                    alert("Lỗi khi xóa: " + err.message);
                });
            */

            // Cách 2: Xóa giả lập (Chạy ngay để bạn thấy hiệu ứng trên giao diện)
            setMyRecipes(currentRecipes => currentRecipes.filter(item => item.id !== id));
            alert("Đã xóa bài viết khỏi danh sách!");
        }
    };

    return (
        <div className="html-layout-container">
            
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="logo">
                    <img src="https://via.placeholder.com/40" alt="Logo" /> 
                    BẾP VIỆT <span>4.0</span>
                </div>

                <div className="user-profile">
                    <img src="img/avt.jpg" alt="Avatar" className="user-avatar" />
                    <div className="user-name">Nguyễn Văn A</div>
                    <div className="user-rank">Thành viên Bạc</div>
                </div>

                <ul className="nav-menu">
                    <li className="nav-item active"><i className="fa-solid fa-house"></i> TỔNG QUAN</li>
                    <li className="nav-item"><i className="fa-solid fa-utensils"></i> QUẢN LÍ CÔNG THỨC</li>
                    <li className="nav-item"><i className="fa-solid fa-layer-group"></i> BỘ SƯU TẬP</li>
                    <li className="nav-item"><i className="fa-solid fa-cart-shopping"></i> GIỎ ĐI CHỢ</li>
                    <li className="nav-item"><i className="fa-solid fa-gear"></i> CÀI ĐẶT TÀI KHOẢN</li>
                    <li className="nav-item logout" onClick={handleLogout}>
                        <i className="fa-solid fa-power-off"></i> Đăng xuất
                    </li>
                </ul>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">
                <header className="top-header">
                    <div className="welcome-text">
                        <i className="fa-solid fa-bell" style={{marginRight: '15px', color: '#666'}}></i>
                        Xin chào, <span style={{fontWeight: 'bold'}}>Văn A</span>
                    </div>
                </header>

                <div className="content-body">
                    <h2 className="section-title">Tổng quan</h2>

                    {/* Thống kê (Giữ nguyên) */}
                    <div className="stats-container">
                        <div className="stat-card">
                            <span className="stat-number">{myRecipes.length}</span>
                            <span className="stat-label">Bài viết</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">1.2k</span>
                            <span className="stat-label">Lượt xem</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">5</span>
                            <span className="stat-label">Đã lưu</span>
                        </div>
                    </div>

                    {/* Danh sách bài viết (ĐÃ SỬA: Dùng vòng lặp map) */}
                    <div className="recipe-list">
                        
                        {myRecipes.length === 0 ? (
                            <p style={{textAlign:'center', color:'#888'}}>Bạn chưa có bài viết nào.</p>
                        ) : (
                            myRecipes.map((recipe) => (
                                <div className="recipe-item" key={recipe.id}>
                                    <img src={recipe.image} alt={recipe.title} className="recipe-img" />
                                    <div className="recipe-info">
                                        <a href="#" className="recipe-title">{recipe.title}</a>
                                        <div className={`status-badge ${recipe.status === 'published' ? 'status-published' : 'status-pending'}`}>
                                            {recipe.statusText}
                                        </div>
                                    </div>
                                    <div className="recipe-actions">
                                        <button className="btn btn-edit">[Sửa]</button>
                                        
                                        {/* Gắn sự kiện xóa vào nút này */}
                                        <button 
                                            className="btn btn-delete" 
                                            onClick={() => handleDeleteRecipe(recipe.id)}
                                        >
                                            [Xóa]
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;