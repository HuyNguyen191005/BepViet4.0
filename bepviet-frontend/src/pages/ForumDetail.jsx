import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ForumDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [post, setPost] = useState(null);
    const [reply, setReply] = useState('');

    // Lấy chi tiết bài viết
    useEffect(() => {
        axiosClient.get(`/forum/${id}`)
            .then(res => setPost(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // Xử lý gửi bình luận
    const handleReply = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post(`/forum/${id}/comment`, { content: reply });
            // Cập nhật giao diện ngay lập tức
            setPost({ ...post, comments: [...post.comments, res.data] });
            setReply(''); // Xóa ô nhập
        } catch (error) {
            alert('Vui lòng đăng nhập để trả lời!');
        }
    };

    if (!post) return <div>Đang tải...</div>;

    return (
    <div className="forum-container">
        {/* Nội dung bài viết */}
        <div className="post-detail-card">
            <h1 className="forum-title" style={{fontSize: '24px'}}>{post.title}</h1>
            <div className="post-meta-header">
                {/* Copy đoạn này đè vào chỗ hiển thị avatar cũ */}
                <div className="author-avatar">
    {post.user?.avatar ? (
<img 
    src={post.user.avatar.startsWith('http') 
        ? post.user.avatar 
        : `http://127.0.0.1:8000/storage/${post.user.avatar}`} 
    // Lưu ý: Nếu DB bạn lưu 'ten-anh.jpg' nhưng ảnh thật nằm trong folder 'avatars'
    // thì dòng trên phải sửa thành: .../storage/avatars/${post.user.avatar}
    
    alt="Avatar"
    className="w-full h-full object-cover" // Class của Tailwind hoặc dùng CSS bạn đã viết
    onError={(e) => {
        e.target.onerror = null; 
        e.target.src = "https://ui-avatars.com/api/?name=" + post.user.name; // Ảnh thay thế online nếu lỗi
    }}
/>
    ) : (
        // Nếu không có ảnh thì hiện chữ cái đầu
        <span>{post.user?.name ? post.user.name.charAt(0).toUpperCase() : '?'}</span>
    )}
</div>
                <div>
                    <strong>{post.user?.name}</strong><br/>
                    <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
            </div>
            <hr style={{borderColor: '#eee', margin: '20px 0'}}/>
            <div className="post-content-body">
                {post.content}
            </div>
        </div>

        {/* Khu vực bình luận */}
        <div className="comments-section">
            <h3 style={{marginBottom: '20px'}}>Thảo luận ({post.comments?.length})</h3>
            
            <div className="comment-list">
                {post.comments?.map(cmt => (
                    <div key={cmt.id} className="comment-item">
                        <div className="comment-author">{cmt.user?.name}</div>
                        <p className="comment-text">{cmt.content}</p>
                    </div>
                ))}
            </div>

            {/* Form trả lời */}
            <div className="reply-form" style={{marginTop: '30px'}}>
                <form onSubmit={handleReply}>
                    <textarea 
                        placeholder="Chia sẻ ý kiến hoặc câu trả lời của bạn..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="btn-primary-custom">
                        Gửi bình luận
                    </button>
                </form>
            </div>
        </div>
    </div>
);
};

export default ForumDetail;