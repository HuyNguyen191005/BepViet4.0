import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';

import Havebreakfast from './pages/HaveBreakfastPage';
import Dessert from './pages/Dessert';
import Maincourse from './pages/MainCourse';
import Southern from './pages/Southern';
import North from './pages/North';

// THÊM CÁC DÒNG IMPORT NÀY (Đảm bảo đúng đường dẫn file của bạn)
// import DefaultLayout from './components/DefaultLayout'; 
// import SearchResults from './pages/SearchResults'; 

import SearchResults from './pages/SearchResults'; // Import trang tìm kiếm (đường dẫn tùy nơi bạn lưu)
import DefaultLayout from './components/DefaultLayout'; // Import Layout vừa tạo


import CreateRecipe from './pages/CreateRecipe';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Nếu chưa có DefaultLayout, hãy bỏ thẻ <Route element={<DefaultLayout />}> này đi */}
        {/* Tạm thời để các Route phẳng ra như dưới đây để kiểm tra: */}
        <Route path="/" element={<Home />} />
        <Route path="/an-sang" element={<Havebreakfast />} />
        <Route path="/trang-mieng" element={<Dessert />} />
        <Route path="/mon-chinh" element={<Maincourse />} />
        <Route path="/mien-nam" element={<Southern />} />
        <Route path="/mien-bac" element={<North />} />

        {/* Các trang không có Header */}

        {/* --- NHÓM 1: CÁC TRANG CÓ HEADER (Dùng DefaultLayout) --- */}
        <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/search" element={<SearchResults />} /> {/* Thêm route tìm kiếm */}
            <Route path="/create-recipe" element={<CreateRecipe />} />
        </Route>

        {/* --- NHÓM 2: CÁC TRANG KHÔNG CÓ HEADER (Đứng độc lập) --- */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;