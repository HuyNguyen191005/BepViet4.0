import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    // Backend đang yêu cầu 'email', nên state này sẽ lưu email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset lỗi cũ

        try {
            const res = await axiosClient.post('/login', { email, password });

            // Lưu token (Dùng || để đề phòng Backend đổi tên biến)
            localStorage.setItem('ACCESS_TOKEN', res.data.access_token || res.data.token);
            localStorage.setItem('USER_INFO', JSON.stringify(res.data.user));

            const user = res.data.user;

            // ĐIỀU HƯỚNG DUY NHẤT 1 LẦN
            if (user.role === 'Admin') {
                alert("Chào mừng Admin!");
                window.location.href = '/admin'; // Dùng href để vừa chuyển hướng vừa load lại dữ liệu
            } else {
                alert("Đăng nhập thành công!");
                window.location.href = '/'; 
            }

        } catch (err) {
            // Xử lý lỗi trả về từ Backend
            if (err.response && err.response.data) {
                // Nếu Backend trả về message lỗi cụ thể (sai pass, không tìm thấy user...)
                setError(err.response.data.message);
            } else {
                setError("Lỗi kết nối Server hoặc sai thông tin!");
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
                    
                    {/* Hiển thị lỗi nếu có */}
                    {error && <div style={{
                        color: '#721c24', 
                        backgroundColor: '#f8d7da', 
                        padding: '10px', 
                        borderRadius: '5px',
                        marginBottom: '15px',
                        textAlign: 'center',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            {/* Lưu ý: Backend hiện tại validate là 'email', nên type="email" là tốt nhất */}
                            <input 
                                type="email" 
                                placeholder="Nhập địa chỉ email của bạn"
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
                            <label style={{cursor:'pointer'}}>
                                <input type="checkbox" style={{marginRight:'5px'}} /> 
                                Ghi nhớ đăng nhập
                            </label>
                            <a href="#" style={{color:'#f59e0b', textDecoration:'none'}}>Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className="btn-primary">ĐĂNG NHẬP</button>
                    </form>

                    <div style={{textAlign:'center', margin:'20px 0', fontSize:'12px', color:'#999'}}>Hoặc</div>

                    <div className="social-buttons">
                        <button className="btn-social" style={{background:'#db4437', color:'white', border:'none'}}>Google</button>
                        <button className="btn-social" style={{background:'#4267B2', color:'white', border:'none'}}>Facebook</button>
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