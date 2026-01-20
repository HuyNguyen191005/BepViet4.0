import React, { useEffect, useState } from 'react';
import { Save, FileDown, Activity, Settings as SettingsIcon } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import '../Admin.css'; 
import * as XLSX from 'xlsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';


const Dashboard = () => {
    const handleExportAllInOne = () => {
        
        // --- PHẦN 1: DỮ LIỆU THỐNG KÊ TỔNG QUAN ---
        const summaryData = [
            ["BÁO CÁO TỔNG QUAN HỆ THỐNG BẾP VIỆT"], // Tiêu đề lớn
            ["Hạng mục", "Số lượng", "Ghi chú"],
            ["Người dùng", data.stats.totalUsers || 0, `+${data.stats.newUsersToday} hôm nay`],
            ["Bài viết & Công thức", data.stats.totalPosts || 0, `+${data.stats.newPostsToday} mới`],
            ["Đánh giá", data.stats.totalReviews || 0, `${(Number(data.stats.avgRating) || 0).toFixed(1)} sao trung bình`],
            [], // Dòng trống để ngăn cách
        ];
    
        // --- PHẦN 2: DỮ LIỆU HOẠT ĐỘNG GẦN ĐÂY ---
        const activityHeader = [["NHẬT KÝ HOẠT ĐỘNG GẦN ĐÂY"]];
        const activitySubHeader = [["Tên tài khoản", "Hành động", "Phân loại", "Thời gian"]];
        const activityData = data.recentActivities.map(act => [
            act.username,
            act.action,
            act.type,
            act.created_at ? new Date(act.created_at).toLocaleString('vi-VN') : "Vừa xong"
        ]);
    
        // --- PHẦN 3: CẤU HÌNH VẬN HÀNH ---
        const settingsHeader = [[], ["CẤU HÌNH HỆ THỐNG HIỆN TẠI"]];
        const settingsData = [
            ["Thông số", "Giá trị"],
            ["Tên Website", "Bếp Việt 4.0"],
            ["Hotline hỗ trợ", "1900 1234"],
            ["Hết hạn phiên", "60 phút"], //
            ["Giới hạn ảnh", "5 MB"]
        ];
    
        // --- TIẾN HÀNH GỘP VÀO 1 FILE ---
        const workbook = XLSX.utils.book_new();
    
        const finalData = [
            ...summaryData,
            ...activityHeader,
            ...activitySubHeader,
            ...activityData,
            ...settingsHeader,
            ...settingsData
        ];
        // Tạo Sheet duy nhất
        const worksheet = XLSX.utils.aoa_to_sheet(finalData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bao cao tong hop");

        // Xuất file
        XLSX.writeFile(workbook, "Bao_cao_Admin_BepViet_Full.xlsx");
    };
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        stats: {
            totalUsers: 0,
            newUsersToday: 0,
            totalPosts: 0,
            newPostsToday: 0,
            totalReviews: 0,
            avgRating: 0
        },
        chartData: [],
        recentActivities: []
    });
    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosClient.get('/admin/dashboard');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dashboard:", error);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-5 text-center">Đang tải dữ liệu...</div>;
    const getActivityConfig = (type) => {
        switch (type) {
            case 'user': 
                return { icon: '👤', color: 'blue-bg' };     // Đăng nhập/Đăng ký
            case 'recipe': 
                return { icon: '✏️', color: 'orange-bg' };   // Đăng bài
            case 'delete': 
                return { icon: '🗑️', color: 'red-bg' };      // MỚI: Xóa bài
            case 'favorite': 
                return { icon: '❤️', color: 'pink-bg' };     // MỚI: Yêu thích
            case 'review': 
                return { icon: '⭐', color: 'gold-bg' };     // MỚI: Đánh giá
            default: 
                return { icon: '🔔', color: 'gray-bg' };
        }
    };
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header-card">
                <h2 className="dash-title">Dashboard Tổng quan</h2>
                <p className="dash-subtitle">Hệ thống quản trị Bếp Việt - Số liệu thực tế</p>
            </div>

            {/* Khối thống kê số lượng */}
            <div className="stats-container">
                {/* Thống kê User */}
                <div className="stat-card">
                    <div className="stat-icon-box blue">👥</div>
                    <div className="stat-details">
                        <span className="stat-title">Người dùng</span>
                        <h3 className="stat-value">{(data.stats.totalUsers || 0).toLocaleString()}</h3>
                        <span className="stat-desc green">↑ +{data.stats.newUsersToday || 0} hôm nay</span>
                    </div>
                </div>

                {/* Thống kê Bài viết */}
                <div className="stat-card">
                    <div className="stat-icon-box orange">📰</div>
                    <div className="stat-details">
                        <span className="stat-title">Bài viết & Công thức</span>
                        <h3 className="stat-value">{(data.stats.totalPosts || 0).toLocaleString()}</h3>
                        <span className="stat-desc green">↑ +{data.stats.newPostsToday || 0} mới</span>
                    </div>
                </div>

                {/* Thống kê Đánh giá - Đã fix lỗi NaN */}
                <div className="stat-card">
                    <div className="stat-icon-box gold">⭐</div>
                    <div className="stat-details">
                        <span className="stat-title">Đánh giá</span>
                        <h3 className="stat-value">{(data.stats.totalReviews || 0).toLocaleString()}</h3>
                        <span className="stat-desc yellow">
                            ★ {(Number(data.stats.avgRating) || 0).toFixed(1)} Trung bình
                        </span>
                    </div>
                </div>
            </div>

            {/* Biểu đồ tăng trưởng */}
            <div className="chart-section">
                <div className="chart-head"><h3>Biểu đồ tăng trưởng 7 ngày</h3></div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="user" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} name="Người dùng mới" />
                            <Area type="monotone" dataKey="post" stroke="#d946ef" fill="#d946ef" fillOpacity={0.1} name="Nội dung mới" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lịch sử hoạt động */}
            <div className="activity-section">
                <div className="activity-header"><h3>🕒 Hoạt động gần đây</h3>
                <button onClick={handleExportAllInOne} className="export-btn" style={{
                    backgroundColor: '#107c41', // Màu xanh đặc trưng của Excel
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Save size={18} />
                    Xuất báo cáo tổng hợp (.xlsx)
                </button>
                </div>
                <div className="activity-list">
                    {data.recentActivities?.map((act, index) => {
                            // Lấy config dựa trên act.type từ database
                        const config = getActivityConfig(act.type);
                            
                        return (
                            <div className="activity-item" key={index}>
                                <div className={`act-icon-box ${config.color}`}>
                                    {config.icon}
                                </div>
                                <div className="act-info">
                                    <p><strong>{act.username}</strong> {act.action}</p>
                                    <span>
                                        {act.created_at 
                                            ? formatDistanceToNow(new Date(act.created_at), { addSuffix: true, locale: vi }) 
                                            : 'Vừa xong'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;