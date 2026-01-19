import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import './UserProfile.css'; // Đảm bảo bạn có file css này
import { 
    User, BookOpen, Heart, ShoppingCart, Settings, 
    LogOut, Trash2, Eye, Calendar, Edit 
} from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('recipes'); // recipes, collection, cart, settings
    const [recipeFilter, setRecipeFilter] = useState('all'); // all, pending, trash
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- 1. LẤY DỮ LIỆU USER ---
    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) return navigate('/login');

        axiosClient.get('/user/profile')
            .then(res => {
                setUserData(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                // navigate('/login'); // Có thể mở lại nếu muốn strict mode
            });
    }, [navigate]);

    // --- 2. HÀM XỬ LÝ URL ẢNH (Quan trọng) ---
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:8000/storage/${url}`;
    };

    // --- 3. CÁC CHỨC NĂNG HÀNH ĐỘNG ---

    // A. Chuyển hướng sang trang Sửa
    const handleEditRecipe = (recipeId) => {
        navigate(`/recipes/edit/${recipeId}`);
    };

    // B. Xử lý xóa bài viết (Phân loại logic dựa trên Filter hiện tại)
    const handleRecipeActionDelete = async (recipeId) => {
        // TRƯỜNG HỢP 1: Đang ở Thùng rác -> Xóa vĩnh viễn
        if (recipeFilter === 'trash') {
            if (!window.confirm("CẢNH BÁO: Bài viết sẽ bị xóa vĩnh viễn không thể khôi phục!")) return;
            
            try {
                await axiosClient.delete(`/recipes/${recipeId}`);
                // Cập nhật UI
                setUserData(prev => ({
                    ...prev,
                    recipes: prev.recipes.filter(r => r.recipe_id !== recipeId)
                }));
                alert("Đã xóa vĩnh viễn!");
            } catch (error) {
                alert("Lỗi khi xóa vĩnh viễn: " + (error.response?.data?.message || "Lỗi Server"));
            }
        } 
        // TRƯỜNG HỢP 2: Đang ở Tất cả/Chờ duyệt -> Chuyển vào thùng rác (Soft Delete)
        else {
            if (!window.confirm("Bạn muốn chuyển bài viết này vào thùng rác?")) return;

            try {
                await axiosClient.patch(`/recipes/${recipeId}/trash`);
                // Cập nhật UI: Xóa khỏi danh sách hiện tại
                setUserData(prev => ({
                    ...prev,
                    recipes: prev.recipes.filter(r => r.recipe_id !== recipeId),
                    recipes_count: prev.recipes_count - 1
                }));
                alert("Đã chuyển vào thùng rác!");
            } catch (error) {
                alert("Lỗi khi xóa tạm: " + (error.response?.data?.message || "Lỗi Server"));
            }
        }
    };

    // C. Xử lý Bỏ yêu thích (Xóa khỏi bộ sưu tập)
    const handleRemoveFavorite = async (recipeId) => {
        if (!window.confirm("Bạn có muốn bỏ món ăn này khỏi bộ sưu tập?")) return;

        try {
            // Gọi API toggle favorite (hoặc delete favorite tùy backend)
            await axiosClient.post(`/recipes/${recipeId}/favorite`); 
            
            // Cập nhật UI
            setUserData(prev => ({
                ...prev,
                favorite_recipes: prev.favorite_recipes.filter(r => r.recipe_id !== recipeId),
                favorites_count: (prev.favorites_count || 1) - 1
            }));
        } catch (err) {
            alert("Lỗi khi bỏ yêu thích: " + err.message);
        }
    };

    // D. Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER_INFO');
        navigate('/login');
        window.location.reload();
    };

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

    return (
        <div className="profile-container">
            {/* --- SIDEBAR TRÁI --- */}
            <aside className="profile-sidebar">
                <div className="user-info-box">
                    {/* AVATAR: Đã sửa để hiển thị ảnh thật */}
                    <div className="user-avatar-large relative w-24 h-24 mx-auto mb-4">
                        {userData?.user?.avatar_url ? (
                            <img 
                                src={getImageUrl(userData.user.avatar_url)} 
                                alt={userData.user.full_name}
                                className="w-full h-full rounded-full object-cover border-2 border-gray-100 shadow-sm"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={50} className="text-gray-500"/>
                            </div>
                        )}
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

            {/* --- MAIN CONTENT --- */}
            <main className="profile-main-content">
                
                {/* 1. TAB QUẢN LÝ CÔNG THỨC */}
                {activeTab === 'recipes' && (
                    <div className="tab-content">
                        <div className="stats-bar">
                            <div className="stat-item">
                                <div className="stat-value">{userData?.recipes_count || 0}</div>
                                <div className="stat-label">Bài viết</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">{userData?.total_views || 0}</div>
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
                            {userData?.recipes && userData.recipes.length > 0 ? (
                                userData.recipes
                                .filter(r => {
                                    if (recipeFilter === 'pending') return r.status === 'Draft';
                                    if (recipeFilter === 'trash') return r.status === 'Deleted';
                                    // Mặc định 'all' là lấy những bài chưa xóa
                                    return r.status !== 'Deleted';
                                })
                                .map(recipe => (
                                    <div key={recipe.recipe_id} className="recipe-horizontal-card">
                                        <img src={getImageUrl(recipe.image_url)} alt={recipe.title} />
                                        
                                        <div className="recipe-info">
                                            <h4>{recipe.title}</h4>
                                            <div style={{display:'flex', alignItems:'center', gap: '10px', marginTop:'5px'}}>
                                                <span className={`badge ${recipe.status === 'Published' ? 'badge-published' : 'badge-draft'}`}>
                                                    {recipe.status === 'Published' ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                                                </span>
                                                <span style={{fontSize:'12px', color:'#666', display:'flex', alignItems:'center', gap:'4px'}}>
                                                    <Eye size={14} /> {recipe.views}
                                                </span>
                                            </div>
                                        </div>

                                        {/* BUTTON ACTIONS */}
                                        <div className="recipe-meta flex flex-col gap-2">
                                            {/* Nút Sửa: Chỉ hiện khi không ở trong thùng rác */}
                                            {recipeFilter !== 'trash' && (
                                                <button 
                                                    className="btn-icon-edit text-blue-500 hover:bg-blue-50 p-2 rounded"
                                                    onClick={() => handleEditRecipe(recipe.recipe_id)}
                                                    title="Chỉnh sửa bài viết"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            
                                            {/* Nút Xóa */}
                                            <button 
                                                className="btn-icon-trash text-red-500 hover:bg-red-50 p-2 rounded"
                                                onClick={() => handleRecipeActionDelete(recipe.recipe_id)}
                                                title={recipeFilter === 'trash' ? "Xóa vĩnh viễn" : "Chuyển vào thùng rác"}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 mt-10">Chưa có bài viết nào.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. TAB BỘ SƯU TẬP */}
                {activeTab === 'collection' && (
                    <div className="tab-content">
                        <h2 className="content-title">
                            <Heart size={20} className="title-icon" /> BỘ SƯU TẬP YÊU THÍCH
                        </h2>
                        
                        <div className="favorite-list">
                            {userData?.favorite_recipes?.length > 0 ? (
                                userData.favorite_recipes.map(recipe => (
                                    <div key={recipe.recipe_id} className="favorite-horizontal-card">
                                        <div className="favorite-left-group">
                                            <img 
                                                src={getImageUrl(recipe.image_url)} 
                                                alt={recipe.title} 
                                                onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}
                                                className="cursor-pointer"
                                            />
                                            <div className="favorite-info">
                                                <h4 onClick={() => navigate(`/recipes/${recipe.recipe_id}`)} className="cursor-pointer hover:text-orange-500">
                                                    {recipe.title}
                                                </h4>
                                                <span className="favorite-date">
                                                    Đã lưu: {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                                                </span>
                                            </div>
                                        </div>

                                        <button 
                                            className="btn-remove-favorite text-red-500 hover:bg-red-50 p-2 rounded-full" 
                                            onClick={() => handleRemoveFavorite(recipe.recipe_id)}
                                            title="Bỏ yêu thích"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <Heart size={40} className="mx-auto mb-2" />
                                    <p>Bộ sưu tập đang trống.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. TAB GIỎ ĐI CHỢ */}
                {activeTab === 'cart' && (
                    <div className="tab-content">
                        <h2>Giỏ đi chợ</h2>
                        <p style={{color: '#718096'}}>Danh sách nguyên liệu bạn cần mua.</p>
                        <div style={{textAlign: 'center', padding: '50px', color: '#cbd5e0'}}>
                            <ShoppingCart size={40} className="mx-auto" />
                            <p>Giỏ hàng đang trống.</p>
                        </div>
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
                            <button className="cr-btn-publish" style={{background: '#4f91a1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px'}}>
                                Cập nhật thông tin
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default UserProfile;