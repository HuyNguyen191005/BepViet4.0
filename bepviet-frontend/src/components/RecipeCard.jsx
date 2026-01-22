import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    // 1. XỬ LÝ ĐƯỜNG DẪN (QUAN TRỌNG)
    // Nếu có slug -> /recipes/ga-luoc-la-chanh
    // Nếu chưa có slug -> /recipes/15
    const linkUrl = `/recipes/${recipe.slug ? recipe.slug : (recipe.recipe_id || recipe.id)}`;

    // 2. XỬ LÝ ẢNH MÓN ĂN
    // Backend Laravel trả về 'image_url'. 
    // Nếu ảnh là đường dẫn tương đối (storage/...), cần thêm domain localhost vào trước.
    let imgSource = recipe.image_url || recipe.image; 
    
    if (imgSource && !imgSource.includes('http')) {
        imgSource = `http://localhost:8000/${imgSource}`;
    }
    
    const mainImage = imgSource || '/default-food.jpg';

    // 3. XỬ LÝ AVATAR USER
    const userAvatar = (recipe.user && recipe.user.avatar) 
        ? (recipe.user.avatar.includes('http') ? recipe.user.avatar : `http://localhost:8000/${recipe.user.avatar}`) 
        : '/default-avtar.png';
    
    // 4. XỬ LÝ TÊN USER
    // Hỗ trợ cả cấu trúc 'user' (Laravel) hoặc 'author' (nếu bạn có map dữ liệu khác)
    const userName = recipe.user?.full_name || recipe.author?.full_name || 'Đầu bếp ẩn danh';

    // Tạo rating giả lập
    const mockRating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

    return (
        <div className="recipe-card">
            {/* Link bao quanh thẻ card với đường dẫn URL Slug */}
            <Link to={linkUrl} style={{textDecoration:'none', color:'inherit'}}>
            
            <div style={{position:'relative'}}>
                {/* ẢNH MÓN ĂN */}
                <img 
                    src={mainImage} 
                    alt={recipe.title} 
                    className="recipe-img" 
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
                            e.target.src = '/default-avtar.png';
                        }}
                        style={{
                            width: '30px',      
                            height: '30px',     
                            borderRadius: '50%', 
                            objectFit: 'cover',  
                            marginRight: '8px',
                            border: '1px solid #eee'
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