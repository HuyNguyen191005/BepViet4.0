import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import '../Admin.css'; 

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        // Đảm bảo đường dẫn khớp với api.php
        axiosClient.get('/admin/users') 
            .then(res => {
                setUsers(Array.isArray(res.data) ? res.data : []); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi kết nối API:", err);
                setLoading(false);
            });
    };

    const getInitials = (name) => {
        if (!name) return "?";
        const names = name.split(' ');
        return names.length > 1 
            ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
            : names[0][0].toUpperCase();
    };

    const filteredUsers = users.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
            axiosClient.delete(`/admin/users/${id}`)
                .then(() => {
                    alert("Đã xóa người dùng");
                    setUsers(users.filter(u => u.user_id !== id)); // Cập nhật danh sách local
                })
                .catch(err => alert("Lỗi khi xóa: " + err.message));
        }
    };
    
    const handleToggleStatus = (id) => {
        axiosClient.patch(`/admin/users/${id}/status`)
            .then((res) => {
                alert(res.data.message);
                // Cập nhật lại user cụ thể trong state
                setUsers(users.map(u => u.user_id === id ? res.data.user : u));
            })
            .catch(err => alert("Lỗi cập nhật trạng thái: " + err.message));
    };
    
    // Chức năng sửa (Ví dụ dùng prompt đơn giản, bạn có thể tạo Modal sau)
    const handleEdit = (user) => {
        const newName = prompt("Nhập tên mới:", user.full_name);
        if (newName) {
            axiosClient.put(`/admin/users/${user.user_id}`, { ...user, full_name: newName })
                .then((res) => {
                    alert("Đã sửa thông tin");
                    setUsers(users.map(u => u.user_id === user.user_id ? res.data.user : u));
                })
                .catch(err => alert("Lỗi khi sửa: " + err.message));
        }
    };
    
    if (loading) return <div className="admin-page-content">Đang tải dữ liệu người dùng...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header-content">
                <div className="header-info">
                    <h1>Quản lý Người dùng (User Management)</h1>
                    <p>Kiểm soát tài khoản và bảo mật hệ thống Bếp Việt.</p>
                </div>
            </div>

            <div className="admin-actions">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên hoặc email" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn">👤+ Thêm mới</button>
            </div>

            <div className="data-table-container">
                <h3>Danh sách Người dùng</h3>
                
                {filteredUsers.length > 0 ? (
                    <>
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TÊN HIỂN THỊ</th>
                                    <th>EMAIL</th>
                                    <th>TRẠNG THÁI</th>
                                    <th>TÁC VỤ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id < 10 ? `0${user.user_id}` : user.user_id}</td>
                                        <td>
                                            <div className="user-cell">
                                                <span className={`user-avatar avatar-${(index % 3) + 1}`}>
                                                    {getInitials(user.full_name)}
                                                </span>
                                                <b>{user.full_name}</b>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.status === 'locked' ? 'red' : 'green'}`}>
                                                {user.status === 'locked' ? 'Bị khóa' : 'Kích hoạt'}
                                            </span>
                                        </td>
                                        <td className="action-buttons">
                                            <button className="edit-btn" title="Sửa" onClick={() => handleEdit(user)}>📝</button>
                                            <button 
                                                className="lock-btn" 
                                                title={user.status === 'locked' ? 'Mở khóa' : 'Khóa'} 
                                                onClick={() => handleToggleStatus(user.user_id)}>
                                                {user.status === 'locked' ? '🔓' : '🚫'}
                                            </button>
                                            <button className="delete-btn" title="Xóa" onClick={() => handleDelete(user.user_id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* CHỈ HIỆN PHÂN TRANG KHI CÓ TRÊN 10 NGƯỜI DÙNG */}
                        <div className="pagination">
                            <span className="page-info">Tổng: <b>{filteredUsers.length}</b> người dùng</span>
                            
                            {filteredUsers.length > 10 && (
                                <div className="page-controls">
                                    <button className="control-btn">❮</button>
                                    <button className="page-num active">1</button>
                                    <button className="page-num">2</button>
                                    <button className="control-btn">❯</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{textAlign: 'center', padding: '30px', color: '#999'}}>
                        Không tìm thấy người dùng nào phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;