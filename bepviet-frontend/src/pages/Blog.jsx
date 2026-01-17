import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Thêm useNavigate
import axios from 'axios';

const Blog = () => {
    // --- STATE ---
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate(); // 2. Khai báo hook điều hướng

    // --- 3. HÀM KIỂM TRA ĐĂNG NHẬP ---
    const handleCreatePost = (e) => {
        e.preventDefault(); 
        
        // Lấy token theo đúng key trong hình bạn gửi
        const token = localStorage.getItem('ACCESS_TOKEN');

        if (token) {
            // Có token -> Cho qua trang viết bài
            navigate('/create-post');
        } else {
            // Không có token -> Báo lỗi và đẩy về đăng nhập
            alert("Bạn cần đăng nhập để viết bài!");
            navigate('/login'); // Đảm bảo đường dẫn '/login' đúng với dự án của bạn
        }
    };

    // --- HÀM XỬ LÝ ẢNH ---
    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://via.placeholder.com/400x300?text=No+Image'; 
        if (imageName.startsWith('http')) return imageName;
        return `http://localhost:8000/storage/${imageName}`;
    };

    // --- GỌI API LẤY BÀI VIẾT (KÈM SỐ TRANG) ---
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/posts?page=${currentPage}`)
            .then(res => {
                setPosts(res.data.data); 
                setTotalPages(res.data.last_page);
                setLoading(false);
                window.scrollTo(0, 0);
            })
            .catch(err => {
                console.error("Lỗi lấy bài viết:", err);
                setLoading(false);
            });
    }, [currentPage]);

    // Hàm đổi trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // --- TÁCH DỮ LIỆU HIỂN THỊ ---
    const featuredPost = posts.length > 0 ? posts[0] : null;
    const mainPosts = posts.slice(1); 
    const reviewPosts = posts.filter(p => p.type === 'Review' || p.type === 'Mẹo vặt').slice(0, 5);

    return (
        <div className="blog-container">
            
            {/* --- 1. HEADER --- */}
            <div className="blog-page-header">
                <h1 className="blog-page-title">Góc Chia Sẻ & Review</h1>
                {/* Thay Link bằng Button và gắn sự kiện onClick */}
                <button 
                    onClick={handleCreatePost} 
                    className="btn-create-post"
                    style={{border: 'none', cursor: 'pointer', fontSize:'16px', fontFamily: 'inherit'}}
                >
                    ✍️ Viết bài ngay
                </button>
            </div>

            {/* --- 2. HERO SECTION --- */}
            <section className="blog-hero">
                {featuredPost ? (
                    <div className="hero-card">
                        <img 
                            src={getImageUrl(featuredPost.thumbnail)} 
                            alt={featuredPost.title} 
                            className="hero-bg"
                        />
                        <div className="hero-overlay">
                            <span className="badge-highlight">NỔI BẬT</span>
                            <h2 className="hero-title">{featuredPost.title}</h2>
                            <Link to={`/blog/${featuredPost.post_id}`} className="btn-hero">
                                Xem chi tiết →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="hero-loading">
                        {loading ? "Đang tải bài viết..." : "Chưa có bài viết nào."}
                    </div>
                )}
            </section>

            <div className="blog-layout">
                {/* --- 3. CỘT TRÁI - DANH SÁCH BÀI VIẾT --- */}
                <main className="blog-main">
                    <h3 className="section-title">✨ Món Ngon Mỗi Ngày (Trang {currentPage})</h3>
                    
                    <div className="posts-grid">
                        {loading && <p>Đang tải danh sách...</p>}
                        
                        {!loading && mainPosts.length > 0 ? (
                            mainPosts.map(post => (
                                <div key={post.post_id} className="post-card">
                                    <Link to={`/blog/${post.post_id}`} className="post-thumb">
                                        <img 
                                            src={getImageUrl(post.thumbnail)} 
                                            alt={post.title} 
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Error'}
                                        />
                                        <span className="post-cat">{post.type || 'Blog'}</span>
                                    </Link>
                                    
                                    <div className="post-content">
                                        <Link to={`/blog/${post.post_id}`} className="post-title">
                                            {post.title}
                                        </Link>
                                        
                                        <div className="post-meta">
                                            <span>📅 {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !loading && <p>Không còn bài viết nào ở danh sách này.</p>
                        )}
                    </div>

                    {/* --- PHẦN NÚT CHUYỂN TRANG --- */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                « Trước
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button 
                                className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Sau »
                            </button>
                        </div>
                    )}
                </main>

                {/* --- 4. CỘT PHẢI - SIDEBAR --- */}
                <aside className="blog-sidebar">
                    
                    {/* Widget CTA - Cũng cần thay nút Link bằng Button */}
                    <div className="sidebar-cta">
                        <div className="cta-title">Bạn có công thức ngon? 🍳</div>
                        <p className="cta-desc">
                            Chia sẻ ngay bí quyết nấu ăn hoặc review quán ngon cùng cộng đồng Bếp Việt nhé!
                        </p>
                        <button 
                            onClick={handleCreatePost} 
                            className="btn-cta-sidebar"
                            style={{border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit'}}
                        >
                            + Đăng bài mới
                        </button>
                    </div>

                    {/* Widget Review */}
                    <div className="sidebar-block">
                        <h3 className="sidebar-title">🥢 Review & Mẹo Vặt</h3>
                        <div className="review-list">
                            {reviewPosts.length > 0 ? reviewPosts.map(post => (
                                <Link to={`/blog/${post.post_id}`} key={post.post_id} className="review-item">
                                    <img 
                                        src={getImageUrl(post.thumbnail)} 
                                        alt={post.title} 
                                        className="review-thumb"
                                    />
                                    <div className="review-info">
                                        <h4 className="review-title">{post.title}</h4>
                                        <div className="review-stars">⭐⭐⭐⭐⭐</div>
                                    </div>
                                </Link>
                            )) : <p style={{fontSize: '14px', color:'#666'}}>Chưa có bài review ở trang này.</p>}
                        </div>
                    </div>

                    {/* Widget Tags */}
                    <div className="sidebar-block">
                        <h3 className="sidebar-title">🏷️ Xu Hướng Tìm Kiếm</h3>
                        <div className="tags-cloud">
                            <span className="tag">#ComGiaDinh</span>
                            <span className="tag">#MonNgonNgayTet</span>
                            <span className="tag">#EatClean</span>
                            <span className="tag">#AirFryer</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Blog;