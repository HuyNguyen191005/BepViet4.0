import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
const ShoppingList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axiosClient.get('/shopping-list');
            setItems(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải danh sách", error);
            setLoading(false);
        }
    };

    const toggleItem = async (id, currentStatus) => {
        const updatedItems = items.map(item => 
            item.id === id ? { ...item, is_bought: !currentStatus } : item
        );
        setItems(updatedItems);
        try {
            await axiosClient.put(`/shopping-list/${id}`, { is_bought: !currentStatus });
        } catch (error) { console.error("Lỗi update"); }
    };

    const deleteItem = async (e, id) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click vào dòng (để không bị toggle tick)
        if(!window.confirm("Xóa món này khỏi danh sách?")) return;
        try {
            await axiosClient.delete(`/shopping-list/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) { alert("Lỗi khi xóa!"); }
    };

    const clearAll = async () => {
        if(!window.confirm("Xóa sạch danh sách?")) return;
        // Xóa tạm trên UI cho nhanh, thực tế nên có API clear-all
        items.forEach(async (item) => {
             await axiosClient.delete(`/shopping-list/${item.id}`);
        });
        setItems([]);
    };

    if (loading) return <div style={{textAlign:'center', marginTop:'50px', color:'#ff8c00'}}>Đang tải danh sách...</div>;

    return (
        <div className="shopping-container">
            <div className="shopping-card">
                {/* Header */}
                <div className="shopping-header">
                    <h4>
                        <span role="img" aria-label="cart">🛒</span> Danh Sách Đi Chợ
                    </h4>
                    <span className="badge-count">
                        {items.filter(i => !i.is_bought).length} cần mua
                    </span>
                </div>

                {/* Body */}
                <div className="card-body">
                    {items.length === 0 ? (
                        <div className="empty-state">
                            <p>Giỏ hàng của bạn đang trống trơn!</p>
                            <Link to="/" className="btn-find-recipe">
                                + Tìm công thức nấu ăn
                            </Link>
                        </div>
                    ) : (
                        <ul className="shopping-list">
                            {items.map(item => (
                                <li 
                                    key={item.id} 
                                    className={`shopping-item ${item.is_bought ? 'bought' : ''}`}
                                    onClick={() => toggleItem(item.id, item.is_bought)}
                                >
                                    <div className="item-left">
                                        <div className="check-circle">
                                            {item.is_bought && '✓'}
                                        </div>
                                        
                                        <div className="item-info">
                                            <h6>{item.ingredient_name}</h6>
                                            {item.quantity && <small>{item.quantity}</small>}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={(e) => deleteItem(e, item.id)} 
                                        className="btn-delete" 
                                        title="Xóa món này"
                                    >
                                        &times;
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer (chỉ hiện khi có item) */}
                {items.length > 0 && (
                     <div className="card-footer">
                         <button onClick={clearAll} className="btn-clear-all">Xóa tất cả</button>
                     </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingList;