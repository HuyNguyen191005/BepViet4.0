import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const DEFAULT_AVATAR = 'avt1.jpg'; 

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [keyword, setKeyword] = useState('');

    // --- 1. KHỞI TẠO & KIỂM TRA ĐĂNG NHẬP ---
    useEffect(() => {
        const userStr = localStorage.getItem('USER_INFO');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (error) {
                console.error("Lỗi dữ liệu user:", error);
                localStorage.removeItem('USER_INFO');
            }
        }
    }, []);

    // --- 2. CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleCreateClick = () => {
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

    // --- 3. XỬ LÝ ĐƯỜNG DẪN ẢNH (LOGIC QUAN TRỌNG) ---
    const getAvatarUrl = (imageName) => {
        // Nếu không có tên ảnh -> Dùng ảnh mặc định
        if (!imageName) return DEFAULT_AVATAR;
        
        // Nếu là link online (Google/Facebook/Cloudinary) -> Giữ nguyên
        if (imageName.startsWith('http') || imageName.startsWith('data:')) {
            return imageName;
        }

        // Nếu là ảnh trong thư mục Public
        // Luôn thêm dấu '/' ở đầu để thành đường dẫn tuyệt đối (Absolute Path)
        // Điều này giúp ảnh hiển thị đúng kể cả khi đang ở trang con (vd: /recipes/1)
        return imageName.startsWith('/') ? imageName : `/${imageName}`;
    };

    // Xử lý khi ảnh bị lỗi (404) -> Thay thế ngay bằng ảnh mặc định
    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src = DEFAULT_AVATAR;
    };

    return (
        <header className="header-container">
            <div className="header-wrapper">
                
                {/* LOGO */}
                <div className="header-left">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Bếp Việt Logo" className="logo-img" />
                        <div className="logo-text">
                            <span className="brand-name">BẾP VIỆT</span>
                            <span className="brand-version">4.0</span>
                        </div>
                    </Link>
                </div>

                {/* MENU */}
                <nav className="header-center">
                    <Link to="/" className="nav-item active">Trang chủ</Link>
                    <Link to="/recipes" className="nav-item">Công thức</Link>
                    <Link to="/community" className="nav-item">Cộng đồng</Link>
                    <Link to="/blog" className="nav-item">Blog</Link>
                </nav>

                {/* SEARCH & USER */}
                <div className="header-right">
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

                    {user ? (
                        <div className="user-actions">
                            <button className="btn-upload" onClick={handleCreateClick}>
                                + Đăng bài
                            </button>

                            <div className="user-profile">
                                <Link to="/profile" className="profile-link-wrapper" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '8px' }}>
                                    <img 
                                        // Kiểm tra tất cả các trường có thể chứa tên ảnh trong DB
                                        src={getAvatarUrl(user.avatar || user.image || user.image_url)} 
                                        alt="User Avatar"
                                        className="user-avatar" 
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#f5f5f5'
                                        }} 
                                        onError={handleImageError}
                                    />
                                </Link>

                                <div className="user-dropdown">
                                    <span className="user-name">
                                        Chào, {user.full_name || user.name || "Bạn"}
                                    </span>
                                    <button onClick={handleLogout} className="logout-text">
                                        Đăng xuất
                                    </button>
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