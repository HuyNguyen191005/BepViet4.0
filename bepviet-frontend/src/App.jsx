import { Routes, Route } from 'react-router-dom';
import RecipeSearch from './pages/RecipeSearch'; // Import trang kết quả
import Home from './pages/Home';

function App() {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
       {/* Định nghĩa đường dẫn nhận tham số search */}
       <Route path="/search" element={<RecipeSearch />} />
    </Routes>
  );
}

export default App;