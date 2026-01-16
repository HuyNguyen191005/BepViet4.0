import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import VegetarianPage from './pages/VegetarianPage';
import HaveBreakfastPage from './pages/HaveBreakfastPage';
import HotPotPage from './pages/HotPotPage';
import CakePage from './pages/CakePage';
import BeveragePage from './pages/BeveragePage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/mon-chay" element={<VegetarianPage />} />
        <Route path="/an-sang" element={<HaveBreakfastPage />} />
        <Route path="/mon-lau" element={<HotPotPage />} />
        <Route path="/banh" element={<CakePage />} />
        <Route path="/do-uong" element={<BeveragePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;