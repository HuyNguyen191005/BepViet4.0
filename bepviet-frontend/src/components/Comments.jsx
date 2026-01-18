import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './Comments.css';

const Comments = ({ recipeId }) => {
    const [reviews, setReviews] = useState([]);
    
    // State cho form chính (đánh giá món ăn)
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);
    
    // State cho form trả lời (reply)
    const [replyComment, setReplyComment] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null); // Lưu ID của comment đang được trả lời

    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('ACCESS_TOKEN');

    // Hàm xử lý URL avatar
    const getAvatarUrl = (user) => {
        if (!user || !user.avatar) {
            const name = user?.full_name || "User";
            return `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`;
        }
        if (user.avatar.startsWith('http')) return user.avatar;
        return `http://localhost:8000/storage/${user.avatar}`;
    };

    // Lấy danh sách bình luận (API cần trả về kèm 'children')
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/reviews/${recipeId}`);
            setReviews(res.data);
        } catch (error) {
            console.error("Lỗi tải bình luận:", error);
        }
    };

    useEffect(() => {
        if (recipeId) fetchReviews();
    }, [recipeId]);

    // Hàm gửi comment (Dùng chung cho cả Cha và Con)
    const handleSubmit = async (e, parentId = null) => {
        e.preventDefault();
        
        if (!token) {
            alert("Bạn cần đăng nhập!");
            return;
        }

        // Kiểm tra nội dung (comment cha hoặc comment con)
        const contentToSend = parentId ? replyComment : newComment;
        if (!contentToSend.trim()) return;

        setLoading(true);
        try {
const payload = {
            recipe_id: recipeId,
            // SỬA DÒNG NÀY: Nếu là reply thì gửi null, không gửi 0 nữa
            rating: parentId ? null : rating, 
            content: contentToSend,
            parent_id: parentId 
        };

            await axios.post('http://localhost:8000/api/reviews', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset form và load lại danh sách để hiện comment mới
            if (parentId) {
                setReplyComment('');
                setActiveReplyId(null);
            } else {
                setNewComment('');
                setRating(5);
            }
            fetchReviews(); // Load lại để cập nhật cây comment

        } catch (error) {
            console.error(error);
            alert("Lỗi khi gửi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments-wrapper">
            <h3 className="comments-header">Đánh giá & Hỏi đáp ({reviews.length})</h3>

            {/* --- FORM ĐÁNH GIÁ CHÍNH (LEVEL 0) --- */}
            {token ? (
                <form onSubmit={(e) => handleSubmit(e, null)} className="comment-form">
                    <div className="rating-group">
                        <span className="rating-label">Đánh giá của bạn:</span>
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index} style={{cursor: 'pointer'}}>
                                    <input type="radio" name="rating" style={{display:'none'}} value={ratingValue} onClick={() => setRating(ratingValue)}/>
                                    <FaStar className="star-icon" size={28} color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(null)} />
                                </label>
                            );
                        })}
                    </div>
                    <textarea className="comment-textarea" rows="3" placeholder="Viết đánh giá của bạn..." value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                    <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</button>
                </form>
            ) : (
                <div className="login-prompt"><p>Vui lòng <a href="/login" className="login-link">đăng nhập</a> để bình luận.</p></div>
            )}

            {/* --- DANH SÁCH BÌNH LUẬN --- */}
            <div className="comments-list">
                {reviews.map((review) => (
                    <div key={review.review_id} className="comment-item">
                        
                        {/* 1. HIỂN THỊ COMMENT CHA */}
                        <div className="comment-main">
                            <img src={getAvatarUrl(review.user)} alt="Avt" className="comment-avatar"/>
                            <div className="comment-body">
                                <div className="comment-meta">
                                    <span className="comment-author">{review.user?.full_name}</span>
                                    <span className="comment-date">{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                                {/* Chỉ hiện sao ở comment cha */}
                                <div className="comment-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} size={14} color={i < review.rating ? "#ffc107" : "#e4e5e9"} />
                                    ))}
                                </div>
                                <p className="comment-text">{review.content}</p>
                                
                                {/* Nút bấm để mở form trả lời */}
                                {token && (
                                    <button className="btn-reply" onClick={() => setActiveReplyId(activeReplyId === review.review_id ? null : review.review_id)}>
                                        Trả lời
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. FORM TRẢ LỜI (Chỉ hiện khi bấm nút Trả lời) */}
                        {activeReplyId === review.review_id && (
                            <div className="reply-form-container">
                                <form onSubmit={(e) => handleSubmit(e, review.review_id)}>
                                    <textarea 
                                        className="comment-textarea reply-textarea" 
                                        placeholder={`Trả lời ${review.user?.full_name}...`}
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value)}
                                        autoFocus
                                    ></textarea>
                                    <div style={{marginTop:'5px'}}>
                                        <button type="submit" className="btn-submit" style={{fontSize:'0.8rem', padding:'5px 15px'}}>Gửi trả lời</button>
                                        <button type="button" className="btn-cancel" onClick={() => setActiveReplyId(null)}>Hủy</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 3. HIỂN THỊ DANH SÁCH COMMENT CON (REPLIES) */}
                        {review.children && review.children.length > 0 && (
                            <div className="children-list">
                                {review.children.map(child => (
                                    <div key={child.review_id} className="child-item">
                                        <img src={getAvatarUrl(child.user)} alt="Child Avt" className="comment-avatar child-avatar"/>
                                        <div className="comment-body">
                                            <div className="comment-meta">
                                                <span className="comment-author">{child.user?.full_name}</span>
                                                <span className="comment-date">{new Date(child.created_at).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <p className="comment-text">{child.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                ))}
                
                {reviews.length === 0 && <p className="no-comments">Chưa có đánh giá nào.</p>}
            </div>
        </div>
    );
};

export default Comments;