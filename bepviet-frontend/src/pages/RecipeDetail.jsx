import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Comments from '../components/Comments'; // <-- 1. Import Component Bình luận
import { Heart } from 'lucide-react'; // Đảm bảo đã import

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        axiosClient.get(`/recipes/${id}`)
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

    const mainImage = recipe.image_url && recipe.image_url !== 'logo.png' ? recipe.image_url : '/default-food.jpg';

    // Tính điểm trung bình rating (Hiển thị ở Header)
    // Lưu ý: Số liệu này lấy từ lần tải trang đầu tiên
    const totalRating = recipe.reviews ? recipe.reviews.reduce((acc, curr) => acc + curr.rating, 0) : 0;
    const avgRating = recipe.reviews && recipe.reviews.length ? (totalRating / recipe.reviews.length).toFixed(1) : 0;
    const reviewCount = recipe.reviews ? recipe.reviews.length : 0;
    const handleToggleFavorite = async () => {
        try {
            const res = await axiosClient.post(`/recipes/${id}/favorite`);
            setIsFavorited(res.data.is_favorited);
            alert(res.data.is_favorited ? "Đã thêm vào bộ sưu tập!" : "Đã xóa khỏi bộ sưu tập!");
        } catch (err) {
            alert("Vui lòng đăng nhập để thực hiện chức năng này!");
        }
    };
    
    return (
        <div style={{background: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px'}}>
            <div style={{background:'white', padding:'15px 50px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)', marginBottom:'20px'}}>
               <Link to="/" style={{textDecoration:'none', color:'#333', fontWeight:'bold'}}>⬅ Quay lại Trang chủ</Link>
            </div>

            <div className="detail-container">
                {/* HEADER INFO */}
                <span style={{fontSize:'13px', color:'#888'}}>
                    <Link to="/" style={{color:'#888', textDecoration:'none'}}>Trang chủ</Link> 
                    {' / '}
                    <Link to="/mon-chay" style={{color:'#888', textDecoration:'none'}}>Món Chay</Link> 
                    {' / '}
                    <b>{recipe.title}</b>
                </span>
                
                <img src={mainImage} alt={recipe.title} className="detail-hero-img" style={{marginTop:'15px'}} />
                
                <h1 className="detail-title">{recipe.title}</h1>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <img src={recipe.author?.avatar && recipe.author.avatar !== 'logo.png' ? recipe.author.avatar : '/default-avatar.png'} style={{width:'40px', height:'40px', borderRadius:'50%'}} alt="Avatar" />
                        <div>
                            <div style={{fontSize:'13px', color:'#666'}}>Đăng bởi: <b>{recipe.author?.full_name}</b></div>
                            <div style={{fontSize:'12px', color:'#999'}}>Ngày: {new Date(recipe.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="recipe-header">
               
                {/* NÚT LIKE HÌNH TRÁI TIM */}
                <button 
                onClick={handleToggleFavorite}
                className={`btn-heart-like ${isFavorited ? 'active' : ''}`}
            >
                <Heart size={25} fill={isFavorited ? "#e53e3e" : "none"} strokeWidth={2.5} />
                <span>{isFavorited ? 'Đã lưu' : 'Yêu thích'}</span>
                </button>
                </div>  
                    <div>
                        <span style={{color:'#f59e0b', fontSize:'18px'}}>★ {avgRating} ({reviewCount} đánh giá)</span>
                    </div>
                </div>
                

                {/* META BAR */}
                <div className="meta-bar">
                    <span>⏱ Nấu: {recipe.cooking_time}p</span>
                    <span>👥 Khẩu phần: {recipe.servings} người</span>
                    <span>🏆 Độ khó: {recipe.difficulty}</span>
                    <span>👁 Lượt xem: {recipe.views}</span>
                </div>

                <div className="detail-desc">"{recipe.description}"</div>

                <div className="detail-content">
                    {/* CỘT NGUYÊN LIỆU */}
                    <div className="ingredients-box">
                        <div className="ing-header">🛒 NGUYÊN LIỆU</div>
                        <button className="btn-add-cart">+ Thêm vào giỏ</button>
                        <div className="ing-list">
                            {recipe.ingredients && recipe.ingredients.map((item, index) => (
                                <div key={index} style={{padding:'10px 0', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
                                    <span>
                                        <input type="checkbox" style={{marginRight:'10px'}} /> 
                                        <b>{item.name}</b>
                                    </span>
                                    <span style={{color:'#666'}}>
                                        {item.pivot.quantity} {item.pivot.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CỘT CÁCH LÀM */}
                    <div className="steps-box">
                        <div className="ing-header">📝 CÁCH LÀM</div>
                        
                        {recipe.steps && recipe.steps.length > 0 ? (
                            recipe.steps.map((step) => (
                                <div key={step.step_id} className="step-item">
                                    <div className="step-title">Bước {step.step_order}</div>
                                    <p style={{fontSize:'15px', lineHeight:'1.6'}}>{step.content}</p>
                                    
                                    {step.image_url && (
                                        <img 
                                            src={step.image_url}
                                            className="step-img" 
                                            alt={`Step ${step.step_order}`} 
                                            style={{
                                                marginTop: '10px', 
                                                maxWidth: '100%', 
                                                height: 'auto',
                                                borderRadius: '8px', 
                                                display: 'block'
                                            }}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Chưa có hướng dẫn cụ thể cho món này.</p>
                        )}
                    </div>
                </div>

                {/* --- PHẦN BÌNH LUẬN MỚI --- */}
                {/* Thay thế code cũ bằng Component Comments */}
                <div className="review-section" style={{marginTop: '40px'}}>
                    <Comments recipeId={id} />
                </div>

            </div>
        </div>
    );
};

export default RecipeDetail;