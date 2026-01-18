import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Thêm Link
import axios from 'axios';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]); // State chứa bài liên quan
    const [loading, setLoading] = useState(true);

    // Hàm xử lý đường dẫn ảnh
    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://via.placeholder.com/800x400';
        if (imageName.startsWith('http')) return imageName;
        return `http://localhost:8000/storage/${imageName}`;
    };

    // 1. Lấy chi tiết bài viết hiện tại
    useEffect(() => {
        window.scrollTo(0, 0); // Khi đổi bài viết, cuộn lên đầu trang
        setLoading(true);
        
        axios.get(`http://localhost:8000/api/posts/${id}`)
            .then(res => {
                setPost(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi:", err);
                setLoading(false);
            });
    }, [id]); // Chạy lại khi ID thay đổi

    // 2. Lấy bài viết liên quan (Chạy khi đã có thông tin bài viết post)
    // 2. Lấy bài viết liên quan
    useEffect(() => {
        if (post) {
            axios.get('http://localhost:8000/api/posts')
                .then(res => {
                    const allPosts = res.data;
                    
                    // --- SỬA LỖI TẠI ĐÂY (Dùng .post_id thay vì .id) ---
                    let filtered = allPosts.filter(p => 
                        p.post_id !== post.post_id && // <-- Sửa thành post_id
                        p.type === post.type
                    );

                    // Fallback: Nếu không có bài cùng loại, lấy 3 bài mới nhất
                    if (filtered.length === 0) {
                        filtered = allPosts
                            .filter(p => p.post_id !== post.post_id) // <-- Sửa thành post_id
                            .slice(0, 3);
                    } else {
                        filtered = filtered.slice(0, 3);
                    }
                    
                    setRelatedPosts(filtered);
                })
                .catch(err => console.error("Lỗi:", err));
        }
    }, [post]);

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải bài viết...</div>;
    if (!post) return <div style={{textAlign: 'center', padding: '50px'}}>Không tìm thấy bài viết!</div>;

    return (
        <div className="post-detail-wrapper">
            
            {/* HEADER */}
            <header className="post-header-center">
                <div className="post-cat-badge">
                    CHUYÊN MỤC: {post.type ? post.type.toUpperCase() : 'BLOG'}
                </div>
                <h1 className="post-main-title">{post.title}</h1>
                <div className="post-meta-row">
                    <div className="meta-author">
                        <img 
                            src={`https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff`} 
                            alt="Author" 
                            className="meta-avatar" 
                        />
                        <span>Đăng bởi: Admin</span> 
                    </div>
                    <span className="meta-divider">|</span>
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
            </header>

            {/* BODY CONTENT */}
            <article className="post-body">
                <img 
                    src={getImageUrl(post.thumbnail)} 
                    alt={post.title} 
                    className="post-featured-img"
                    onError={(e) => {e.target.style.display = 'none'}}
                />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* FOOTER ACTIONS */}
            <div className="post-footer-actions">
                <button className="btn-action">❤️ Yêu thích</button>
                <button className="btn-action">📘 Chia sẻ Facebook</button>
            </div>

            {/* COMMENTS */}
            <div className="comment-section-wrapper">
                <h3 style={{marginTop: 0, marginBottom: '20px'}}>Bình luận</h3>
                <div className="comment-input-row">
                    <img src="https://ui-avatars.com/api/?name=Me&background=random" className="meta-avatar" alt="Me"/>
                    <input type="text" className="comment-input" placeholder="Viết bình luận của bạn..." />
                    <button className="btn-send">GỬI</button>
                </div>
            </div>

           {/* --- PHẦN BÀI VIẾT LIÊN QUAN --- */}
            {relatedPosts.length > 0 && (
                <div className="related-wrapper">
                    <h3 style={{textAlign: 'center', marginBottom: '30px', textTransform: 'uppercase'}}>
                        Bài viết cùng chuyên mục
                    </h3>
                    
                    <div className="related-grid">
                        {relatedPosts.map(relPost => (
                            <Link 
                                to={`/blog/${relPost.post_id}`}  /* <-- Sửa thành post_id */
                                key={relPost.post_id}            /* <-- Sửa thành post_id */
                                className="related-card"
                            >
                                <img 
                                    src={getImageUrl(relPost.thumbnail)} 
                                    alt={relPost.title} 
                                    className="related-thumb" 
                                />
                                <div className="related-card-title">
                                    {relPost.title}
                                </div>
                                <div className="related-date">
                                    📅 {new Date(relPost.created_at).toLocaleDateString('vi-VN')}
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