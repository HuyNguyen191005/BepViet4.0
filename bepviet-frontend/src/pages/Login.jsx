import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosClient.post('/login', { email, password });
            localStorage.setItem('ACCESS_TOKEN', res.data.access_token);
            localStorage.setItem('USER_INFO', JSON.stringify(res.data.user));
            navigate('/'); 
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Lỗi kết nối Server!");
            }
        }
    };

    return (
        <div className="auth-container">
            {/* Cột trái: Ảnh & Logo */}
            <div className="auth-left">
                <div className="overlay"></div>
                <div className="auth-logo">
                    <img src="/logo.png" alt="Logo" />
                    <h2>BẾP VIỆT 4.0</h2>
                    <p>Tinh Hoa Ẩm Thực Việt</p>
                </div>
            </div>

            {/* Cột phải: Form */}
            <div className="auth-right">
                <div className="auth-form-wrapper">
                    <h2 className="auth-title">ĐĂNG NHẬP</h2>
                    
                    {error && <p style={{color:'red', textAlign:'center', marginBottom:'15px'}}>{error}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email / Tên đăng nhập</label>
                            <input 
                                type="text" 
                                placeholder="Nhập email hoặc tên đăng nhập"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <input 
                                type="password" 
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'20px'}}>
                            <label><input type="checkbox" /> Ghi nhớ đăng nhập</label>
                            <a href="#" style={{color:'#f59e0b', textDecoration:'none'}}>Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className="btn-primary">ĐĂNG NHẬP</button>
                    </form>

                    <div style={{textAlign:'center', margin:'20px 0', fontSize:'12px', color:'#999'}}>Hoặc</div>

                    <div className="social-buttons">
                        <button className="btn-social">Google</button>
                        <button className="btn-social">Facebook</button>
                    </div>

                    <div className="auth-footer">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </div>
                    
                    <p style={{textAlign:'center', fontSize:'10px', color:'#ccc', marginTop:'30px'}}>
                        © 2024 Bếp Việt 4.0 - Tinh Hoa Ẩm Thực Việt
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;