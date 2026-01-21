import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';

import Havebreakfast from './pages/HaveBreakfastPage';
import Dessert from './pages/Dessert';
import Maincourse from './pages/MainCourse';
import Southern from './pages/Southern';
import North from './pages/North';

import SearchResults from './pages/SearchResults';
import DefaultLayout from './components/DefaultLayout';
import CreateRecipe from './pages/CreateRecipe';

import AdminLayout from './pages/AdminLayout';
import AdminPanel from './pages/AdminPanel';
import AdminCategoryPanel from './pages/AdminCategoryPanel'; // Thêm import


import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail'; 
import CreatePost from './pages/CreatePost';

import AdminDashboard from './pages/AdminDashboard';
import AdminRecipePanel from './pages/AdminRecipePanel';
import AdminSettings from './pages/AdminSettings'; 

import UserProfile from './components/UserProfile';
import EditRecipe from './pages/EditRecipe';

import ForumList from './pages/ForumList';
import ForumDetail from './pages/ForumDetail';
import CreateForum from './pages/CreateForum';
import ShoppingList from './pages/ShoppingList';

function App() {
  const getUserInfo = () => {
    try {
      const stored = localStorage.getItem('USER_INFO');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  };

  const user = getUserInfo();
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- NHÓM 1: CÁC TRANG KHÔNG CẦN HEADER/FOOTER (Login, Register) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- NHÓM 2: CÁC TRANG CÓ HEADER & FOOTER (Dùng DefaultLayout) --- */}
        {/* Tất cả các trang nội dung phải nằm trong cặp thẻ này */}
        <Route element={<DefaultLayout />}>
            
            {/* Trang chủu */}
            <Route path="/" element={<Home />} />
            
            {/* Chi tiết công thức & Tạo mới */}
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Các trang danh mục (Đưa vào đây mới có Header/Footer) */}
            <Route path="/an-sang" element={<Havebreakfast />} />
            <Route path="/trang-mieng" element={<Dessert />} />
            <Route path="/mon-chinh" element={<Maincourse />} />
            <Route path="/mien-nam" element={<Southern />} />
            <Route path="/mien-bac" element={<North />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<PostDetail />} />
            <Route path="/create-post" element={<CreatePost />} />

            {/* Thêm vào trong nhóm Route của DefaultLayout để có Header/Footer */}
            <Route index element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/recipes/edit/:id" element={<EditRecipe />} /> {/* DÒNG CẦN THÊM */}
            {/* --- NHÓM FORUM --- */}
            <Route path="/forum" element={<ForumList />} />
            <Route path="/forum/create" element={<CreateForum />} />
            <Route path="/forum/:id" element={<ForumDetail />} />
            {/* --- NHÓM SHOPPING LIST --- */}
            <Route path="/shopping-list" element={<ShoppingList />} />
        </Route>
        {/* --- NHÓM 3: CÁC TRANG QUẢN TRỊ (Dùng AdminLayout) --- */}
        <Route path="/admin" element={user?.role === 'Admin' ? <AdminLayout /> : <Navigate to="/login" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminPanel />} />
              <Route path="recipes" element={<AdminRecipePanel />} /> {/* THÊM DÒNG NÀY */}
              <Route path="categories" element={<AdminCategoryPanel />} /> {/* THÊM DÒNG NÀY */}
              <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;