import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import './UserProfile.css';
import { 
    User, BookOpen, Heart, ShoppingCart, Settings, 
    LogOut, Clock, Trash2, CheckCircle, Eye, Calendar 
} from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('recipes'); // recipes, collection, cart, settings
    const [recipeFilter, setRecipeFilter] = useState('all'); // all, pending, trash
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) return navigate('/login');

        axiosClient.get('/user/profile')
            .then(res => {
                setUserData(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER_INFO');
        navigate('/login');
        window.location.reload();
    };
    // --- HÀM XỬ LÝ XÓA CÔNG THỨC (CHUYỂN VÀO THÙNG RÁC) ---
    const handleMoveToTrash = async (recipeId) => {
        if (window.confirm("CẢNH BÁO: Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn?")) {
            try {
                await axiosClient.patch(`/recipes/${recipeId}/trash`); 
                
                // XÓA KHỎI DANH SÁCH: Lọc bỏ bài viết vừa xóa ra khỏi mảng recipes
                setUserData(prev => ({
                    ...prev,
                    recipes: prev.recipes.filter(r => r.recipe_id !== recipeId), // Xóa hẳn khỏi giao diện
                    recipes_count: prev.recipes_count - 1 // Giảm con số tổng bài viết trên dashboard
                }));
    
                alert("Đã xóa bài viết vĩnh viễn!");
            } catch (err) {
                alert("Không thể xóa bài viết.");
            }
        }
    };
    // --- HÀM XỬ LÝ BỎ YÊU THÍCH ---
    const handleRemoveFavorite = async (recipeId) => {
        if (window.confirm("Bạn có muốn bỏ món ăn này khỏi bộ sưu tập?")) {
            try {
                // SỬA TẠI ĐÂY: Gọi API favorite thay vì trash
                await axiosClient.post(`/recipes/${recipeId}/favorite`); 
                
                // Cập nhật lại giao diện ngay lập tức
                setUserData(prev => ({
                    ...prev,
                    favorite_recipes: prev.favorite_recipes.filter(r => r.recipe_id !== recipeId),
                    favorites_count: (prev.favorites_count || 1) - 1
                }));
                alert("Đã bỏ khỏi bộ sưu tập!");
            } catch (err) {
                alert("Lỗi khi bỏ yêu thích.");
            }
        }
    };
    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

    return (
        <div className="profile-container">
            {/* --- SIDEBAR TRÁI: THÔNG TIN CÁ NHÂN --- */}
            <aside className="profile-sidebar">
                <div className="user-info-box">
                    <div className="user-avatar-large">
                        <User size={50} />
                    </div>
                    <h3 className="user-display-name">{userData?.user.full_name}</h3>
                    <p className="user-display-email">{userData?.user.email}</p>
                    <div className="user-join-date">
                        <Calendar size={14} /> 
                        <span>Tham gia: {new Date(userData?.user.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <li className={`menu-item ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>
                        <BookOpen size={18} /> Quản lý công thức
                    </li>
                    <li className={`menu-item ${activeTab === 'collection' ? 'active' : ''}`} onClick={() => setActiveTab('collection')}>
                        <Heart size={18} /> Bộ sưu tập (Yêu thích)
                    </li>
                    <li className={`menu-item ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
                        <ShoppingCart size={18} /> Giỏ đi chợ
                    </li>
                    <li className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        <Settings size={18} /> Cài đặt tài khoản
                    </li>
                    <li className="menu-item logout" onClick={handleLogout}>
                        <LogOut size={18} /> Đăng xuất
                    </li>
                </nav>
            </aside>

            {/* --- NỘI DUNG CHÍNH: QUẢN LÝ BÀI ĐĂNG --- */}
            <main className="profile-main-content">
                
                {activeTab === 'recipes' && (
                    <div className="tab-content">
                        <div className="stats-bar">
                            <div className="stat-item">
                                <div className="stat-value">{userData?.recipes_count}</div>
                                <div className="stat-label">Bài viết</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{userData?.total_views}</div>
                                <div className="stat-label">Lượt xem</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{userData?.favorites_count || 0}</div>
                                <div className="stat-label">Đã lưu</div>
                            </div>
                        </div>

                        <div className="filter-tabs">
                            <button className={recipeFilter === 'all' ? 'active' : ''} onClick={() => setRecipeFilter('all')}>Tất cả</button>
                            <button className={recipeFilter === 'pending' ? 'active' : ''} onClick={() => setRecipeFilter('pending')}>Đang chờ duyệt</button>
                            <button className={recipeFilter === 'trash' ? 'active' : ''} onClick={() => setRecipeFilter('trash')}>Thùng rác</button>
                        </div>

                        <div className="recipe-list-container">
                            {userData?.recipes
                                .filter(r => {
                                    if (recipeFilter === 'pending') return r.status === 'Draft';
                                    if (recipeFilter === 'trash') return r.status === 'Deleted';
                                    return r.status !== 'Deleted';
                                })
                                .map(recipe => (
                                    <div key={recipe.recipe_id} className="recipe-horizontal-card">
                                        <img 
                                            src={recipe.image_url?.startsWith('http') ? recipe.image_url : `http://localhost:8000/storage/${recipe.image_url}`} 
                                            alt={recipe.title} 
                                        />
                                        <div className="recipe-info">
                                            <h4>{recipe.title}</h4>
                                            <span className={`badge ${recipe.status === 'Published' ? 'badge-published' : 'badge-draft'}`}>
                                                {recipe.status === 'Published' ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                                            </span>
                                        </div>
                                        <div className="recipe-meta">
                                            <span><Eye size={14} /> {recipe.views}</span>
                                            <button className="btn-icon-trash" onClick={() => handleMoveToTrash(recipe.recipe_id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* Trong phần nội dung chính, tìm đến Tab bộ sưu tập */}
                {activeTab === 'collection' && (
                    <div className="tab-content">
                        <h2 className="content-title">
                            <Heart size={20} className="title-icon" /> BỘ SƯU TẬP YÊU THÍCH
                        </h2>
                        
                        <div className="favorite-list">
                            {userData?.favorite_recipes?.map(recipe => (
                                <div key={recipe.recipe_id} className="favorite-horizontal-card">
                                    {/* Phần bên trái: Ảnh + Thông tin */}
                                    <div className="favorite-left-group">
                                        <img 
                                            src={`http://localhost:8000/storage/${recipe.image_url}`} 
                                            alt={recipe.title} 
                                            onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}
                                        />
                                        <div className="favorite-info">
                                            <h4 onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}>
                                                {recipe.title}
                                            </h4>
                                            <span className="favorite-date">Đã lưu: {new Date(recipe.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>

                                    {/* NÚT XÓA: Luôn nằm ngang bên tay phải nhờ Flexbox */}
                                    <button 
                                        className="btn-remove-favorite" 
                                        onClick={() => handleRemoveFavorite(recipe.recipe_id)}
                                        title="Xóa khỏi bộ sưu tập"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. TAB GIỎ ĐI CHỢ */}
                {activeTab === 'cart' && (
                    <div className="tab-content">
                        <h2>Giỏ đi chợ</h2>
                        <p style={{color: '#718096'}}>Danh sách nguyên liệu bạn cần mua cho các món ăn đã chọn.</p>
                        <div style={{textAlign: 'center', padding: '50px', color: '#cbd5e0'}}><ShoppingCart size={40} /><p>Giỏ hàng đang trống.</p></div>
                    </div>
                )}

                {/* 4. TAB CÀI ĐẶT */}
                {activeTab === 'settings' && (
                    <div className="tab-content">
                        <h2>Cài đặt tài khoản</h2>
                        <div style={{marginTop: '20px'}}>
                            <div className="form-group" style={{marginBottom: '15px'}}>
                                <label>Họ và tên</label>
                                <input type="text" className="cr-input" defaultValue={userData?.user.full_name} style={{width: '100%', marginTop: '5px'}} />
                            </div>
                            <button className="cr-btn-publish" style={{background: '#4f91a1', color: '#white', border: 'none', padding: '10px 20px', borderRadius: '5px'}}>Cập nhật thông tin</button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default UserProfile;