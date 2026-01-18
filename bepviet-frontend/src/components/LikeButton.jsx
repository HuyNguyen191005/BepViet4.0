import React, { useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Icon tim

const LikeButton = ({ recipeId }) => {
    // Tạm thời để mặc định là false (chưa thích). 
    // Sau này bạn cần check từ API xem user đã thích chưa để set true/false
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggleLike = async () => {
        const token = localStorage.getItem('token'); // Giả sử bạn lưu token ở đây khi đăng nhập
        
        if (!token) {
            alert("Bạn cần đăng nhập để lưu món ăn!");
            return;
        }

        if (loading) return; // Chặn click liên tục
        setLoading(true);

        try {
            // Gọi API Laravel (Đảm bảo bạn đã làm Route và Controller ở Backend như hướng dẫn trước)
            const res = await axios.post(
                `http://localhost:8000/api/recipes/${recipeId}/favorite`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Nếu server trả về "added" -> Đổi sang tim đỏ
            // Nếu server trả về "removed" -> Đổi sang tim rỗng
            if (res.data.status === 'added') {
                setLiked(true);
            } else {
                setLiked(false);
            }
        } catch (error) {
            console.error("Lỗi khi like:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleToggleLike} 
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '20px',
                backgroundColor: liked ? '#fff1f0' : '#f0f0f0', // Nền đổi màu nhẹ
                transition: '0.3s'
            }}
        >
            {/* Nếu liked = true thì hiện tim đỏ, ngược lại tim rỗng */}
            {liked ? <FaHeart color="#ff4d4f" size={20} /> : <FaRegHeart color="#666" size={20} />}
            
            <span style={{ fontSize: '14px', fontWeight: '600', color: liked ? '#ff4d4f' : '#666' }}>
                {liked ? 'Đã thích' : 'Lưu món'}
            </span>
        </button>
    );
};

export default LikeButton;