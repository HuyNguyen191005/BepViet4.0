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

    // 1. LẤY DỮ LIỆU TỪ BACKEND
    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Gọi API lấy danh sách danh mục (đã có kèm recipes_count từ Controller)
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Không thể tải danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    // 2. XỬ LÝ XÓA DANH MỤC
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await axiosClient.delete(`/admin/categories/${id}`);
                alert("Đã xóa danh mục thành công!");
                fetchCategories(); // Tải lại danh sách sau khi xóa
            } catch (error) {
                alert(error.response?.data?.message || "Lỗi khi xóa danh mục.");
            }
        }
    };

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
            setPreviewImage(URL.createObjectURL(file));
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
                data.append('_method', 'PUT'); // Laravel yêu cầu khi gửi FormData qua POST
                await axiosClient.post(`/admin/categories/${editingCategory.category_id}`, data);
            } else {
                await axiosClient.post('/admin/categories', data);
            }
            setIsModalOpen(false);
            fetchCategories();
            alert("Lưu thông tin thành công!");
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || "Hệ thống trục trặc."));
        }
    };

    return (
        <div className="admin-page-container category-management-page">
            <div className="admin-header-master">
                <h2>Quản lý Danh mục & Nguyên liệu (Master Data)</h2>
                <p>Quản lý toàn bộ cấu trúc phân loại món ăn của hệ thống.</p>
            </div>

            <div className="admin-card">
                <div className="card-header-flex">
                    <div className="title-with-icon">
                        <Folder className="icon-teal" size={24} />
                        <h3>Danh sách danh mục</h3>
                    </div>
                    <button className="btn-add-large" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Thêm danh mục mới
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th width="80">ID</th>
                            <th>TÊN DANH MỤC</th>
                            <th width="150" className="text-center">SỐ LƯỢNG MÓN</th>
                            <th width="120" className="text-center">TÁC VỤ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center">Đang tải dữ liệu...</td></tr>
                        ) : (
                            categories.map((cat, index) => (
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
                                    {/* HIỂN THỊ recipes_count TỪ BACKEND */}
                                    <td className="text-center">
                                        <span className="badge-count">{cat.recipes_count || 0} món</span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="btn-edit-small" onClick={() => handleOpenModal(cat)}><Edit size={14} /></button>
                                            <button className="btn-delete-small" onClick={() => handleDelete(cat.category_id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Prompt - Đây là nơi các ô điền thông tin xuất hiện */}
{isModalOpen && (
    <div className="modal-overlay">
        <div className="modal-content animate-pop">
            <div className="modal-header">
                <h3>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</h3>
                <button className="close-x" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSave} className="modal-form">
                {/* Phần chọn ảnh */}
                <div className="upload-section">
                    <label className="image-upload-label">
                        {previewImage ? <img src={previewImage} className="img-preview" /> : <span>Tải ảnh</span>}
                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>

                {/* CÁC Ô ĐIỀN THÔNG TIN */}
                <div className="form-group-custom">
                    <label>Tên danh mục:</label>
                    <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required 
                    />
                </div>

                <div className="form-group-custom">
                    <label>Mô tả ngắn:</label>
                    <textarea 
                        value={formData.description} 
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