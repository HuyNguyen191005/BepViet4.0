import React from 'react';
import './Footer.css'; // Chúng ta sẽ tạo file CSS ngay bên dưới
// Import logo của bạn nếu có, ví dụ: import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* CỘT 1: LOGO & GIỚI THIỆU */}
        <div className="footer-col">
          <div className="footer-logo">
             {/* Thay src bằng logo thật của bạn */}
             <img src="/logo.png" alt="Logo" className="logo-img" /> 
             <span>BẾP VIỆT 4.0</span>
          </div>
          <p className="footer-desc">
            Tinh hoa ẩm thực Việt trong kỷ nguyên số.<br/>
            Kết nối đam mê, chia sẻ hương vị.
          </p>
        </div>

        {/* CỘT 2: VỀ CHÚNG TÔI */}
        <div className="footer-col">
          <h3>VỀ CHÚNG TÔI</h3>
          <ul className="footer-links">
            <li><a href="/gioi-thieu">Giới thiệu</a></li>
            <li><a href="/lien-he">Liên hệ</a></li>
            <li><a href="/dieu-khoan">Điều khoản sử dụng</a></li>
            <li><a href="/bao-mat">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* CỘT 3: KẾT NỐI */}
        <div className="footer-col">
          <h3>KẾT NỐI</h3>
          <ul className="footer-links">
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Youtube</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Tiktok</a></li>
          </ul>
        </div>

        {/* CỘT 4: NHẬN TIN MỚI */}
        <div className="footer-col">
          <h3>NHẬN TIN MỚI</h3>
          <p className="footer-text">Nhận công thức ngon mỗi tuần:</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email của bạn..." />
            <button type="submit">Gửi</button>
          </form>
        </div>

      </div>
      
      {/* Dòng bản quyền dưới cùng (Optional) */}
      <div className="footer-bottom">
        &copy; 2024 Bếp Việt 4.0. All rights reserved.
      </div>
    </footer>
  );
}