import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// --- Layouts ---
import DefaultLayout from './components/DefaultLayout';
import AdminLayout from './pages/AdminLayout';

// --- Auth Pages ---
import Login from './pages/Login';
import Register from './pages/Register';

// --- Client Pages: Core ---
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import UserProfile from './components/UserProfile';
import ShoppingList from './pages/ShoppingList';

// --- Client Pages: Recipes & Categories ---
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import Havebreakfast from './pages/HaveBreakfastPage';
import Dessert from './pages/Dessert';
import Maincourse from './pages/MainCourse';
import Southern from './pages/Southern';
import North from './pages/North';

// --- Client Pages: Blog & Forum ---
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import ForumList from './pages/ForumList';
import ForumDetail from './pages/ForumDetail';
import CreateForum from './pages/CreateForum';

// --- Admin Pages ---
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel'; // Users
import AdminRecipePanel from './pages/AdminRecipePanel';
import AdminCategoryPanel from './pages/AdminCategoryPanel';
import AdminSettings from './pages/AdminSettings';

function App() {
  // Lấy thông tin user từ LocalStorage để check quyền Admin
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
        
        {/* =======================================================
            NHÓM 1: AUTHENTICATION (Không có Header/Footer)
           ======================================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =======================================================
            NHÓM 2: CLIENT / NGƯỜI DÙNG (Dùng DefaultLayout)
           ======================================================= */}
        <Route element={<DefaultLayout />}>
          
          {/* --- Trang chủ & Tìm kiếm --- */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />

          {/* --- User & Tiện ích --- */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/shopping-list" element={<ShoppingList />} />

          {/* --- Công thức (Recipes) --- */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipes/edit/:id" element={<EditRecipe />} />

          {/* --- Danh mục món ăn --- */}
          <Route path="/an-sang" element={<Havebreakfast />} />
          <Route path="/trang-mieng" element={<Dessert />} />
          <Route path="/mon-chinh" element={<Maincourse />} />
          <Route path="/mien-nam" element={<Southern />} />
          <Route path="/mien-bac" element={<North />} />

          {/* --- Blog --- */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<PostDetail />} />
          <Route path="/create-post" element={<CreatePost />} />

          {/* --- Diễn đàn (Forum) --- */}
          <Route path="/forum" element={<ForumList />} />
          <Route path="/forum/:id" element={<ForumDetail />} />
          <Route path="/forum/create" element={<CreateForum />} />

        </Route>

        {/* =======================================================
            NHÓM 3: ADMIN PORTAL (Dùng AdminLayout + Check Role)
           ======================================================= */}
        <Route 
          path="/admin" 
          element={user?.role === 'Admin' ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminPanel />} />
          <Route path="recipes" element={<AdminRecipePanel />} />
          <Route path="categories" element={<AdminCategoryPanel />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;