import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css'; // Đảm bảo bạn có file css này

const ProfilePage = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [activeTab, setActiveTab] = useState('my_recipes');

    // State cho tab "Công thức của tôi" (Gọi từ API mới)
    const [myRecipes, setMyRecipes] = useState([]);
    const [loadingMyRecipes, setLoadingMyRecipes] = useState(false);

    // State cho tab "Yêu thích"
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    // --- CẤU HÌNH ẢNH MẶC ĐỊNH ---
    const DEFAULT_COVER = '/default-cover.png';
    const DEFAULT_AVATAR = '/default-avatar.png';
    const DEFAULT_FOOD = '/default-food.png';

    // --- LẤY TOKEN & ID USER ---
    const token = localStorage.getItem('ACCESS_TOKEN');
    const userStr = localStorage.getItem('USER_INFO');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    
    // Logic lấy ID an toàn
    const currentUserId = currentUser 
        ? (currentUser.id || currentUser.user_id || (currentUser.user && currentUser.user.id)) 
        : null;

    // --- 1. API LẤY THÔNG TIN CHUNG (HEADER PROFILE) ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUserId) {
                setLoadingProfile(false);
                return;
            }
            try {
                // API này chỉ để lấy Avatar, Name, Bio, số lượng Follow
                const res = await axios.get(`http://localhost:8000/api/profile/${currentUserId}`);
                setProfile(res.data);
            } catch (error) {
                console.error("Lỗi API Profile:", error);
                setProfile(mockData);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [currentUserId]);

    // --- 2. API LẤY "CÔNG THỨC CỦA TÔI" (DÙNG API MỚI) ---
    useEffect(() => {
        const fetchMyRecipes = async () => {
            if (activeTab === 'my_recipes') {
                setLoadingMyRecipes(true);
                try {
                    if (!token) return;
                    
                    // Gọi API getMyRecipes bạn vừa viết ở Backend
                    const res = await axios.get('http://localhost:8000/api/my-recipes', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    setMyRecipes(res.data);
                } catch (error) {
                    console.error("Lỗi lấy bài viết của tôi:", error);
                } finally {
                    setLoadingMyRecipes(false);
                }
            }
        };

        if (currentUserId) {
            fetchMyRecipes();
        }
    }, [activeTab, currentUserId, token]);

    // --- 3. API LẤY "DANH SÁCH YÊU THÍCH" ---
    useEffect(() => {
        const fetchFavorites = async () => {
            if (activeTab === 'collections') {
                setLoadingFavorites(true);
                try {
                    if (!token) return;

                    const res = await axios.get('http://localhost:8000/api/my-favorites', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Xử lý dữ liệu trả về linh hoạt
                    let dataToSet = [];
                    if (Array.isArray(res.data)) dataToSet = res.data;
                    else if (res.data.data) dataToSet = res.data.data;
                    else if (res.data.favorites) dataToSet = res.data.favorites;

                    setFavorites(dataToSet);
                } catch (error) {
                    console.error("Lỗi tải yêu thích:", error);
                    if (error.response?.status === 401) {
                        alert("Hết phiên đăng nhập.");
                        navigate('/login');
                    }
                } finally {
                    setLoadingFavorites(false);
                }
            }
        };
        fetchFavorites();
    }, [activeTab, token, navigate]);

    // --- HELPER: XỬ LÝ URL ẢNH ---
    const getImageUrl = (imgName, type = 'cover') => {
        if (!imgName) {
            if (type === 'avatar') return DEFAULT_AVATAR;
            if (type === 'food') return DEFAULT_FOOD;
            return DEFAULT_COVER;
        }
        if (imgName.startsWith('http')) return imgName;
        // Fix lỗi đường dẫn trùng lặp nếu backend trả về sai
        return imgName.startsWith('/') ? imgName : `/${imgName}`;
    };

    // --- HELPER: NHÓM CÔNG THỨC THEO THÁNG ---
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

    // Render Loading ban đầu
    if (loadingProfile) return <div className="text-center mt-10">Đang tải thông tin...</div>;

    // Render chưa đăng nhập
    if (!currentUserId) return (
        <div style={{ textAlign: 'center', marginTop: 50, padding: 20 }}>
            <h3>Bạn chưa đăng nhập</h3>
            <Link to="/login" style={{ color: '#ff6600', textDecoration: 'underline' }}>Đăng nhập ngay</Link>
        </div>
    );

    // Render nếu không có profile
    if (!profile) return <div style={{ textAlign: 'center' }}>Không tìm thấy thông tin người dùng</div>;

    // Nhóm công thức (Dùng state myRecipes mới)
    const groupedMyRecipes = groupRecipesByMonth(myRecipes);

    return (
        <div className="profile-page">
            <main>
                {/* --- HEADER PROFILE --- */}
                <section className="profile-header">
                    <div className="cover-wrapper" style={{ height: '250px', overflow: 'hidden', position: 'relative', backgroundColor: '#eee' }}>
                        <img
                            src={getImageUrl(profile.info?.cover_image, 'cover')}
                            alt="Cover"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_COVER; }}
                        />
                    </div>

                    <div className="profile-info-container">
                        <img
                            src={getImageUrl(profile.info?.avatar, 'avatar')}
                            alt="Avatar"
                            className="profile-avatar-large"
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div className="profile-name">
                            {profile.info?.full_name || "Người dùng"}
                            {profile.info?.badge && <span className="badge">{profile.info.badge}</span>}
                        </div>
                        <p className="profile-bio">{profile.info?.bio || "Thành viên yêu bếp"}</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-num">{myRecipes.length}</span>
                                <span className="stat-label">Công thức</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">{profile.stats?.followers || 0}</span>
                                <span className="stat-label">Người theo dõi</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">{profile.stats?.following || 0}</span>
                                <span className="stat-label">Đang theo dõi</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- TABS --- */}
                <section className="tabs-container">
                    <div className="tabs">
                        <div className={`tab-item ${activeTab === 'my_recipes' ? 'active' : ''}`} onClick={() => setActiveTab('my_recipes')}>
                            Công thức của tôi
                        </div>
                        <div className={`tab-item ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>
                            Bộ sưu tập
                        </div>
                        <div className={`tab-item ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>
                            Đang theo dõi
                        </div>
                    </div>
                </section>

                {/* --- CONTENT BODY --- */}
                <section className="content-body">
                    
                    {/* 1. TAB CÔNG THỨC CỦA TÔI */}
                    {activeTab === 'my_recipes' && (
                        <div>
                            {loadingMyRecipes ? (
                                <div className="text-center p-5">Đang tải công thức của bạn...</div>
                            ) : Object.keys(groupedMyRecipes).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    <p>Bạn chưa có công thức nào.</p>
                                    <Link to="/create-recipe">
                                        <button style={{ marginTop: 10, padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                                            + Đăng công thức ngay
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                                        <Link to="/create-recipe" style={{ textDecoration: 'none' }}>
                                            <button style={{ background: '#ff6600', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                + Đăng món mới
                                            </button>
                                        </Link>
                                    </div>

                                    {Object.keys(groupedMyRecipes).map(month => (
                                        <div className="month-section" key={month}>
                                            <h3 className="section-title" style={{ borderLeft: '4px solid #ff6600', paddingLeft: 10, margin: '20px 0' }}>
                                                {month}
                                            </h3>
                                            <div className="recipe-grid">
                                                {groupedMyRecipes[month].map(recipe => (
                                                    <div className="recipe-card" key={recipe.recipe_id || recipe.id}>
                                                        <Link to={`/recipes/${recipe.recipe_id || recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            <div className="card-img-wrapper" style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                                                                <img
                                                                    src={getImageUrl(recipe.image_url || recipe.image, 'food')}
                                                                    alt={recipe.title}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    onError={(e) => e.target.src = DEFAULT_FOOD}
                                                                />
                                                                {recipe.difficulty && (
                                                                    <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                                                                        {recipe.difficulty}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="card-body" style={{ padding: '10px' }}>
                                                                <h4 className="card-title" style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>{recipe.title}</h4>
                                                                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                                                                    {recipe.cooking_time && <span>⏳ {recipe.cooking_time} phút</span>}
                                                                    <span className="views">👁️ {recipe.views || 0}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. TAB BỘ SƯU TẬP (YÊU THÍCH) */}
                    {activeTab === 'collections' && (
                        <div style={{ padding: '20px 0' }}>
                            {loadingFavorites ? (
                                <div style={{ textAlign: 'center', color: '#666' }}>Đang tải danh sách yêu thích...</div>
                            ) : favorites.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                                    <p>Bạn chưa lưu món ăn nào.</p>
                                    <Link to="/" style={{ color: '#ff6600' }}>Khám phá món ngon ngay</Link>
                                </div>
                            ) : (
                                <div className="recipe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                                    {favorites.map(recipe => (
                                        <div className="recipe-card" key={recipe.recipe_id || recipe.id || Math.random()} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                            <Link to={`/recipes/${recipe.recipe_id || recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div className="card-img-wrapper" style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                                                    <img
                                                        src={getImageUrl(recipe.image_url || recipe.image, 'food')}
                                                        alt={recipe.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => e.target.src = DEFAULT_FOOD}
                                                    />
                                                </div>
                                                <div className="card-body" style={{ padding: '10px' }}>
                                                    <h4 className="card-title" style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {recipe.title || recipe.name}
                                                    </h4>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                                                        <span style={{ color: '#ff4d4f' }}>❤️ Đã thích</span>
                                                        {recipe.cooking_time && <span>⏳ {recipe.cooking_time}p</span>}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. TAB ĐANG THEO DÕI */}
                    {activeTab === 'following' && (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                            Chức năng đang phát triển...
                        </div>
                    )}
                </section>
            </main>

            <footer style={{ textAlign: 'center', padding: '20px', background: '#333', color: 'white', marginTop: '20px' }}>
                Copyright © 2026 Bếp Việt 4.0
            </footer>
        </div>
    );
};

// Mock data khi lỗi
const mockData = {
    info: { user_id: 999, full_name: "User Demo", avatar: "", cover_image: "", bio: "Không thể tải dữ liệu", badge: "" },
    stats: { followers: 0, following: 0 },
};

export default ProfilePage;