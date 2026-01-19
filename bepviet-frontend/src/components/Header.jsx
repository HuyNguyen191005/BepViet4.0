import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [keyword, setKeyword] = useState('');

    // Kiểm tra đăng nhập
    useEffect(() => {
        const userStr = localStorage.getItem('USER_INFO');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);
    // --- HÀM CHUYỂN TRANG PROFILE (MỚI THÊM) ---
    const goToProfile = () => {
        navigate('/profile');
    };

    const handleCreateClick = () => {
        // Chuyển hướng sang trang tạo công thức
        navigate('/create-recipe');
    };

    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER_INFO');
        setUser(null);
        navigate('/login');
        window.location.reload();   
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && keyword.trim() !== '') {
            navigate(`/search?query=${keyword}`);
        }
    };

    // --- HÀM XỬ LÝ LINK ẢNH AVATAR (MỚI THÊM) ---
    const getAvatarUrl = (imageName) => {
        // 1. Nếu không có tên ảnh -> Trả về ảnh mặc định trong thư mục public
        if (!imageName) return '/default-avatar.png'; 
        
        // 2. Nếu là link online (Google/FB) -> Giữ nguyên
        if (imageName.startsWith('http')) return imageName;

        // 3. Nếu là file từ DB -> Nối domain backend vào
        return `http://localhost:8000/storage/${imageName}`; 
    };

    return (
        <header className="header-container">
            <div className="header-wrapper">
                
                {/* 1. LOGO */}
                <div className="header-left">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Logo" className="logo-img" />
                        <div className="logo-text">
                            <span className="brand-name">BẾP VIỆT</span>
                            <span className="brand-version">4.0</span>
                        </div>
                    </Link>
                </div>

                {/* 2. MENU GIỮA */}
                <nav className="header-center">
                    <Link to="/" className="nav-item active">Trang chủ</Link>
                    <Link to="/recipes" className="nav-item">Công thức</Link>
                    <Link to="/community" className="nav-item">Cộng đồng</Link>
                    <Link to="/blog" className="nav-item">Blog</Link>
                </nav>

                {/* 3. KHU VỰC TÌM KIẾM & USER */}
                <div className="header-right">
                    
                    {/* Ô tìm kiếm bo tròn */}
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Tìm nhanh..." 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    {/* Logic User */}
                    {user ? (
                        <div className="user-actions">
                            {/* Nút Đăng bài */}
                            <button className="btn-upload" onClick={handleCreateClick}>
                                + Đăng bài
                            </button>

                            {/* Avatar & Tên */}
                            <div className="user-profile">
                                {/* 1. NHẤN VÀO ẢNH ĐỂ VÀO PROFILE */}
                                <img 
                                    src={getAvatarUrl(user.avatar || user.image)} 
                                    alt="Avatar" 
                                    className="user-avatar" 
                                    onClick={goToProfile}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                                <div className="user-dropdown">
                                    {/* 2. NHẤN VÀO LỜI CHÀO ĐỂ VÀO PROFILE */}
                                    <span 
                                        className="user-name" 
                                        onClick={goToProfile}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Chào, {user.full_name}
                                    </span>
                                    <button onClick={handleLogout} className="logout-text">Đăng xuất</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-actions">
                            <Link to="/login" className="btn-login-text">Đăng nhập</Link>
                            <Link to="/register" className="btn-register-orange">Đăng ký</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}