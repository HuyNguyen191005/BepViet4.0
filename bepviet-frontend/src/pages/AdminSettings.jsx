import React, { useState } from 'react';
import { 
    Settings, Globe, ShieldCheck, Database, 
    Save, HardDrive, LayoutList, MessageSquare, Timer, ImagePlus, Utensils
} from 'lucide-react';
import '../Admin.css';

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        site_name: "Bếp Việt 4.0",
        hotline: "1900 1234",
        support_email: "support@bepviet.vn",
        maintenance_mode: false,
        auto_approve_recipes: false,
        registration_status: "open", // Đã chuyển về khối Vận hành
        // 5 THÔNG SỐ CẤU HÌNH KỸ THUẬT MỚI
        max_upload_size: 5,           // 1. Dung lượng ảnh (MB)
        items_per_page: 12,          // 2. Phân trang bài viết
        session_timeout: 60,         // 3. Thời gian phiên (Phút)
        max_images_per_recipe: 10,   // 4. Giới hạn ảnh mỗi món
        max_ingredients_per_recipe: 20, // 5. MỚI: Giới hạn nguyên liệu mỗi món
        footer_copyright: "© 2026 Bếp Việt 4.0. All rights reserved."
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Đã cập nhật cấu hình hệ thống thành công!");
            setLoading(false);
        }, 800);
    };

    return (
        <div className="admin-page-container">
            <div className="admin-header-content">
                <h1>Cài đặt hệ thống</h1>
                <p>Quản lý toàn bộ thông số vận hành và cấu hình kỹ thuật của Bếp Việt.</p>
            </div>

            <div className="settings-grid">
                {/* KHỐI 1: THÔNG TIN WEBSITE */}
                <div className="settings-card">
                    <div className="card-header">
                        <Globe size={20} className="icon-blue" />
                        <h3>Thông tin Website</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group-st">
                            <label>Tên Website</label>
                            <input type="text" name="site_name" value={settings.site_name} onChange={handleChange} />
                        </div>
                        <div className="form-row-st">
                            <div className="form-group-st">
                                <label>Hotline</label>
                                <input type="text" name="hotline" value={settings.hotline} onChange={handleChange} />
                            </div>
                            <div className="form-group-st">
                                <label>Email</label>
                                <input type="email" name="support_email" value={settings.support_email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group-st">
                            <label>Bản quyền Footer</label>
                            <textarea name="footer_copyright" value={settings.footer_copyright} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* KHỐI 2: TRẠNG THÁI VẬN HÀNH (Đã thêm Quyền đăng ký) */}
                <div className="settings-card">
                    <div className="card-header">
                        <ShieldCheck size={20} className="icon-green" />
                        <h3>Trạng thái Vận hành</h3>
                    </div>
                    <div className="card-body">
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <strong>Chế độ bảo trì</strong>
                                <p>Tạm đóng website để nâng cấp.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="maintenance_mode" checked={settings.maintenance_mode} onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <strong>Tự động duyệt bài</strong>
                                <p>Công thức sẽ hiển thị ngay khi đăng.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" name="auto_approve_recipes" checked={settings.auto_approve_recipes} onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        {/* QUYỀN ĐĂNG KÝ ĐÃ DI CHUYỂN VỀ ĐÂY */}
                        <div className="form-group-st" style={{marginTop: '15px'}}>
                            <label><MessageSquare size={14} /> Quyền đăng ký thành viên</label>
                            <select name="registration_status" value={settings.registration_status} onChange={handleChange} className="st-select">
                                <option value="open">Mở đăng ký công khai</option>
                                <option value="close">Đóng đăng ký mới</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* KHỐI 3: CẤU HÌNH KỸ THUẬT (5 Thông số mới) */}
                <div className="settings-card full-width">
                    <div className="card-header">
                        <Database size={20} className="icon-purple" />
                        <h3>Cấu hình Tài nguyên & Trải nghiệm</h3>
                    </div>
                    <div className="card-body param-grid-5">
                        <div className="form-group-st">
                            <label><HardDrive size={14} /> Ảnh tối đa (MB)</label>
                            <input type="number" name="max_upload_size" value={settings.max_upload_size} onChange={handleChange} />
                        </div>
                        <div className="form-group-st">
                            <label><LayoutList size={14} /> Bài viết / Trang</label>
                            <input type="number" name="items_per_page" value={settings.items_per_page} onChange={handleChange} />
                        </div>
                        <div className="form-group-st">
                            <label><Timer size={14} /> Hết hạn phiên (Phút)</label>
                            <input type="number" name="session_timeout" value={settings.session_timeout} onChange={handleChange} />
                        </div>
                        <div className="form-group-st">
                            <label><ImagePlus size={14} /> Số ảnh / Công thức</label>
                            <input type="number" name="max_images_per_recipe" value={settings.max_images_per_recipe} onChange={handleChange} />
                        </div>
                        {/* THÔNG SỐ MỚI THAY THẾ QUYỀN ĐĂNG KÝ */}
                        <div className="form-group-st">
                            <label><Utensils size={14} /> Số nguyên liệu / Món</label>
                            <input type="number" name="max_ingredients_per_recipe" value={settings.max_ingredients_per_recipe} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="save-settings-btn" onClick={handleSave} disabled={loading}>
                    <Save size={18} />
                    {loading ? "Đang lưu..." : "Cập nhật cấu hình"}
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;