import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import axiosClient from '../api/axiosClient';
const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [user, setUser] = useState(null);

    // Load dữ liệu khi vào trang
    useEffect(() => {
        // 1. Lấy thông tin user đăng nhập
        const storedUser = localStorage.getItem('USER_INFO');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // 2. Gọi API lấy danh sách món ăn từ Laravel
        axiosClient.get('/recipes')
            .then(res => {
                setRecipes(res.data);
            })
            .catch(err => {
                console.error("Lỗi tải món ăn:", err);
                // Dữ liệu mẫu fallback nếu API chưa có dữ liệu hoặc lỗi
                setRecipes([
                    { recipe_id: 1, title: 'Phở Bò Tái Lăn', cooking_time: 45, difficulty: 'Dễ', image_url: '', author: { full_name: 'Bếp Trưởng' } },
                    { recipe_id: 2, title: 'Sườn Xào Chua Ngọt', cooking_time: 30, difficulty: 'Trung bình', image_url: '', author: { full_name: 'Mẹ Bắp' } },
                ]);
            });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="home-page">
            

            {/* 2. HERO BANNER */}
            <div className="hero-section">
                <h1 className="hero-title">HÔM NAY BẠN MUỐN ĂN GÌ?</h1>
                <p style={{fontStyle:'italic', marginBottom:'25px', opacity: 0.9}}>“Giải cứu tủ lạnh với gợi ý thông minh từ Bếp Việt”</p>
                <div className="hero-search-bar">
                    <span style={{fontSize:'24px', marginRight:'10px'}}>🥕</span>
                    <input type="text" placeholder="Nhập nguyên liệu: Trứng, cà chua, thịt bò..." />
                    <button>TÌM KIẾM ➔</button>
                </div>
            </div>

            {/* 3. DANH MỤC */}
            <div className="category-section">
  {/* Sáng: Thay ☕ thành 🍳 (Trứng ốp la) hoặc 🥣 (Bát phở/cháo) sẽ đúng chất ăn sáng hơn */}
  <Link to="/an-sang" className="cat-item" style={{textDecoration: 'none', color:'inherit'}}>
    <div className="cat-icon" style={{color:'#22c55e'}}>🍳</div>
    <span>Sáng</span>
  </Link>

  {/* Món chính: Thay 🥗 thành 🍛 (Cơm cà ri/thức ăn) hoặc 🍱 (Khay cơm) */}
  <Link to="/mon-chinh" className="cat-item" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="cat-icon" style={{color:'#22c55e'}}>🍛</div>
    <span>Món chính</span>
  </Link>

  {/* Tráng miệng: Thay 🍲 thành 🍰 (Bánh ngọt) hoặc 🍮 (Caramen) */}
  <Link to="/trang-mieng" className="cat-item" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="cat-icon" style={{color:'#ef4444'}}>🍰</div>
    <span>Tráng miệng</span>
  </Link>

  {/* Miền Bắc: Thay 🍰 thành 🍜 (Bát mì/phở - đặc trưng văn hóa ẩm thực Bắc) */}
  <Link to="/mien-bac" className="cat-item" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="cat-icon" style={{color:'#f97316'}}>🍜</div>
    <span>Miền Bắc</span>
  </Link>

  {/* Miền Nam: Thay 🍹 thành 🥥 (Quả dừa) hoặc 🥘 (Món kho/lẩu miền Nam) */}
  <Link to="/mien-nam" className="cat-item" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="cat-icon" style={{color:'#3b82f6'}}>🥥</div>
    <span>Miền Nam</span>
  </Link>
</div>


            {/* 4. MÓN NGON NỔI BẬT (GRID) */}
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h2 className="section-title">MÓN NGON NỔI BẬT</h2>
                <div className="recipe-grid">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                    ))}
                </div>
            </div>

            {/* 5. CỘNG ĐỒNG VỪA NẤU GÌ? */}
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h2 className="section-title" style={{borderColor:'#22c55e'}}>CỘNG ĐỒNG VỪA NẤU GÌ?</h2>
                <div className="community-section">
                    {/* Ảnh lớn bên trái */}
                    <div className="comm-left">
                        <img src="/banner-home.jpg" alt="Featured Community" />
                        <div className="comm-overlay">
                            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px'}}>
                                <img src="/logo.png" style={{width:'30px', height:'30px', borderRadius:'50%', background:'white'}}/>
                                <b>Mẹ Bắp</b> <span style={{fontSize:'12px', opacity:0.8}}>• Vừa xong</span>
                            </div>
                            <h2 style={{margin:0}}>Lẩu Thái Canh Chua - Ấm lòng ngày mưa</h2>
                            <p style={{fontSize:'14px', marginTop:'5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>Hôm nay trời mưa, mình làm món này cho cả nhà. Bí quyết nằm ở phần nước cốt me và sả phi thơm...</p>
                        </div>
                    </div>

                    {/* List nhỏ bên phải */}
                    <div className="comm-right">
                        <div className="comm-card">
                            <img src="/default-food.jpg" alt="" />
                            <div>
                                <h4 style={{margin:0, fontSize:'14px'}}>Bún Chả Hà Nội</h4>
                                <span style={{fontSize:'12px', color:'#666'}}>5 phút trước • <b>Nam Nguyễn</b></span>
                            </div>
                        </div>
                        <div className="comm-card">
                            <img src="/default-food.jpg" alt="" />
                            <div>
                                <h4 style={{margin:0, fontSize:'14px'}}>Cá Kho Tộ Miền Tây</h4>
                                <span style={{fontSize:'12px', color:'#666'}}>10 phút trước • <b>Dì Tư</b></span>
                            </div>
                        </div>
                        <div className="comm-card">
                            <img src="/default-food.jpg" alt="" />
                            <div>
                                <h4 style={{margin:0, fontSize:'14px'}}>Rau Muống Xào Tỏi</h4>
                                <span style={{fontSize:'12px', color:'#666'}}>15 phút trước • <b>Lan Anh</b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;