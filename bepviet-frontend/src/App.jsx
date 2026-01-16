import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Havebreakfast from './pages/HaveBreakfastPage';
import CakePage from './pages/CakePage';
import BeveragePage from './pages/BeveragePage';
import HotPotPage from './pages/HotPotPage';
import VegetarianPage from './pages/VegetarianPage';

// THÊM CÁC DÒNG IMPORT NÀY (Đảm bảo đúng đường dẫn file của bạn)
// import DefaultLayout from './components/DefaultLayout'; 
// import SearchResults from './pages/SearchResults'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Nếu chưa có DefaultLayout, hãy bỏ thẻ <Route element={<DefaultLayout />}> này đi */}
        {/* Tạm thời để các Route phẳng ra như dưới đây để kiểm tra: */}
        <Route path="/" element={<Home />} />
        <Route path="/an-sang" element={<Havebreakfast />} />
        <Route path="/mon-chay" element={<VegetarianPage />} />
        <Route path="/do-uong" element={<BeveragePage />} />
        <Route path="/banh" element={<CakePage />} />
        <Route path="/mon-lau" element={<HotPotPage />} />

        {/* Các trang không có Header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;