import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', full_name: '', email: '', password: '', password_confirmation: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const res = await axiosClient.post('/register', formData);
            alert(res.data.message);
            localStorage.setItem('ACCESS_TOKEN', res.data.access_token);
            localStorage.setItem('USER_INFO', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                alert("Lỗi Server hoặc kết nối!");
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
                            <input name="full_name" placeholder="Nhập họ tên của bạn" onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Tên đăng nhập (Username)</label>
                            <input name="username" placeholder="Nhập tên đăng nhập" onChange={handleChange} required />
                            {errors.username && <span style={{color:'red', fontSize:'12px'}}>{errors.username[0]}</span>}
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="example@gmail.com" onChange={handleChange} required />
                            {errors.email && <span style={{color:'red', fontSize:'12px'}}>{errors.email[0]}</span>}
                        </div>

                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <input name="password" type="password" placeholder="Tối thiểu 6 ký tự" onChange={handleChange} required />
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