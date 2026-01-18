import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my_recipes');
    
    // --- 1. MỚI THÊM: STATE CHO BỘ SƯU TẬP ---
    const [favorites, setFavorites] = useState([]);

    // --- CẤU HÌNH ẢNH MẶC ĐỊNH (LOCAL) ---
    const DEFAULT_COVER = '/default-cover.png';    
    const DEFAULT_AVATAR = '/default-avatar.png'; 
    const DEFAULT_FOOD = '/default-food.png'; 

    // --- LẤY ID USER ---
    const userStr = localStorage.getItem('USER_INFO');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser 
        ? (currentUser.id || currentUser.user_id || (currentUser.user && currentUser.user.id)) 
        : null;

    // --- API LẤY PROFILE ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUserId) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:8000/api/profile/${currentUserId}`);
                setProfile(res.data);
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
                setProfile(mockData); 
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUserId]);

    // --- 2. MỚI THÊM: API LẤY DANH SÁCH YÊU THÍCH ---
    useEffect(() => {
        const fetchFavorites = async () => {
            if (activeTab === 'collections') {
                try {
                    const token = localStorage.getItem('token'); // Lấy token xác thực
                    if (!token) return;

                    const res = await axios.get('http://localhost:8000/api/my-favorites', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFavorites(res.data);
                } catch (error) {
                    console.error("Lỗi tải bộ sưu tập:", error);
                }
            }
        };
        fetchFavorites();
    }, [activeTab]); // Chạy khi chuyển Tab

    // --- HÀM XỬ LÝ ẢNH ---
    const getImageUrl = (imgName, type = 'cover') => {
        if (!imgName) {
            if (type === 'avatar') return DEFAULT_AVATAR;
            if (type === 'food') return DEFAULT_FOOD;
            return DEFAULT_COVER;
        }
        if (imgName.startsWith('http')) return imgName;
        return imgName.startsWith('/') ? imgName : `/${imgName}`;
    };

    // --- GIAO DIỆN LOADING/LOGIN ---
    if (loading) return <div style={{textAlign:'center', marginTop: 50}}>Đang tải dữ liệu...</div>;
    
    if (!currentUserId) return (
        <div style={{textAlign:'center', marginTop: 50, padding: 20}}>
            <h3>Bạn chưa đăng nhập</h3>
            <Link to="/login" style={{color: '#ff6600', textDecoration: 'underline'}}>Đăng nhập ngay</Link>
        </div>
    );

    if (!profile) return <div style={{textAlign:'center'}}>Không tìm thấy thông tin</div>;

    // Logic nhóm công thức (cho tab My Recipes)
    const groupRecipesByMonth = (recipes) => {
        if (!recipes || recipes.length === 0) return {};
        const groups = {};
        const sortedRecipes = [...recipes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        sortedRecipes.forEach(recipe => {
            const date = new Date(recipe.created_at);
            const monthYear = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
            if (!groups[monthYear]) groups[monthYear] = [];
            groups[monthYear].push(recipe);
        });
        return groups;
    };
    const groupedRecipes = groupRecipesByMonth(profile.recipes);

    return (
        <div className="profile-page">
            <main>
                {/* --- HEADER PROFILE (GIỮ NGUYÊN) --- */}
                <section className="profile-header">
                    <div className="cover-wrapper" style={{ height: '250px', overflow: 'hidden', position: 'relative', backgroundColor: '#eee' }}>
                        <img 
                            src={getImageUrl(profile.info.cover_image, 'cover')} 
                            alt="Cover" 
                            className="cover-image" 
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_COVER; }}
                        />
                    </div>
                    
                    <div className="profile-info-container">
                        <img 
                            src={getImageUrl(profile.info.avatar, 'avatar')} 
                            alt="Avatar" 
                            className="profile-avatar-large" 
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div className="profile-name">
                            {profile.info.full_name}
                            {profile.info.badge && <span className="badge">{profile.info.badge}</span>}
                        </div>
                        <p className="profile-bio">{profile.info.bio || "Thành viên yêu bếp"}</p>
                        
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-num">{profile.recipes ? profile.recipes.length : 0}</span>
                                <span className="stat-label">Công thức</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">{profile.stats.followers || 0}</span>
                                <span className="stat-label">Người theo dõi</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">{profile.stats.following || 0}</span>
                                <span className="stat-label">Đang theo dõi</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TABS */}
                <section className="tabs-container">
                    <div className="tabs">
                        <div className={`tab-item ${activeTab === 'my_recipes' ? 'active' : ''}`} onClick={() => setActiveTab('my_recipes')}>
                            Công thức của tôi
                        </div>
                        <div className={`tab-item ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>
                            Bộ sưu tập (Đã thích)
                        </div>
                        <div className={`tab-item ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>
                            Đang theo dõi
                        </div>
                    </div>
                </section>

                {/* CONTENT BODY */}
                <section className="content-body">
                    
                    {/* --- TAB 1: CÔNG THỨC CỦA TÔI --- */}
                    {activeTab === 'my_recipes' && (
                        <div>
                            {Object.keys(groupedRecipes).length === 0 ? (
                                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                    <p>Bạn chưa có công thức nào.</p>
                                    <button style={{marginTop: 10, padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>
                                        + Đăng công thức ngay
                                    </button>
                                </div>
                            ) : (
                                Object.keys(groupedRecipes).map(month => (
                                    <div className="month-section" key={month}>
                                        <h3 className="section-title" style={{borderLeft: '4px solid #ff6600', paddingLeft: 10, margin: '20px 0'}}>
                                            {month}
                                        </h3>
                                        <div className="recipe-grid">
                                            {groupedRecipes[month].map(recipe => (
                                                <div className="recipe-card" key={recipe.recipe_id || recipe.id}>
                                                    <Link to={`/recipes/${recipe.recipe_id || recipe.id}`} style={{textDecoration:'none', color: 'inherit'}}>
                                                        <div className="card-img-wrapper" style={{position: 'relative', height: '180px', overflow: 'hidden'}}>
                                                            <img 
                                                                src={getImageUrl(recipe.image_url || recipe.image, 'food')} 
                                                                alt={recipe.title} 
                                                                className="card-img" 
                                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                                onError={(e) => e.target.src = DEFAULT_FOOD}
                                                            />
                                                            {recipe.difficulty && (
                                                                <span style={{position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px'}}>
                                                                    {recipe.difficulty}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="card-body" style={{padding: '10px'}}>
                                                            <h4 className="card-title" style={{margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold'}}>{recipe.title}</h4>
                                                            <div className="card-footer" style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666'}}>
                                                                {recipe.cooking_time && <span>⏳ {recipe.cooking_time} phút</span>}
                                                                <span className="views">👁️ {recipe.views || 0}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    
                    {/* --- TAB 2: BỘ SƯU TẬP (MỚI CẬP NHẬT) --- */}
                    {activeTab === 'collections' && (
                        <div style={{padding: '20px 0'}}>
                            {favorites.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>
                                    <p>Bạn chưa lưu món ăn nào vào bộ sưu tập.</p>
                                    <Link to="/" style={{color: '#ff6600'}}>Khám phá món ngon ngay</Link>
                                </div>
                            ) : (
                                <div className="recipe-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
                                    {favorites.map(recipe => (
                                        <div className="recipe-card" key={recipe.recipe_id || recipe.id} style={{border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', background: '#fff'}}>
                                            <Link to={`/recipes/${recipe.recipe_id || recipe.id}`} style={{textDecoration:'none', color: 'inherit'}}>
                                                <div className="card-img-wrapper" style={{position: 'relative', height: '180px', overflow: 'hidden'}}>
                                                    <img 
                                                        src={getImageUrl(recipe.image_url, 'food')} 
                                                        alt={recipe.title} 
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                        onError={(e) => e.target.src = DEFAULT_FOOD}
                                                    />
                                                </div>
                                                <div className="card-body" style={{padding: '10px'}}>
                                                    <h4 className="card-title" style={{margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                        {recipe.title}
                                                    </h4>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666'}}>
                                                        <span>❤️ Đã thích</span>
                                                        <span>⏳ {recipe.cooking_time}p</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB 3: ĐANG THEO DÕI --- */}
                    {activeTab === 'following' && (
                        <div style={{textAlign: 'center', padding: '50px', color: '#999'}}>
                            Chức năng đang phát triển...
                        </div>
                    )}
                </section>
            </main>

            <footer style={{textAlign: 'center', padding: '20px', background: '#333', color: 'white', marginTop: '20px'}}>
                Copyright © 2026 Bếp Việt 4.0
            </footer>
        </div>
    );
};

// Dữ liệu mẫu (Giữ nguyên để fallback)
const mockData = {
    info: { user_id: 999, full_name: "Trần Minh Dũng", avatar: "logo.png", cover_image: "", bio: "Thành viên yêu bếp", badge: "Masterchef" },
    stats: { followers: 120, following: 10 },
    recipes: [
        { recipe_id: 1, title: "Phở Bò Gia Truyền Nam Định", image_url: "logo.png", cooking_time: 180, difficulty: "Khó", views: 1205, created_at: "2026-01-11 17:11:49" },
        { recipe_id: 4, title: "Bún Bò Huế Chuẩn Vị", image_url: "bunbo.jpg", cooking_time: 120, difficulty: "Khó", views: 890, created_at: "2026-01-14 16:42:19" }
    ]
};

export default ProfilePage;