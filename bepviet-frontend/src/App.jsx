import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Chỉ import Routes và Route

// Import các trang của bạn
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Đường dẫn trang chủ */}
        <Route path="/" element={<Home />} />
        
        {/* Đường dẫn đăng nhập/đăng ký */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Đường dẫn chi tiết công thức */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        
        {/* Đường dẫn Dashboard người dùng (Mới thêm) */}
        <Route path="/profile" element={<UserDashboard />} />
      </Routes>
    </div>
  );
}

export default App;