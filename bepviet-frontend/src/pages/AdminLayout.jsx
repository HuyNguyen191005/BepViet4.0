import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../Admin.css'; //

const AdminLayout = () => {
    const handleLogout = () => {
        if(window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon">🍴</span>
                    <h2>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    {/* Sử dụng NavLink để tự động nhận class .active khi đường dẫn khớp */}
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">🏠</span> Tổng quan
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">👥</span> Người dùng
                    </NavLink>
                    <NavLink to="/admin/recipes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">📰</span> Bài viết
                    </NavLink>
                    <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">📋</span> Danh mục
                    </NavLink>
                    <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <span className="icon">⚙️</span> Cài đặt
                    </NavLink>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-info">
                        <h2>Hệ thống Quản trị Bếp Việt</h2>
                    </div>
                    <div className="header-user" style={{display: 'flex', alignItems: 'center'}}>
                        <div className="user-profile">
                            <span className="profile-icon">👤</span>
                            <span className="profile-name" style={{fontWeight: '600', color: '#475569'}}>Quản trị viên</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
                            🚪 Thoát
                        </button>
                    </div>
                </header>
                
                <div className="admin-page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;