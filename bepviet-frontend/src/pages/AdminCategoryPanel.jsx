import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Edit, Trash2, Folder, X, Upload, Image as ImageIcon } from 'lucide-react';
import '../Admin.css';

const AdminCategoryPanel = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', image: null });

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleOpenModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            setFormData({ name: category.name, description: category.description || '', image: null });
            setPreviewImage(category.image_url);
        } else {
            setFormData({ name: '', description: '', image: null });
            setPreviewImage(null);
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file)); // Hiện ảnh xem trước ngay lập tức
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingCategory) {
                // Laravel đôi khi yêu cầu _method: PUT khi gửi FormData qua POST
                data.append('_method', 'PUT');
                await axiosClient.post(`/admin/categories/${editingCategory.category_id}`, data);
            } else {
                await axiosClient.post('/admin/categories', data);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) { alert("Lỗi khi lưu: " + (error.response?.data?.message || "Hệ thống lỗi")); }
    };

    return (
        <div className="admin-page-container category-management-page">
            <div className="admin-header-master">
                <h2>Quản lý Danh mục & Nguyên liệu (Master Data)</h2>
                <p>Thêm sửa xóa danh mục công thức hoặc chuẩn hóa dữ liệu hệ thống.</p>
            </div>

            <div className="admin-card">
                <div className="card-header-flex">
                    <div className="title-with-icon">
                        <Folder className="icon-teal" size={24} />
                        <h3>Danh sách danh mục</h3>
                    </div>
                    <button className="btn-add-large" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Thêm doanh mục mới (Nút to)
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th width="80">ID</th>
                            <th>TÊN DANH MỤC</th>
                            <th width="150">SỐ LƯỢNG MÓN</th>
                            <th width="120">TÁC VỤ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat.category_id}>
                                <td className="text-center">{String(index + 1).padStart(2, '0')}</td>
                                <td>
                                    <div className="cat-info-cell">
                                        <div className="cat-img-box">
                                            {cat.image_url ? (
                                                <img src={cat.image_url} alt="" />
                                            ) : (
                                                <ImageIcon size={20} color="#fff" />
                                            )}
                                        </div>
                                        <span className="cat-name-text">{cat.name}</span>
                                    </div>
                                </td>
                                <td><span className="badge-count">{cat.recipes_count || 0}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="btn-edit-small" onClick={() => handleOpenModal(cat)}><Edit size={14} /></button>
                                        <button className="btn-delete-small"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Prompt thiết kế mới */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-pop">
                        <div className="modal-header">
                            <h3>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</h3>
                            <button className="close-x" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="modal-form">
                            <div className="upload-section">
                                <label className="image-upload-label">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="img-preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Upload size={30} />
                                            <span>Tải ảnh icon</span>
                                        </div>
                                    )}
                                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>

                            <div className="form-group-custom">
                                <label>Tên danh mục:</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    placeholder="Ví dụ: Món Khai Vị..."
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required 
                                />
                            </div>

                            <div className="form-group-custom">
                                <label>Mô tả ngắn:</label>
                                <textarea 
                                    rows="3"
                                    value={formData.description} 
                                    placeholder="Mô tả về nhóm món ăn này..."
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="modal-footer-btns">
                                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>[Hủy]</button>
                                <button type="submit" className="btn-modal-save">[Lưu thay đổi]</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryPanel;