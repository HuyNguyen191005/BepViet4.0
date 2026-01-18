import React, { useState, useEffect } from 'react';
import axios from 'axios';


const BlogComments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    
    // State cho form chính (bình luận cấp 1)
    const [newComment, setNewComment] = useState('');
    
    // State cho form trả lời (reply)
    const [replyComment, setReplyComment] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null); // Lưu ID của comment đang được trả lời

    const [loading, setLoading] = useState(false);
    
    // Lấy token trực tiếp từ localStorage như mẫu bạn gửi
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

    // Lấy danh sách bình luận
    const fetchComments = async () => {
        try {
            // Sửa API: endpoint lấy comment của bài viết
            const res = await axios.get(`http://localhost:8000/api/posts/${postId}/comments`);
            setComments(res.data);
        } catch (error) {
            console.error("Lỗi tải bình luận:", error);
        }
    };

    useEffect(() => {
        if (postId) fetchComments();
    }, [postId]);

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
                post_id: postId,      // Dùng post_id thay vì recipe_id
                content: contentToSend,
                parent_id: parentId   // Nếu là comment cha thì null, con thì là id cha
            };

            // Sửa API: endpoint gửi comment
            await axios.post('http://localhost:8000/api/comments', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset form
            if (parentId) {
                setReplyComment('');
                setActiveReplyId(null);
            } else {
                setNewComment('');
            }
            
            // Load lại danh sách để hiện comment mới
            fetchComments(); 

        } catch (error) {
            console.error(error);
            alert("Lỗi khi gửi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments-wrapper blog-comments-section">
            <h3 className="comments-header">Bình luận ({comments.length})</h3>

            {/* --- FORM BÌNH LUẬN CHÍNH (LEVEL 0) --- */}
            {token ? (
                <form onSubmit={(e) => handleSubmit(e, null)} className="comment-form">
                    {/* Đã bỏ phần chọn Ngôi sao ở đây */}
                    
                    <textarea 
                        className="comment-textarea" 
                        rows="3" 
                        placeholder="Viết bình luận của bạn..." 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>Vui lòng <a href="/login" className="login-link">đăng nhập</a> để bình luận.</p>
                </div>
            )}

            {/* --- DANH SÁCH BÌNH LUẬN --- */}
            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.comment_id || comment.id} className="comment-item">
                        
                        {/* 1. HIỂN THỊ COMMENT CHA */}
                        <div className="comment-main">
                            <img src={getAvatarUrl(comment.user)} alt="Avt" className="comment-avatar"/>
                            <div className="comment-body">
                                <div className="comment-meta">
                                    <span className="comment-author">{comment.user?.full_name || "Người dùng"}</span>
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                
                                {/* Đã bỏ phần hiển thị Ngôi sao ở đây */}

                                <p className="comment-text">{comment.content}</p>
                                
                                {/* Nút bấm để mở form trả lời */}
                                {token && (
                                    <button 
                                        className="btn-reply" 
                                        onClick={() => setActiveReplyId(activeReplyId === comment.comment_id ? null : comment.comment_id)}
                                    >
                                        Trả lời
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. FORM TRẢ LỜI (Chỉ hiện khi bấm nút Trả lời) */}
                        {activeReplyId === comment.comment_id && (
                            <div className="reply-form-container">
                                <form onSubmit={(e) => handleSubmit(e, comment.comment_id)}>
                                    <textarea 
                                        className="comment-textarea reply-textarea" 
                                        placeholder={`Trả lời ${comment.user?.full_name}...`}
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value)}
                                        autoFocus
                                    ></textarea>
                                    <div style={{marginTop:'5px'}}>
                                        <button type="submit" className="btn-submit" style={{fontSize:'0.8rem', padding:'5px 15px'}}>
                                            Gửi trả lời
                                        </button>
                                        <button type="button" className="btn-cancel" onClick={() => setActiveReplyId(null)}>
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 3. HIỂN THỊ DANH SÁCH COMMENT CON (REPLIES) */}
                        {comment.children && comment.children.length > 0 && (
                            <div className="children-list">
                                {comment.children.map(child => (
                                    <div key={child.comment_id || child.id} className="child-item">
                                        <img src={getAvatarUrl(child.user)} alt="Child Avt" className="comment-avatar child-avatar"/>
                                        <div className="comment-body">
                                            <div className="comment-meta">
                                                <span className="comment-author">{child.user?.full_name}</span>
                                                <span className="comment-date">
                                                    {new Date(child.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            <p className="comment-text">{child.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                ))}
                
                {comments.length === 0 && <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</p>}
            </div>
        </div>
    );
};

export default BlogComments;