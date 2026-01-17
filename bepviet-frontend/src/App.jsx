import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import SearchResults from './pages/SearchResults'; // Import trang tìm kiếm (đường dẫn tùy nơi bạn lưu)
import DefaultLayout from './components/DefaultLayout'; // Import Layout vừa tạo
import CreateRecipe from './pages/CreateRecipe';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
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