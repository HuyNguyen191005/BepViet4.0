import React from 'react';
import { Link } from 'react-router-dom';
const RecipeCard = ({ recipe }) => {
    const imageUrl = recipe.image_url ? recipe.image_url : '/default-food.jpg';
    
    // Tạo rating giả lập vì DB chưa có bảng review (để giao diện đẹp)
    const mockRating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

    return (
        <div className="recipe-card">
            <Link to={`/recipes/${recipe.recipe_id}`} style={{textDecoration:'none', color:'inherit'}}>
            <div style={{position:'relative'}}>
                <img src={imageUrl} alt={recipe.title} className="recipe-img" />
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
                    <img className="author-avatar" src={recipe.author?.avatar || '/default-avatar.png'} alt="" />
                    <span style={{fontWeight:'500'}}>{recipe.author?.full_name || 'Đầu bếp ẩn danh'}</span>
                    {/* Nút tim yêu thích giả lập */}
                    <span style={{marginLeft:'auto', color:'#ddd', cursor:'pointer'}}>❤</span>
                </div>
            </div>
            </Link>
        </div>
    );
};

export default RecipeCard;