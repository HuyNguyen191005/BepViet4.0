import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LikeButton = ({ recipeId }) => {
    // State lưu trạng thái đã thích hay chưa
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- 1. MỚI THÊM: KIỂM TRA TRẠNG THÁI KHI VỪA VÀO TRANG ---
    useEffect(() => {
        const checkLikeStatus = async () => {
            const token = localStorage.getItem('ACCESS_TOKEN'); // Đảm bảo đúng key token
            if (!token) return;

            try {
                // Gọi API lấy danh sách yêu thích để kiểm tra xem món này có trong đó không
                // (Cách này an toàn nhất với cấu hình hiện tại của bạn)
                const res = await axios.get('http://localhost:8000/api/my-favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let favorites = [];
                // Xử lý dữ liệu trả về tùy theo backend (array hoặc object)
                if (Array.isArray(res.data)) {
                    favorites = res.data;
                } else if (res.data.data && Array.isArray(res.data.data)) {
                    favorites = res.data.data;
                } else if (res.data.favorites) {
                    favorites = res.data.favorites;
                }

                // Kiểm tra xem ID bài viết hiện tại có nằm trong danh sách đã lưu không
                // Dùng toString() để tránh lỗi so sánh số với chuỗi
                const isFound = favorites.some(item => 
                    (item.recipe_id || item.id).toString() === recipeId.toString()
                );

                if (isFound) {
                    setLiked(true); // Nếu tìm thấy -> Chuyển nút thành "Đã lưu"
                }

            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái like:", error);
            }
        };

        if (recipeId) {
            checkLikeStatus();
        }
    }, [recipeId]); // Chạy lại mỗi khi ID bài viết thay đổi


    // --- 2. HÀM XỬ LÝ KHI CLICK (GIỮ NGUYÊN LOGIC CŨ, SỬA UI) ---
    const handleLike = async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
            alert("Vui lòng đăng nhập để lưu món ăn!");
            return;
        }

        setLoading(true);
        try {
            // Gọi API Toggle (Lưu/Bỏ lưu)
            // Lưu ý: Backend cần hỗ trợ toggle. Nếu chỉ là API 'store', nó có thể báo lỗi trùng lặp.
            // Nếu API backend của bạn là toggle (click lần 1 lưu, lần 2 bỏ) thì code này đúng.
            await axios.post(`http://localhost:8000/api/recipes/${recipeId}/favorite`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Đảo ngược trạng thái hiện tại
            setLiked(!liked);
            
            // Thông báo nhỏ (Option)
            if (!liked) {
                // alert("Đã thêm vào bộ sưu tập!"); // Có thể bỏ nếu thấy phiền
            }

        } catch (error) {
            console.error("Lỗi thao tác like:", error);
            if (error.response && error.response.status === 401) {
                alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleLike} 
            disabled={loading}
            className={`btn-like ${liked ? 'active' : ''}`} // Thêm class active để style CSS nếu cần
            style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #ff6600',
                background: liked ? '#ff6600' : 'white', // Nếu đã lưu thì nền cam
                color: liked ? 'white' : '#ff6600',      // Nếu đã lưu thì chữ trắng
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.3s'
            }}
        >
            {/* Icon trái tim thay đổi theo trạng thái */}
            <span>{liked ? '❤️' : '♡'}</span> 
            
            {/* Chữ thay đổi theo trạng thái */}
            {loading ? 'Đang xử lý...' : (liked ? 'Đã lưu' : 'Lưu món')}
        </button>
    );
};

export default LikeButton;