import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import axiosClient from '../api/axiosClient';

const VegetarianPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const [user] = useState(() => {
        const storedUser = localStorage.getItem('USER_INFO');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        setLoading(true);
        // Gọi API lấy 8 món/trang từ Laravel
        axiosClient.get(`/categories/1/recipes?page=${currentPage}`)
            .then(res => {
                setRecipes(res.data.recipes.data);
                setPagination(res.data.recipes);
                setCategory(res.data.category);
                setLoading(false);
                window.scrollTo(0, 0);
            })
            .catch(err => {
                console.error("Lỗi tải dữ liệu:", err);
                setLoading(false);
            });
    }, [currentPage]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) return <div style={{textAlign:'center', marginTop:'100px'}}>Đang tải món ăn sáng...</div>;

    return (
        <div className="home-page">
            
            {/* 1. HEADER (Copy từ Home.jsx) */}
            <header className="header">
                <div style={{display:'flex', alignItems:'center'}}>
                    <img src="/logo.png" alt="Logo" style={{height:'45px', marginRight:'10px'}} />
                    <div>
                        <h2 style={{color:'#f59e0b', fontSize:'22px', fontWeight:'800'}}>BẾP VIỆT 4.0</h2>
                        <span style={{fontSize:'12px', color:'#666', letterSpacing:'1px'}}>TINH HOA ẨM THỰC VIỆT</span>
                    </div>
                </div>
                
                <nav className="nav-menu">
                    <Link to="/">Trang chủ</Link>
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

            {/* 2. BANNER */}
            <div className="hero-section" style={{
    background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/images/breakfast-bg.jpg")', 
    backgroundColor: '#f59e0b' // Màu tím đồng bộ icon Sáng
}}>
    <h1 className="hero-title">{category?.name?.toUpperCase() || 'MÓN ĂN SÁNG'}</h1>
    <p style={{fontStyle:'italic', opacity: 0.9}}>“{category?.description || 'Năng lượng khởi đầu ngày mới'}”</p>
</div>

            {/* 3. DANH SÁCH MÓN ĂN (3 MÓN/HÀNG) */}
            <div style={{maxWidth: '1200px', margin: '40px auto', minHeight: '500px', padding: '0 20px'}}>
                <div style={{
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', // Cố định 3 món 1 hàng
                    gap: '30px'
                }}>
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                    ))}
                </div>

                {/* PHÂN TRANG */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '50px', marginBottom: '50px'}}>
                    {[...Array(pagination.last_page)].map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                width: '40px', height: '40px', borderRadius: '5px', border: '1px solid #ddd',
                                background: currentPage === i + 1 ? '#22c55e' : 'white',
                                color: currentPage === i + 1 ? 'white' : '#333',
                                cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. FOOTER (Copy y xì từ Home.jsx) */}
            <footer style={{ background: '#1a1a2e', color: 'rgba(255,255,255,0.6)', padding: '25px 0', textAlign: 'center', fontSize: '12px' }}>
                Copyright © 2026 Bếp Việt 4.0. All rights reserved.
            </footer>
        </div>
    );
};

export default VegetarianPage;