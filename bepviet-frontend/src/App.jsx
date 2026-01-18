import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// --- 1. CÁC TRANG AUTH (Không Header/Footer) ---
import Login from './pages/Login';
import Register from './pages/Register';

// --- 2. CÁC TRANG CHÍNH ---
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail'; // Đã fix ở bước trước
import CreateRecipe from './pages/CreateRecipe'; // Đã thêm ở bước trước
import SearchResults from './pages/SearchResults';
import UserProfile from "./pages/ProfilePage";   // Trang cá nhân

// --- 3. CÁC TRANG DANH MỤC ---
import Havebreakfast from './pages/HaveBreakfastPage';
import Dessert from './pages/Dessert';
import Maincourse from './pages/MainCourse';
import Southern from './pages/Southern';
import North from './pages/North';

// --- 4. LAYOUT & COMPONENT ---
import DefaultLayout from './components/DefaultLayout';

function App() {
  // Biến tạm để test User ID (Sau này sẽ lấy từ Context/Login)
  const tempUserId = 1; 

  return (
    <BrowserRouter>
      <Routes>
        {/* === NHÓM 1: CÁC TRANG ĐỘC LẬP (Full màn hình) === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === NHÓM 2: CÁC TRANG CÓ HEADER & FOOTER === */}
        {/* DefaultLayout sẽ chứa Header, Footer và <Outlet /> ở giữa */}
        <Route element={<DefaultLayout />}>
            
            {/* Trang chủ */}
            <Route path="/" element={<Home />} />
            
            {/* Trang cá nhân: Xử lý cả xem của mình và xem của người khác */}
            <Route path="/profile" element={<UserProfile userId={tempUserId} />} />
            <Route path="/users/:id" element={<UserProfile />} />

            {/* Chức năng: Xem chi tiết & Tạo công thức */}
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            
            {/* Tìm kiếm */}
            <Route path="/search" element={<SearchResults />} />

            {/* Các trang danh mục món ăn */}
            <Route path="/an-sang" element={<Havebreakfast />} />
            <Route path="/trang-mieng" element={<Dessert />} />
            <Route path="/mon-chinh" element={<Maincourse />} />
            <Route path="/mien-nam" element={<Southern />} />
            <Route path="/mien-bac" element={<North />} />
            
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;