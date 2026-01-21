import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const CreateForum = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/forum', { title, content });
            alert('Đăng câu hỏi thành công!');
            navigate('/forum'); // Quay về trang danh sách
        } catch (error) {
            alert('Lỗi: ' + error.response.data.message);
        }
    };

    return (
    <div className="forum-container">
        <div className="post-detail-card"> {/* Tận dụng card của trang detail cho đẹp */}
            <h2 className="forum-title">Đặt câu hỏi mới</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>Hãy chia sẻ thắc mắc hoặc kinh nghiệm nấu nướng của bạn</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Tiêu đề câu hỏi</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ví dụ: Cách làm sườn xào chua ngọt không bị khô?"
                        value={title} onChange={e => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Nội dung chi tiết</label>
                    <textarea 
                        className="form-input" 
                        rows="8" 
                        placeholder="Mô tả chi tiết vấn đề của bạn..."
                        value={content} onChange={e => setContent(e.target.value)} 
                        required 
                    ></textarea>
                </div>
                <button type="submit" className="btn-primary-custom" style={{width: '100%'}}>
                    Đăng bài ngay
                </button>
            </form>
        </div>
    </div>
);
};

export default CreateForum;