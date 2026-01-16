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
            {/* 1. HEADER */}
            <header className="header">
                <div style={{display:'flex', alignItems:'center'}}>
                    <img src="/logo.png" alt="Logo" style={{height:'45px', marginRight:'10px'}} />
                    <div>
                        <h2 style={{color:'#f59e0b', fontSize:'22px', fontWeight:'800'}}>BẾP VIỆT 4.0</h2>
                        <span style={{fontSize:'12px', color:'#666', letterSpacing:'1px'}}>TINH HOA ẨM THỰC VIỆT</span>
                    </div>
                </div>
                
                <nav className="nav-menu">
                    <Link to="/" style={{color:'#f59e0b'}}>Trang chủ</Link>
                    <Link to="/recipes">Công thức</Link>
                    <Link to="/community">Cộng đồng</Link>
                    <Link to="/blog">Blog</Link>
                </nav>

                <div className="header-search">
                    <input type="text" placeholder="🔍 Tìm nhanh công thức..." />
                </div>

                <div className="user-info">
                    {user ? (
                        <>
                            <img src={user.avatar || '/default-avatar.png'} style={{width:'35px', height:'35px', borderRadius:'50%'}} alt="" />
                            <div style={{fontSize:'13px'}}>
                                <div>Xin chào,</div>
                                <b>{user.full_name}</b>
                            </div>
                            <button onClick={handleLogout} style={{marginLeft:'10px', fontSize:'12px', color:'#666', background:'none', border:'none', cursor:'pointer'}}>(Thoát)</button>
                            <Link to="/create-recipe" className="btn-post" style={{marginLeft:'10px'}}>+ Đăng bài</Link>
                        </>
                    ) : (
                        <Link to="/login" className="btn-post">Đăng nhập</Link>
                    )}
                </div>
            </header>

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
                <div className="cat-item"><div className="cat-icon" style={{color:'#eab308'}}>☕</div><span>Sáng</span></div>
                <div className="cat-item"><div className="cat-icon" style={{color:'#22c55e'}}>🥗</div><Link to="/Categories-Collections">Chay</Link></div>
                <div className="cat-item"><div className="cat-icon" style={{color:'#ef4444'}}>🍲</div><span>Lẩu</span></div>
                <div className="cat-item"><div className="cat-icon" style={{color:'#f97316'}}>🍰</div><span>Bánh</span></div>
                <div className="cat-item"><div className="cat-icon" style={{color:'#3b82f6'}}>🍹</div><span>Đồ uống</span></div>
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

            {/* 6. FOOTER */}
            <footer className="footer">
                <div>
                    <div style={{display:'flex', alignItems:'center', marginBottom:'15px'}}>
                        <img src="/logo.png" alt="" style={{height:'40px', background:'white', borderRadius:'50%', padding:'2px', marginRight:'10px'}} />
                        <h2 style={{color:'white', margin:0}}>BẾP VIỆT 4.0</h2>
                    </div>
                    <p style={{lineHeight:'1.6'}}>Tinh hoa ẩm thực Việt trong kỷ nguyên số.<br/>Kết nối đam mê, chia sẻ hương vị.</p>
                </div>
                <div>
                    <h3>VỀ CHÚNG TÔI</h3>
                    <ul>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>
                <div>
                    <h3>KẾT NỐI</h3>
                    <ul>
                        <li>Facebook</li>
                        <li>Youtube</li>
                        <li>Instagram</li>
                        <li>Tiktok</li>
                    </ul>
                </div>
                <div>
                    <h3>NHẬN TIN MỚI</h3>
                    <p style={{marginBottom:'10px'}}>Nhận công thức ngon mỗi tuần:</p>
                    <div className="footer-input">
                        <input type="text" placeholder="Email của bạn..." />
                        <button>Gửi</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;