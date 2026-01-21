import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; 

const ForumList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Gọi API lấy danh sách
        axiosClient.get('/forum')
            .then(res => setPosts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
    <div className="forum-container">
        <div className="forum-header">
            <h2 className="forum-title">Cộng đồng Yêu Bếp 🍳</h2>
            <Link to="/forum/create" className="btn-primary-custom">
                + Đặt câu hỏi
            </Link>
        </div>

        <div className="forum-list">
            {posts.map(post => (
                <Link to={`/forum/${post.id}`} key={post.id} className="forum-card">
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-desc">{post.content}</p>
                    <div className="card-meta">
                        <div className="meta-info">
                            <span>👤 {post.user?.name || 'Ẩn danh'}</span>
                            <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-stats">
                            <span>💬 {post.comments_count} thảo luận</span>
                            <span> • 👁️ {post.views} xem</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);
};

export default ForumList;