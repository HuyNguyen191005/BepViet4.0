import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        username: '', 
        full_name: '', 
        email: '', 
        password: '', 
        password_confirmation: '' // Bắt buộc phải có trường này để khớp với 'confirmed' của Laravel
    });
    
    // State lưu lỗi từ Server trả về
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Xóa lỗi của trường đang nhập để giao diện sạch sẽ hơn
        if (errors[e.target.name]) {
             setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset lỗi cũ

        try {
            // Gọi API
            const res = await axiosClient.post('/register', formData);
            
            // 👇 THAY ĐỔI Ở ĐÂY:
            // 1. Thông báo thành công
            alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
            
            // 2. Chuyển hướng sang trang Đăng nhập (thay vì trang chủ)
            navigate('/login');

        } catch (err) {
            // Xử lý lỗi
            if (err.response && err.response.status === 422) {
                // Lỗi Validation (vd: Thiếu chữ hoa, tên có số...)
                setErrors(err.response.data.errors);
            } else {
                // Lỗi khác
                alert("Lỗi: " + (err.response?.data?.message || "Không thể kết nối Server"));
            }
        }
    };

    return (
        <div className="auth-container">
            {/* Cột trái */}
            <div className="auth-left">
                <div className="overlay"></div>
                <div className="auth-logo">
                    <img src="/logo.png" alt="Logo" />
                    <h2>BẾP VIỆT 4.0</h2>
                    <p>Tinh Hoa Ẩm Thực Việt</p>
                </div>
            </div>

            {/* Cột phải */}
            <div className="auth-right">
                <div className="auth-form-wrapper">
                    <h2 className="auth-title">TẠO TÀI KHOẢN MỚI</h2>

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label>Họ và tên</label>
                            <input name="full_name" placeholder="Nhập họ tên của bạn (Không chứa số)" onChange={handleChange} required />
                            {errors.full_name && <span style={{color:'red', fontSize:'12px'}}>{errors.full_name[0]}</span>}
                        </div>

                        <div className="input-group">
                            <label>Tên đăng nhập (Username)</label>
                            <input name="username" placeholder="Ví dụ: huy123" onChange={handleChange} required />
                            {/* Hiển thị lỗi username (vd: chứa số) */}
                            {errors.username && <span style={{color:'red', fontSize:'12px'}}>{errors.username[0]}</span>}
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="example@gmail.com" onChange={handleChange} required />
                            {errors.email && <span style={{color:'red', fontSize:'12px'}}>{errors.email[0]}</span>}
                        </div>

                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <input name="password" type="password" placeholder="Min 6 ký tự, 1 chữ hoa" onChange={handleChange} required />
                            {/* Hiển thị lỗi password (vd: thiếu chữ hoa) */}
                            {errors.password && <span style={{color:'red', fontSize:'12px'}}>{errors.password[0]}</span>}
                        </div>

                        <div className="input-group">
                            <label>Xác nhận mật khẩu</label>
                            <input name="password_confirmation" type="password" placeholder="Nhập lại mật khẩu" onChange={handleChange} required />
                        </div>

                        <button type="submit" className="btn-primary">ĐĂNG KÝ NGAY</button>
                    </form>

                    <div className="auth-footer">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </div>

                    <p style={{textAlign:'center', fontSize:'10px', color:'#ccc', marginTop:'30px'}}>
                        © 2024 Bếp Việt 4.0 - Tinh Hoa Ẩm Thực Việt
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;