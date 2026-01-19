import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axiosClient from "../api/axiosClient";
import { Upload, ArrowLeft } from "lucide-react";

const EditRecipe = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  
  // Trạng thái loading
  const [isFetching, setIsFetching] = useState(true); // Đang tải dữ liệu cũ
  const [isSaving, setIsSaving] = useState(false);    // Đang lưu dữ liệu mới

  // State Form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cooking_time: "",
    difficulty: "Trung bình",
    servings: "",
  });

  const [mainImage, setMainImage] = useState(null); // File ảnh mới nếu user chọn
  const [previewImage, setPreviewImage] = useState(null); // URL ảnh để hiển thị (cũ hoặc mới)

  // 1. LẤY DỮ LIỆU CŨ TỪ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get(`/recipes/${id}`);
        
        // Đổ dữ liệu vào form
        setFormData({
            title: data.title,
            description: data.description || "",
            cooking_time: data.cooking_time,
            difficulty: data.difficulty,
            servings: data.servings
        });

        // Xử lý ảnh
        if (data.image_url) {
            const imgUrl = data.image_url.startsWith('http') 
                ? data.image_url 
                : `http://localhost:8000/storage/${data.image_url}`;
            setPreviewImage(imgUrl);
        }

        setIsFetching(false); // Tắt loading
      } catch (error) {
        console.error(error);
        alert("Không tìm thấy bài viết hoặc lỗi server!");
        navigate('/user/profile');
      }
    };
    fetchData();
  }, [id, navigate]);

  // 2. XỬ LÝ KHI NHẬP INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. XỬ LÝ CHỌN ẢNH MỚI
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Xem trước ảnh mới
    }
  };

  // 4. XỬ LÝ LƯU (SUBMIT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("cooking_time", formData.cooking_time);
    data.append("difficulty", formData.difficulty);
    data.append("servings", formData.servings);
    
    // Nếu có ảnh mới thì gửi, không thì thôi
    if (mainImage) {
        data.append("image", mainImage);
    }

    try {
      // Dùng POST để update (Laravel xử lý file tốt hơn với POST)
      await axiosClient.post(`/recipes/${id}/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Cập nhật thành công!");
      navigate('/user/profile');
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật: " + (error.response?.data?.message || "Lỗi server"));
    } finally {
      setIsSaving(false);
    }
  };

  // QUAN TRỌNG: Nếu đang tải dữ liệu cũ thì hiện Loading (tránh màn hình trắng do render null)
  if (isFetching) {
      return <div style={{padding: '50px', textAlign: 'center'}}>Đang tải thông tin bài viết...</div>;
  }

  return (
    <div className="cr-container">
      <button onClick={() => navigate(-1)} style={{marginBottom:'20px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}>
        <ArrowLeft size={20}/> Quay lại
      </button>

      <h1 className="cr-page-title">Chỉnh sửa bài viết</h1>
      
      <form onSubmit={handleSubmit} className="cr-form">
        {/* Hàng 1: Tên món + Ảnh */}
        <div className="cr-top-section">
          <div className="cr-main-info">
            <div className="form-group">
              <label>Tên món ăn</label>
              <input
                type="text"
                name="title"
                className="cr-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả ngắn</label>
              <textarea
                name="description"
                className="cr-textarea"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Upload ảnh */}
          <div className="cr-image-upload">
            <label className="image-upload-box">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="uploaded-image" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={40} />
                  <span>Tải ảnh lên</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="cr-details-grid">
          <div className="form-group">
            <label>Thời gian nấu (phút)</label>
            <input type="number" name="cooking_time" className="cr-input" value={formData.cooking_time} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Khẩu phần (người)</label>
            <input type="number" name="servings" className="cr-input" value={formData.servings} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Độ khó</label>
            <select name="difficulty" className="cr-input" value={formData.difficulty} onChange={handleChange}>
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khó">Khó</option>
            </select>
          </div>
        </div>

        {/* Nút Submit */}
        <div className="cr-footer">
            <button type="submit" className="cr-btn-publish" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;