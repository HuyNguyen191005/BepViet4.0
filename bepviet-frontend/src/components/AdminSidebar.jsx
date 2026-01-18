import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-brand">
                <span className="brand-icon">🍴</span>
                <h2>Admin Panel</h2>
            </div>
            <nav className="sidebar-nav">
                {/* Sử dụng Link để chuyển trang không load lại web */}
                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                    <span className="icon">🏠</span> Tổng quan
                </Link>
                <Link to="/admin/users" className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}>
                    <span className="icon">👥</span> Người dùng
                </Link>
                <div className="nav-link"><span className="icon">📰</span> Bài viết</div>
                <div className="nav-link"><span className="icon">📋</span> Danh mục</div>
                <div className="nav-link"><span className="icon">⚙️</span> Cài đặt</div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;