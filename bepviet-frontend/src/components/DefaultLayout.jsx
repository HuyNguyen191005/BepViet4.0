import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Nhớ import Header bạn đã tách

export default function DefaultLayout() {
    return (
        <div>
            <Header /> {/* Header luôn hiện ở đây */}
            
            <div className="main-content">
                <Outlet /> {/* Nội dung trang con sẽ chui vào đây */}
            </div>
            
            <footer style={{textAlign: 'center', marginTop: '50px', padding: '20px', background: '#f1f1f1'}}>
                © 2024 Bếp Việt 4.0
            </footer>
        </div>
    );
}