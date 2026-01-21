import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Comments from '../components/Comments';
import { Heart } from 'lucide-react';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);

    // STATE MỚI: Danh sách nguyên liệu được chọn để mua
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(() => {
        axiosClient.get(`/recipes/${id}`)
            .then(res => {
                const data = res.data;
                // Map author nếu backend trả về user
                if (data.user && !data.author) {
                    data.author = data.user;
                }
                setRecipe(data);
                
                // --- LOGIC MỚI: Tự động chọn tất cả nguyên liệu khi load trang ---
                if (data.ingredients && data.ingredients.length > 0) {
                    const allIngredients = data.ingredients.map(ing => ({
                        name: ing.name,
                        // Ghép số lượng và đơn vị thành chuỗi (VD: "500 gram")
                        quantity: `${ing.pivot?.quantity || ''} ${ing.pivot?.unit || ''}`.trim()
                    }));
                    setSelectedIngredients(allIngredients);
                }
                // ----------------------------------------------------------------

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // --- HÀM MỚI: Xử lý khi tick vào checkbox ---
    const handleCheckboxChange = (item) => {
        const itemQuantity = `${item.pivot?.quantity || ''} ${item.pivot?.unit || ''}`.trim();
        const isSelected = selectedIngredients.some(i => i.name === item.name);

        if (isSelected) {
            // Nếu đang chọn -> Bỏ ra khỏi danh sách
            setSelectedIngredients(selectedIngredients.filter(i => i.name !== item.name));
        } else {
            // Nếu chưa chọn -> Thêm vào
            setSelectedIngredients([...selectedIngredients, {
                name: item.name,
                quantity: itemQuantity
            }]);
        }
    };

    // --- HÀM MỚI: Gửi danh sách đi chợ lên Server ---
    const handleAddToShoppingList = async () => {
        if (selectedIngredients.length === 0) {
            alert("Bạn chưa chọn nguyên liệu nào!");
            return;
        }

        try {
            await axiosClient.post('/shopping-list/bulk', {
                items: selectedIngredients
            });
            alert(`Đã thêm ${selectedIngredients.length} món vào danh sách đi chợ thành công!`);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("Vui lòng đăng nhập để sử dụng tính năng đi chợ!");
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
    };

    const handleToggleFavorite = async () => {
        try {
            const res = await axiosClient.post(`/recipes/${id}/favorite`);
            setIsFavorited(res.data.is_favorited);
            alert(res.data.is_favorited ? "Đã thêm vào bộ sưu tập!" : "Đã xóa khỏi bộ sưu tập!");
        } catch (err) {
            alert("Vui lòng đăng nhập để thực hiện chức năng này!");
        }
    };

    if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Đang tải món ngon...</div>;
    if (!recipe) return <div style={{textAlign:'center', marginTop:'50px'}}>Không tìm thấy món ăn!</div>;

    const mainImage = recipe.image || recipe.image_url || '/default-food.jpg';
    const rawAvatar = recipe.author?.avatar || recipe.user?.avatar;
    const userAvatar = rawAvatar ? `${rawAvatar}?t=${new Date().getTime()}` : '/default-avtar.png';

    const totalRating = recipe.reviews ? recipe.reviews.reduce((acc, curr) => acc + curr.rating, 0) : 0;
    const avgRating = recipe.reviews && recipe.reviews.length ? (totalRating / recipe.reviews.length).toFixed(1) : 0;
    const reviewCount = recipe.reviews ? recipe.reviews.length : 0;
    
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
                    <Link to="/mon-chay" style={{color:'#888', textDecoration:'none'}}>Công thức</Link> 
                    {' / '}
                    <b>{recipe.title}</b>
                </span>
                
                <img src={mainImage} alt={recipe.title} className="detail-hero-img" style={{marginTop:'15px'}} />
                
                <h1 className="detail-title">{recipe.title}</h1>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <img 
                            src={userAvatar} 
                            style={{width:'40px', height:'40px', borderRadius:'50%', objectFit: 'cover'}} 
                            alt="Avatar" 
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = '/default-avtar.png'; 
                            }}
                        />

                        <div>
                            <div style={{fontSize:'13px', color:'#666'}}>
                                Đăng bởi: <b>{recipe.author?.full_name || recipe.user?.full_name || 'Ẩn danh'}</b>
                            </div>
                            <div style={{fontSize:'12px', color:'#999'}}>
                                Ngày: {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className="recipe-header">
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
                    {/* CỘT NGUYÊN LIỆU (ĐÃ SỬA ĐỔI) */}
                    <div className="ingredients-box">
                        <div className="ing-header">🛒 NGUYÊN LIỆU</div>
                        
                        {/* Nút thêm vào giỏ có hiển thị số lượng */}
                        <button 
                            className="btn-add-cart" 
                            onClick={handleAddToShoppingList}
                            style={{background: '#ff8c00', color: 'white', border: 'none', padding: '10px', width: '100%', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                        >
                            + Thêm vào giỏ đi chợ ({selectedIngredients.length})
                        </button>

                        <div className="ing-list" style={{marginTop: '15px'}}>
                            {recipe.ingredients && recipe.ingredients.map((item, index) => (
                                <div key={index} style={{padding:'10px 0', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                                    <span style={{display: 'flex', alignItems: 'center'}}>
                                        <input 
                                            type="checkbox" 
                                            style={{marginRight:'10px', width: '18px', height: '18px', cursor: 'pointer'}} 
                                            // Kiểm tra xem món này có trong mảng đã chọn không
                                            checked={selectedIngredients.some(i => i.name === item.name)}
                                            onChange={() => handleCheckboxChange(item)}
                                        /> 
                                        <b style={{cursor: 'pointer'}} onClick={() => handleCheckboxChange(item)}>{item.name}</b>
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
                                            onError={(e) => e.target.style.display = 'none'}
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
                <div className="review-section" style={{marginTop: '40px'}}>
                    <Comments recipeId={id} />
                </div>

            </div>
        </div>
    );
};

export default RecipeDetail;