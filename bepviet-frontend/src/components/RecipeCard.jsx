import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    // 1. XỬ LÝ ẢNH MÓN ĂN
    // Backend trả về 'image' là full URL.
    // Nếu 'image' null hoặc rỗng -> dùng default-food.jpg
    const mainImage = recipe.image || '/default-food.jpg';

    // 2. XỬ LÝ AVATAR USER
    // Kiểm tra recipe.user có tồn tại không (đề phòng user bị xóa)
    // Sau đó lấy avatar, nếu null -> dùng default-avtar.png (hoặc default-avatar.png tùy tên file bạn lưu)
    const userAvatar = (recipe.user && recipe.user.avatar) ? recipe.user.avatar : '/default-avtar.png';
    
    // 3. XỬ LÝ TÊN USER
    const userName = (recipe.user && recipe.user.full_name) ? recipe.user.full_name : 'Người dùng ẩn danh';

    // Tạo rating giả lập (Giữ nguyên logic của bạn)
    const mockRating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

    return (
        <div className="recipe-card">
            {/* Link bao quanh thẻ card */}
            <Link to={`/recipes/${recipe.recipe_id || recipe.id}`} style={{textDecoration:'none', color:'inherit'}}>
            
            <div style={{position:'relative'}}>
                {/* ẢNH MÓN ĂN */}
                <img 
                    src={mainImage} 
                    alt={recipe.title} 
                    className="recipe-img" 
                    // Fallback: Nếu link ảnh bị lỗi 404, tự động thay bằng ảnh mặc định
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/default-food.jpg'; 
                    }}
                />
                <span style={{position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.6)', color:'white', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                    ⏱ {recipe.cooking_time}p
                </span>
            </div>
            
            <div className="recipe-info">
                <div className="recipe-name" title={recipe.title}>{recipe.title}</div>
                
                <div className="recipe-meta">
                    <span style={{color: '#f59e0b', fontWeight:'bold'}}>★ {mockRating}</span>
                    <span style={{background:'#f3f4f6', padding:'2px 8px', borderRadius:'10px', fontSize:'11px'}}>
                        {recipe.difficulty}
                    </span>
                </div>
                
                <div className="recipe-author">
                    {/* AVATAR TÁC GIẢ */}
                    <img 
                        src={userAvatar} 
                        alt="avatar" 
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '/default-avtar.png'; // Fallback nếu avatar lỗi
                        }}
                        style={{
                            width: '30px',      
                            height: '30px',     
                            borderRadius: '50%', 
                            objectFit: 'cover',  
                            marginRight: '8px',
                            border: '1px solid #eee' // Thêm viền nhẹ cho đẹp
                        }}
                    />
                    {/* TÊN TÁC GIẢ */}
                    <span style={{fontWeight:'500', fontSize: '13px'}}>
                        {userName}
                    </span>
                    
                    <span style={{marginLeft:'auto', color:'#ddd', cursor:'pointer'}}>❤</span>
                </div>
            </div>
            </Link>
        </div>
    );
};

export default RecipeCard;