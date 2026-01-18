import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();

    // State lưu dữ liệu form
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); 
    const [type, setType] = useState('Blog');
    const [thumbnail, setThumbnail] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [loading, setLoading] = useState(false);

    // --- 2. BẢO VỆ TRANG (CHECK LOGIN) ---
    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
            alert("Vui lòng đăng nhập để viết bài!");
            navigate('/login');
        }
    }, []);

    // Cấu hình Toolbar cho Editor
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    // Xử lý khi chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    // Xử lý nút Đăng bài
    const handleSubmit = async () => {
        if (!title || !content) {
            alert("Vui lòng nhập tiêu đề và nội dung!");
            return;
        }

        // Lấy token để gửi kèm request
        const token = localStorage.getItem('ACCESS_TOKEN');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('type', type);
        
        // --- LƯU Ý QUAN TRỌNG VỀ USER_ID ---
        // Mình đã xóa dòng: formData.append('user_id', 1);
        // Vì khi gửi Token, Backend (Laravel) sẽ tự biết user là ai thông qua Auth::id()
        // Nếu Backend của bạn vẫn bắt buộc phải có user_id, hãy bảo mình để mình thêm lại nhé.

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        setLoading(true);
        try {
            // Gửi lên API Laravel
            await axios.post('http://localhost:8000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // --- 3. QUAN TRỌNG: Gửi kèm Token xác thực ---
                    'Authorization': `Bearer ${token}` 
                }
            });
            alert("Đăng bài thành công!");
            navigate('/blog'); // Chuyển về trang Blog thay vì trang chủ để thấy bài vừa đăng
        } catch (error) {
            console.error("Lỗi đăng bài:", error);
            if(error.response && error.response.status === 401) {
                alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                navigate('/login');
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-wrapper">
            
            {/* Header: Nút Quay lại & Tiêu đề trang */}
            <div className="cp-top-bar">
                <button onClick={() => navigate(-1)} style={{border:'none', background:'transparent', cursor:'pointer', fontSize:'16px'}}>
                    ← Quay lại
                </button>
                <div className="cp-page-title">VIẾT BÀI CHIA SẺ MỚI</div>
                <div style={{width:'80px'}}></div> 
            </div>

            <div className="cp-grid-layout">
                
                {/* CỘT TRÁI: SOẠN THẢO */}
                <div className="cp-editor-column">
                    {/* Nhập tiêu đề lớn */}
                    <input 
                        type="text" 
                        className="cp-input-title" 
                        placeholder="Tiêu đề bài viết..." 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    
                    {/* Bộ soạn thảo Rich Text */}
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent} 
                        modules={modules}
                        placeholder="Viết nội dung chia sẻ của bạn tại đây..."
                    />
                </div>

                {/* CỘT PHẢI: CÀI ĐẶT */}
                <div className="cp-settings-column">
                    
                    {/* Upload Ảnh đại diện */}
                    <label className="setting-label">Ảnh đại diện (Thumbnail)</label>
                    <div className="upload-box" onClick={() => document.getElementById('thumbInput').click()}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="upload-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <div style={{fontSize:'30px', marginBottom:'10px'}}>📷</div>
                                <span>Nhấn để tải ảnh bìa</span>
                            </div>
                        )}
                        <input 
                            id="thumbInput" 
                            type="file" 
                            hidden 
                            onChange={handleImageChange} 
                            accept="image/*"
                        />
                    </div>

                    {/* Chọn Chuyên mục */}
                    <label className="setting-label">Chuyên mục</label>
                    <select 
                        className="cp-select" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="Blog">Blog tâm sự</option>
                        <option value="Mẹo vặt">Mẹo vặt nhà bếp</option>
                        <option value="Review">Review quán ăn</option>
                        <option value="Công thức">Công thức nấu ăn</option>
                    </select>

                    {/* Nút Hành động */}
                    <button className="btn-publish" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'ĐĂNG BÀI VIẾT (PUBLISH)'}
                    </button>
                    
                    <button className="btn-preview">
                        XEM TRƯỚC (PREVIEW)
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CreatePost;