import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Upload, Plus, Camera } from "lucide-react";

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cooking_time: "",
    difficulty: "Trung bình",
    servings: "",
    status: "Published",
  });

  // --- 1. THÊM STATE CHO DANH MỤC ---
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [ingredients, setIngredients] = useState([
    { ingredient_id: "", quantity: "", unit: "Gram" }
  ]);
  
  const [availableIngredients, setAvailableIngredients] = useState([]);

  const [steps, setSteps] = useState([
    { content: "", image_file: null, image_preview: null }
  ]);

  useEffect(() => {
    // --- 2. THÊM DỮ LIỆU GIẢ LẬP CHO DANH MỤC ---
    setCategories([
      { id: 1, name: "Món sáng" },
      { id: 2, name: "Món chính" },
      { id: 3, name: "Ăn vặt" },
      { id: 4, name: "Đồ uống" },
      { id: 5, name: "Bánh ngọt" },
      { id: 6, name: "Healthy/Diet" },
    ]);

    // Giả lập nguyên liệu
    setAvailableIngredients([
      { id: 1, name: "Thịt bò" },
      { id: 2, name: "Thịt gà" },
      { id: 3, name: "Trứng gà" },
      { id: 4, name: "Cà chua" },
      { id: 5, name: "Hành tây" },
      { id: 6, name: "Bánh phở" },
    ]);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- 3. HÀM XỬ LÝ CHỌN DANH MỤC (CHECKBOX) ---
  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        return prev.filter(id => id !== catId); // Bỏ chọn
      } else {
        return [...prev, catId]; // Chọn thêm
      }
    });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { ingredient_id: "", quantity: "", unit: "Gram" }]);
  };

  const removeIngredientRow = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].content = value;
    setSteps(newSteps);
  };

  const handleStepImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newSteps = [...steps];
      newSteps[index].image_file = file;
      newSteps[index].image_preview = URL.createObjectURL(file);
      setSteps(newSteps);
    }
  };

  const addStepRow = () => {
    setSteps([...steps, { content: "", image_file: null, image_preview: null }]);
  };

  const handleSubmit = async (statusType) => {
    // --- 4. KIỂM TRA ĐÃ CHỌN DANH MỤC CHƯA ---
    if (selectedCategories.length === 0) {
        alert("Vui lòng chọn ít nhất 1 danh mục cho món ăn!");
        return;
    }
// Kiểm tra thời gian nấu
    if (!formData.cooking_time) {
        alert("Bạn quên nhập Thời gian nấu rồi!");
        return;
    }
    // ---Kiểm tra ảnh đại diện ---
    if (!mainImage) {
        alert("Vui lòng chọn Ảnh đại diện cho món ăn!");
        return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("cooking_time", formData.cooking_time);
    data.append("difficulty", formData.difficulty);
    data.append("servings", formData.servings);
    data.append("status", statusType);
    
    // Hardcode user_id để test:
    data.append("user_id", 1); 

    // --- 5. GỬI DANH SÁCH DANH MỤC LÊN SERVER ---
    // Laravel yêu cầu dạng category_ids[] để nhận diện là mảng
    selectedCategories.forEach(catId => {
        data.append("category_ids[]", catId);
    });

    if (mainImage) {
      data.append("image", mainImage); 
    }

    ingredients.forEach((ing, index) => {
      // Chỉ gửi nguyên liệu nếu đã chọn tên
      if (ing.ingredient_id) {
          data.append(`ingredients[${index}][ingredient_id]`, ing.ingredient_id);
          data.append(`ingredients[${index}][quantity]`, ing.quantity);
          data.append(`ingredients[${index}][unit]`, ing.unit);
      }
    });

    steps.forEach((step, index) => {
      data.append(`steps[${index}][content]`, step.content);
      if (step.image_file) {
        data.append(`steps[${index}][image]`, step.image_file);
      }
    });

    try {
      await axios.post("http://localhost:8000/api/recipes", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thành công! Món ăn đã được tạo.");
      // Có thể thêm navigate('/') để về trang chủ
    } catch (error) {
      console.error(error);
      // Hiển thị lỗi chi tiết từ Laravel nếu có
      const serverError = error.response?.data?.message || error.message;
      alert("Lỗi: " + serverError);
    }
  };

  return (
    <div className="cr-container">
      <h1 className="cr-page-title">Đăng Công Thức Mới</h1>

      {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
      <div className="cr-section">
        <h2 className="cr-section-title">
          <span>ℹ️</span> THÔNG TIN CHUNG
        </h2>

        <div className="cr-form-group">
          <label className="cr-label">Tiêu đề món ăn <span className="cr-required">*</span></label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="VD: Phở bò gia truyền..."
            className="cr-input"
          />
        </div>

        <div className="cr-form-group">
          <label className="cr-label">Mô tả ngắn</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả sự hấp dẫn của món ăn..."
            className="cr-textarea"
            rows="3"
          />
        </div>

        {/* --- 6. GIAO DIỆN CHỌN DANH MỤC --- */}
        <div className="cr-form-group">
            <label className="cr-label">Danh mục món ăn <span className="cr-required">*</span></label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <label 
                        key={cat.id} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            cursor: 'pointer',
                            background: selectedCategories.includes(cat.id) ? '#e0f2fe' : '#f3f4f6',
                            padding: '8px 12px',
                            borderRadius: '20px',
                            border: selectedCategories.includes(cat.id) ? '1px solid #0ea5e9' : '1px solid #e5e7eb',
                            transition: 'all 0.2s'
                        }}
                    >
                        <input 
                            type="checkbox" 
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryChange(cat.id)}
                            style={{ accentColor: '#0ea5e9' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{cat.name}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="cr-form-group">
          <label className="cr-label">Ảnh đại diện</label>
          <div className="cr-upload-box">
            <input type="file" onChange={handleMainImageChange} style={{opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer'}} />
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="cr-upload-preview" />
            ) : (
              <div className="text-gray-500">
                <Upload size={32} style={{margin: '0 auto', marginBottom: '10px'}} />
                <p>Nhấn để chọn ảnh bìa</p>
              </div>
            )}
          </div>
        </div>

        <div className="cr-grid-3">
            <div>
                <div className="cr-info-label">Thời gian nấu</div>
                <div className="cr-input-group">
                    <input name="cooking_time" type="number" onChange={handleChange} placeholder="30" />
                    <span className="cr-unit">phút</span>
                </div>
            </div>
            <div>
                <div className="cr-info-label">Khẩu phần</div>
                <div className="cr-input-group">
                    <input name="servings" type="number" onChange={handleChange} placeholder="4" />
                    <span className="cr-unit">người</span>
                </div>
            </div>
            <div>
                <div className="cr-info-label">Độ khó</div>
                <select name="difficulty" onChange={handleChange} className="cr-select" style={{borderRadius: '0 0 6px 6px', borderTop: 'none'}}>
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                </select>
            </div>
        </div>
      </div>

      <div style={{height: '30px'}}></div>

      {/* --- PHẦN 2: NGUYÊN LIỆU --- */}
      <div className="cr-section">
        <h2 className="cr-section-title">
          <span>🥕</span> NGUYÊN LIỆU
        </h2>
        
        <div>
            <div className="cr-table-header">
                <div className="cr-col-1">Tên nguyên liệu</div>
                <div className="cr-col-2">Số lượng</div>
                <div className="cr-col-3">Đơn vị</div>
                <div className="cr-col-4"></div>
            </div>

            {ingredients.map((ing, index) => (
                <div key={index} className="cr-row">
                    <div className="cr-col-1">
                        <select 
                            className="cr-select"
                            value={ing.ingredient_id}
                            onChange={(e) => handleIngredientChange(index, 'ingredient_id', e.target.value)}
                        >
                            <option value="">-- Chọn --</option>
                            {availableIngredients.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="cr-col-2">
                        <input 
                            type="number" 
                            className="cr-input"
                            value={ing.quantity}
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        />
                    </div>
                    <div className="cr-col-3">
                          <select 
                            className="cr-select"
                            value={ing.unit}
                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        >
                            <option>Gram</option>
                            <option>Kg</option>
                            <option>Muỗng</option>
                            <option>Trái</option>
                            <option>ml</option>
                            <option>Lít</option>
                        </select>
                    </div>
                    <div className="cr-col-4">
                        <button className="cr-btn-del" onClick={() => removeIngredientRow(index)}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <button onClick={addIngredientRow} className="cr-btn-add">
            <Plus size={18} style={{marginRight: '8px'}} /> THÊM NGUYÊN LIỆU
        </button>
      </div>

      <div style={{height: '30px'}}></div>

      {/* --- PHẦN 3: CÁCH LÀM --- */}
      <div className="cr-section">
        <h2 className="cr-section-title">
          <span>📝</span> CÁCH LÀM (STEPS)
        </h2>

        {steps.map((step, index) => (
            <div key={index} className="cr-step-item">
                <div className="cr-step-title">BƯỚC {index + 1}</div>
                <textarea 
                    className="cr-textarea"
                    placeholder={`Mô tả chi tiết bước ${index + 1}...`}
                    rows="3"
                    value={step.content}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                ></textarea>
                
                <div className="cr-step-upload">
                    <label className="cr-upload-btn-text">
                        <Camera size={18} style={{marginRight: '6px'}} />
                        Thêm ảnh
                        <input type="file" style={{display:'none'}} onChange={(e) => handleStepImageChange(index, e)} />
                    </label>
                    {step.image_preview && (
                        <img src={step.image_preview} alt="Step" className="cr-step-img-preview" />
                    )}
                </div>
            </div>
        ))}

        <button onClick={addStepRow} className="cr-btn-add">
            <Plus size={18} style={{marginRight: '8px'}} /> THÊM BƯỚC LÀM
        </button>
      </div>

      {/* --- FOOTER --- */}
      <div className="cr-footer">
        <button onClick={() => handleSubmit('Draft')} className="cr-btn-draft">
            LƯU NHÁP
        </button>
        <button onClick={() => handleSubmit('Published')} className="cr-btn-publish">
            ĐĂNG CÔNG THỨC ✓
        </button>
      </div>
    </div>
  );
};

export default CreateRecipe;