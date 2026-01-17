import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- NHÓM 1: CÁC TRANG KHÔNG CẦN HEADER/FOOTER (Login, Register) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- NHÓM 2: CÁC TRANG CÓ HEADER & FOOTER (Dùng DefaultLayout) --- */}
        {/* Tất cả các trang nội dung phải nằm trong cặp thẻ này */}
        <Route element={<DefaultLayout />}>
            
            {/* Trang chủ */}
            <Route path="/" element={<Home />} />
            
            {/* Chi tiết công thức & Tạo mới */}
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Các trang danh mục (Đưa hết vào đây mới có Header/Footer) */}
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