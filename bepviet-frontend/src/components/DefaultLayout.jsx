import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Nhớ import Header bạn đã tách
import Footer from "./Footer";
export default function DefaultLayout() {
    return (
        <div>
            <Header /> {/* Header luôn hiện ở đây */}
            
            <div className="main-content">
                <Outlet /> {/* Nội dung trang con sẽ chui vào đây */}
            </div>
            
            <Footer /> {/* Footer luôn hiện ở đây */}
        </div>
    );
}