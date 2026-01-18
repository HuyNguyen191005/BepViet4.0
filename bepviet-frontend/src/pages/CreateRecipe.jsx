import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Upload, Plus, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const CreateRecipe = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cooking_time: "",
    difficulty: "Trung bình",
    servings: "",
    status: "Published",
  });

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

  // --- LOAD DỮ LIỆU ---
  useEffect(() => {
    // 1. Load Categories
    axios.get('http://localhost:8000/api/categories')
        .then(res => setCategories(res.data))
        .catch(err => {
            // Fallback nếu API lỗi
            setCategories([
                { category_id: 1, name: "Món sáng" },
                { category_id: 2, name: "Món chính" },
            ]);
        });

    // 2. Load Ingredients (Giả lập hoặc gọi API nếu có)
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

  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        return prev.filter(id => id !== catId);
      } else {
        return [...prev, catId];
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

  // --- XỬ LÝ SUBMIT (QUAN TRỌNG) ---
  const handleSubmit = async (statusType) => {
    // 1. Validation
    if (!formData.title) return alert("Vui lòng nhập tên món!");
    if (selectedCategories.length === 0) return alert("Vui lòng chọn ít nhất 1 danh mục!");
    if (!formData.cooking_time) return alert("Chưa nhập thời gian nấu!");

    // 2. Lấy Token & User ID
    const token = localStorage.getItem('ACCESS_TOKEN');
    const userStr = localStorage.getItem('USER_INFO');
    
    if (!token || !userStr) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate('/login');
        return;
    }

    // Parse User Info để lấy ID
    const currentUser = JSON.parse(userStr);
    const userId = currentUser.id || currentUser.user_id || (currentUser.user && currentUser.user.id);

    if (!userId) {
        alert("Lỗi xác thực người dùng. Hãy đăng xuất và đăng nhập lại.");
        return;
    }

    // 3. Đóng gói FormData
    const data = new FormData();
    
    // --- KHẮC PHỤC LỖI USER_ID NULL ---
    data.append("user_id", userId); 
    // -----------------------------------

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("cooking_time", formData.cooking_time);
    data.append("difficulty", formData.difficulty);
    data.append("servings", formData.servings);
    data.append("status", statusType);

    // Categories (Gửi dạng mảng)
    if (selectedCategories.length > 0) {
        // Backend Laravel sẽ nhận category_ids dạng chuỗi "1,2,3" hoặc mảng tuỳ setup
        // Để an toàn nhất, gửi join string
        data.append("category_ids", selectedCategories.join(','));
    }

    // Main Image
    if (mainImage) {
      data.append("image", mainImage); 
    }

    // Ingredients (Gửi dạng JSON string cho gọn, Backend đã update để decode cái này)
    data.append("ingredients", JSON.stringify(ingredients));

    // Steps (Vẫn giữ loop vì có dính file ảnh, JSON string không chứa được file)
    steps.forEach((step, index) => {
      data.append(`steps[${index}][content]`, step.content);
      if (step.image_file) {
        data.append(`steps[${index}][image]`, step.image_file);
      }
    });

    // 4. Gọi API
    try {
      const response = await axios.post("http://localhost:8000/api/recipes", data, {
        headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        },
      });
      
      console.log("Response:", response.data);
      alert("🎉 Đăng công thức thành công!");
      navigate('/profile'); 

    } catch (error) {
      console.error("Lỗi submit:", error);
      const serverMsg = error.response?.data?.message || JSON.stringify(error.response?.data?.errors) || "Lỗi không xác định";
      alert("Lỗi: " + serverMsg);
    }
  };

  return (
    <div className="cr-container">
      <h1 className="cr-page-title">Đăng Công Thức Mới</h1>

      {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
      <div className="cr-section">
        <h2 className="cr-section-title"><span>ℹ️</span> THÔNG TIN CHUNG</h2>

        <div className="cr-form-group">
          <label className="cr-label">Tiêu đề món ăn <span className="cr-required">*</span></label>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="VD: Phở bò gia truyền..." className="cr-input" />
        </div>

        <div className="cr-form-group">
          <label className="cr-label">Mô tả ngắn</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả sự hấp dẫn..." className="cr-textarea" rows="3" />
        </div>

        {/* Categories */}
        <div className="cr-form-group">
            <label className="cr-label">Danh mục <span className="cr-required">*</span></label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <label key={cat.category_id || cat.id} 
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                            background: selectedCategories.includes(cat.category_id || cat.id) ? '#e0f2fe' : '#f3f4f6',
                            padding: '8px 12px', borderRadius: '20px',
                            border: selectedCategories.includes(cat.category_id || cat.id) ? '1px solid #0ea5e9' : '1px solid #e5e7eb',
                        }}
                    >
                        <input 
                            type="checkbox" 
                            checked={selectedCategories.includes(cat.category_id || cat.id)}
                            onChange={() => handleCategoryChange(cat.category_id || cat.id)}
                            style={{ display: 'none' }} // Ẩn checkbox mặc định cho đẹp
                        />
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>
                            {selectedCategories.includes(cat.category_id || cat.id) ? '✓ ' : ''}
                            {cat.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>

        {/* Main Image */}
        <div className="cr-form-group">
          <label className="cr-label">Ảnh đại diện</label>
          <div className="cr-upload-box" style={{position: 'relative', border: '2px dashed #ccc', padding: 20, textAlign: 'center', borderRadius: 8}}>
            <input type="file" onChange={handleMainImageChange} style={{opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer'}} />
            {previewImage ? (
              <img src={previewImage} alt="Preview" style={{maxHeight: 200, maxWidth: '100%', borderRadius: 8}} />
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
                <label className="cr-label">Thời gian nấu (phút)</label>
                <input name="cooking_time" type="number" onChange={handleChange} className="cr-input" />
            </div>
            <div>
                <label className="cr-label">Khẩu phần (người)</label>
                <input name="servings" type="number" onChange={handleChange} className="cr-input" />
            </div>
            <div>
                <label className="cr-label">Độ khó</label>
                <select name="difficulty" onChange={handleChange} className="cr-select">
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
        <h2 className="cr-section-title"><span>🥕</span> NGUYÊN LIỆU</h2>
        
        {ingredients.map((ing, index) => (
            <div key={index} className="cr-row" style={{display: 'flex', gap: 10, marginBottom: 10}}>
                <div style={{flex: 2}}>
                    <select className="cr-select" value={ing.ingredient_id} onChange={(e) => handleIngredientChange(index, 'ingredient_id', e.target.value)}>
                        <option value="">-- Chọn nguyên liệu --</option>
                        {availableIngredients.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{flex: 1}}>
                    <input type="number" className="cr-input" placeholder="SL" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                </div>
                <div style={{flex: 1}}>
                    <select className="cr-select" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}>
                        <option>Gram</option><option>Kg</option><option>Muỗng</option><option>Trái</option><option>ml</option><option>Lít</option>
                    </select>
                </div>
                <button onClick={() => removeIngredientRow(index)} style={{background: 'none', border: 'none', color: 'red', cursor: 'pointer'}}>
                    <Trash2 size={18} />
                </button>
            </div>
        ))}

        <button onClick={addIngredientRow} className="cr-btn-add" style={{marginTop: 10}}>
            <Plus size={16} /> Thêm nguyên liệu
        </button>
      </div>

      <div style={{height: '30px'}}></div>

      {/* --- PHẦN 3: CÁCH LÀM --- */}
      <div className="cr-section">
        <h2 className="cr-section-title"><span>📝</span> CÁCH LÀM (STEPS)</h2>

        {steps.map((step, index) => (
            <div key={index} className="cr-step-item" style={{background: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 15}}>
                <div style={{fontWeight: 'bold', marginBottom: 5}}>BƯỚC {index + 1}</div>
                <textarea 
                    className="cr-textarea"
                    placeholder={`Mô tả chi tiết bước ${index + 1}...`}
                    rows="2"
                    value={step.content}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                ></textarea>
                
                <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 10}}>
                    <label style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#0ea5e9'}}>
                        <Camera size={18} /> Thêm ảnh
                        <input type="file" style={{display:'none'}} onChange={(e) => handleStepImageChange(index, e)} />
                    </label>
                    {step.image_preview && (
                        <img src={step.image_preview} alt="Step" style={{height: 50, borderRadius: 4}} />
                    )}
                </div>
            </div>
        ))}

        <button onClick={addStepRow} className="cr-btn-add">
            <Plus size={16} /> Thêm bước làm
        </button>
      </div>

      {/* --- FOOTER --- */}
      <div className="cr-footer" style={{marginTop: 30, display: 'flex', justifyContent: 'flex-end', gap: 10}}>
        <button onClick={() => handleSubmit('Draft')} className="cr-btn-draft" style={{padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: 4}}>LƯU NHÁP</button>
        <button onClick={() => handleSubmit('Published')} className="cr-btn-publish" style={{padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold'}}>ĐĂNG CÔNG THỨC ✓</button>
      </div>
    </div>
  );
};

export default CreateRecipe;