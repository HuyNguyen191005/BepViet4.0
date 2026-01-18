import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BlogComments from '../components/BlogComments';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // Hàm xử lý đường dẫn ảnh an toàn
    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://via.placeholder.com/300x200?text=No+Image';
        if (imageName.startsWith('http')) return imageName;
        return `http://localhost:8000/storage/${imageName}`;
    };

    // 1. Lấy chi tiết bài viết
    useEffect(() => {
        window.scrollTo(0, 0); 
        setLoading(true);
        
        axios.get(`http://localhost:8000/api/posts/${id}`)
            .then(res => {
                // Kiểm tra xem dữ liệu có bọc trong 'data' (Laravel Resource) hay không
                const postData = res.data.data ? res.data.data : res.data;
                setPost(postData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy bài viết:", err);
                setLoading(false);
            });
    }, [id]);

    // 2. Lấy bài viết liên quan (Logic an toàn + Fallback)
    useEffect(() => {
        if (!post) return;

        axios.get('http://localhost:8000/api/posts')
            .then(res => {
                // Bước 1: Chuẩn hóa dữ liệu về mảng
                let allPosts = [];
                if (Array.isArray(res.data)) {
                    allPosts = res.data;
                } else if (res.data && Array.isArray(res.data.data)) {
                    allPosts = res.data.data;
                } else {
                    return; // API lỗi định dạng
                }

                // Bước 2: Lọc bỏ bài hiện tại
                const currentId = String(post.post_id || post.id); 
                let filtered = allPosts.filter(p => {
                    const pId = String(p.post_id || p.id);
                    return pId !== currentId;
                });

                // Bước 3: Ưu tiên tìm bài cùng Type
                const sameType = filtered.filter(p => post.type && p.type === post.type);
                
                let finalResult = [];
                if (sameType.length > 0) {
                    finalResult = sameType; // Có bài cùng loại thì lấy
                } else {
                    finalResult = filtered; // Không có thì lấy bài mới nhất bất kỳ
                }

                // Lấy tối đa 3 bài
                setRelatedPosts(finalResult.slice(0, 3));
            })
            .catch(err => console.error("Lỗi API related:", err));

    }, [post]);

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải...</div>;
    if (!post) return <div style={{textAlign: 'center', padding: '50px'}}>Không tìm thấy bài viết!</div>;

    // --- LOGIC XÁC ĐỊNH TÊN TÁC GIẢ BÀI CHÍNH ---
    const authorName = post.user?.full_name || post.author || "Admin";
    const authorAvatar = post.user?.avatar 
        ? getImageUrl(post.user.avatar) 
        : `https://ui-avatars.com/api/?name=${authorName}&background=0D8ABC&color=fff`;

    return (
        <div className="post-detail-wrapper" style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
            
            {/* --- HEADER BÀI VIẾT (Đã sửa hiển thị người đăng) --- */}
            <header className="post-header-center" style={{textAlign: 'center', marginBottom: '40px'}}>
                <div className="post-cat-badge" style={{
                    display: 'inline-block', 
                    padding: '5px 15px', 
                    background: '#f0f0f0', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem',
                    marginBottom: '15px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {post.type ? post.type.toUpperCase() : 'BLOG'}
                </div>
                
                <h1 className="post-main-title" style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2'}}>
                    {post.title}
                </h1>

                <div className="post-meta-row" style={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '15px', 
                    color: '#666',
                    fontSize: '0.95rem'
                }}>
                    <div className="meta-author" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img 
                            src={authorAvatar} 
                            alt="Author" 
                            className="meta-avatar" 
                            style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                        />
                        <span style={{fontWeight: '600'}}>
                            Đăng bởi: {authorName}
                        </span> 
                    </div>
                    <span className="meta-divider">|</span>
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
            </header>

            {/* --- BODY CONTENT --- */}
            <article className="post-body" style={{marginBottom: '50px', fontSize: '1.1rem', lineHeight: '1.8'}}>
                <img 
                    src={getImageUrl(post.thumbnail)} 
                    alt={post.title} 
                    className="post-featured-img"
                    style={{width: '100%', maxHeight: '600px', objectFit: 'cover', borderRadius: '12px', marginBottom: '40px'}}
                    onError={(e) => {e.target.style.display = 'none'}}
                />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* --- FOOTER ACTIONS --- */}
            <div className="post-footer-actions" style={{display: 'flex', gap: '15px', marginBottom: '50px'}}>
                <button className="btn-action" style={{padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer'}}>
                    ❤️ Yêu thích
                </button>
                <button className="btn-action" style={{padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', cursor: 'pointer'}}>
                    📘 Chia sẻ Facebook
                </button>
            </div>

            {/* --- COMMENTS --- */}
            <BlogComments postId={id} />

            {/* --- RELATED POSTS (Đã sửa hiển thị người đăng trên Card) --- */}
            {relatedPosts.length > 0 && (
                <div className="related-wrapper" style={{marginTop: '60px', borderTop: '2px solid #f5f5f5', paddingTop: '40px'}}>
                    <h3 style={{
                        textAlign: 'center', 
                        marginBottom: '30px', 
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1.5rem'
                    }}>
                        {post.type ? 'Bài viết cùng chuyên mục' : 'Bài viết mới nhất'}
                    </h3>
                    
                    <div className="related-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '25px'
                    }}>
                        {relatedPosts.map(rel => (
                            <Link 
                                to={`/blog/${rel.post_id || rel.id}`} 
                                key={rel.post_id || rel.id} 
                                className="related-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    border: '1px solid #eee',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    background: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                <div style={{height: '180px', overflow: 'hidden'}}>
                                    <img 
                                        src={getImageUrl(rel.thumbnail)} 
                                        alt={rel.title} 
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    />
                                </div>
                                <div style={{padding: '20px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                                    <h4 style={{
                                        margin: '0 0 15px 0', 
                                        fontSize: '1.1rem', 
                                        fontWeight: 'bold',
                                        lineHeight: '1.4',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        flex: 1
                                    }}>
                                        {rel.title}
                                    </h4>
                                    
                                    {/* FOOTER CỦA CARD (NGƯỜI ĐĂNG + NGÀY) */}
                                    <div style={{
                                        borderTop: '1px solid #f0f0f0',
                                        paddingTop: '12px',
                                        marginTop: 'auto',
                                        fontSize: '0.85rem',
                                        color: '#777',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                            <span>👤</span>
                                            <span style={{fontWeight: '600', color: '#444'}}>
                                                {rel.user ? rel.user.full_name : (rel.author || "Admin")}
                                            </span>
                                        </div>
                                        <span>
                                            📅 {new Date(rel.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetail;