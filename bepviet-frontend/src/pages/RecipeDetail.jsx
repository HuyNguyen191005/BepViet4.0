import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; 
// 1. IMPORT COMPONENT NÚT TIM
import LikeButton from '../components/LikeButton'; 

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API lấy chi tiết món ăn
        axios.get(`http://localhost:8000/api/recipes/${id}`)
            .then(res => {
                setRecipe(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Đang tải món ngon...</div>;
    if (!recipe) return <div style={{textAlign:'center', marginTop:'50px'}}>Không tìm thấy món ăn!</div>;

    // Xử lý ảnh
    const mainImage = recipe.image_url && recipe.image_url !== 'logo.png' 
        ? (recipe.image_url.startsWith('http') ? recipe.image_url : `http://localhost:8000/${recipe.image_url}`)
        : 'https://via.placeholder.com/800x400?text=No+Image';

    const avatar = recipe.author?.avatar 
        ? recipe.author.avatar 
        : 'https://via.placeholder.com/50';

    // Tính điểm đánh giá
    const totalRating = recipe.reviews ? recipe.reviews.reduce((acc, curr) => acc + curr.rating, 0) : 0;
    const reviewCount = recipe.reviews ? recipe.reviews.length : 0;
    const avgRating = reviewCount ? (totalRating / reviewCount).toFixed(1) : 0;

    return (
        <div style={{background: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px'}}>
            <div style={{background:'white', padding:'15px 50px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)', marginBottom:'20px'}}>
               <Link to="/" style={{textDecoration:'none', color:'#333', fontWeight:'bold'}}>⬅ Quay lại Trang chủ</Link>
            </div>

            <div className="detail-container" style={{maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '8px'}}>
                {/* HEADER INFO */}
                <span style={{fontSize:'13px', color:'#888'}}>
                    <Link to="/" style={{color:'#888', textDecoration:'none'}}>Trang chủ</Link> 
                    {' / '}
                    <b>{recipe.title}</b>
                </span>
                
                <img src={mainImage} alt={recipe.title} style={{width: '100%', height: '400px', objectFit: 'cover', marginTop:'15px', borderRadius: '8px'}} />
                
                {/* 2. CHỈNH SỬA PHẦN TIÊU ĐỀ ĐỂ THÊM NÚT TIM */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0'}}>
                    <h1 style={{fontSize: '28px', color: '#333', margin: 0}}>{recipe.title}</h1>
                    
                    {/* Chèn nút Tim vào đây - Truyền recipe_id vào */}
                    <LikeButton recipeId={recipe.recipe_id} />
                </div>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <img src={avatar} alt="Author" style={{width:'40px', height:'40px', borderRadius:'50%'}} />
                        <div>
                            <div style={{fontSize:'13px', color:'#666'}}>Đăng bởi: <b>{recipe.author?.full_name || 'Ẩn danh'}</b></div>
                            <div style={{fontSize:'12px', color:'#999'}}>Ngày: {new Date(recipe.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div>
                        <span style={{color:'#f59e0b', fontSize:'18px', fontWeight: 'bold'}}>★ {avgRating}</span>
                        <span style={{color:'#888', fontSize:'14px'}}> ({reviewCount} đánh giá)</span>
                    </div>
                </div>

                {/* META BAR */}
                <div style={{display: 'flex', gap: '40px', padding: '20px 0', borderBottom: '1px solid #eee'}}>
                    <div><strong>⏱ Thời gian:</strong> {recipe.cooking_time} phút</div>
                    <div><strong>⚡ Độ khó:</strong> {recipe.difficulty}</div>
                    <div><strong>👥 Khẩu phần:</strong> {recipe.servings} người</div>
                </div>

                {/* DESCRIPTION */}
                <div style={{marginTop: '20px'}}>
                    <p style={{lineHeight: '1.6', color: '#444'}}>{recipe.description}</p>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;