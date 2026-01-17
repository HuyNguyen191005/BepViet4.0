import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Đảm bảo đường dẫn import đúng

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    // State dữ liệu
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true);

    // State bộ lọc
    const [selectedCats, setSelectedCats] = useState([]); 
    const [selectedDiff, setSelectedDiff] = useState([]); 
    const [maxTime, setMaxTime] = useState(120); 

    // --- HÀM XỬ LÝ ẢNH (QUAN TRỌNG) ---
    const getImageUrl = (imagePath) => {
        // 1. Nếu không có dữ liệu ảnh -> Trả về ảnh mặc định
        if (!imagePath) return '/default-food.png'; 

        // 2. Nếu ảnh đã là link online (bắt đầu bằng http hoặc https) -> Giữ nguyên
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // 3. Nếu là tên file từ DB -> Nối domain backend vào
        // Lưu ý: Laravel thường lưu trong /storage/. Nếu bạn dùng /images/ thì sửa lại chữ storage thành images
        return `http://localhost:8000/storage/${imagePath}`; 
    };

    // 1. Lấy danh sách Category khi vào trang
    useEffect(() => {
        axiosClient.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Lỗi lấy danh mục:", err));
    }, []);

    // 2. Gọi API Search khi filter thay đổi
    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const params = {
                    query: query,
                    max_time: maxTime,
                };

                if (selectedCats.length > 0) {
                    params.categories = selectedCats.join(',');
                }

                if (selectedDiff.length > 0) {
                    params.difficulty = selectedDiff.join(',');
                }

                const response = await axiosClient.get('/recipes/search', { params });
                setRecipes(response.data);
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [query, selectedCats, selectedDiff, maxTime]);

    // --- CÁC HÀM XỬ LÝ FILTER ---
    const handleCategoryChange = (catId) => {
        setSelectedCats(prev => 
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleDifficultyChange = (level) => {
        setSelectedDiff(prev => 
            prev.includes(level) ? prev.filter(item => item !== level) : [...prev, level]
        );
    };

    const getDifficultyClass = (diff) => {
        if (diff === 'Dễ') return 'green-badge';
        if (diff === 'Trung bình') return 'yellow-badge';
        return 'red-badge';
    };

    return (
        <div className="search-page-container">
            <div className="breadcrumb">
                <span>Trang chủ</span> / <span>Tìm kiếm</span> / <strong>"{query}"</strong>
            </div>

            <div className="search-layout">
                {/* --- SIDEBAR BỘ LỌC --- */}
                <aside className="filter-sidebar">
                    <div className="filter-header">
                        <h3><i className="fa fa-filter"></i> Bộ lọc</h3>
                        <button 
                            className="btn-clear-filter" 
                            onClick={() => {setSelectedCats([]); setSelectedDiff([]); setMaxTime(120);}}
                        >
                            x Xóa lọc
                        </button>
                    </div>

                    {/* Filter 1: Danh mục */}
                    <div className="filter-group">
                        <h4>Loại món</h4>
                        {categories.map(cat => (
                            <label key={cat.category_id} className="checkbox-row">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCats.includes(cat.category_id)}
                                    onChange={() => handleCategoryChange(cat.category_id)}
                                />
                                <span className="cb-label">{cat.name}</span>
                            </label>
                        ))}
                    </div>

                    {/* Filter 2: Độ khó */}
                    <div className="filter-group">
                        <h4>Độ khó</h4>
                        {['Dễ', 'Trung bình', 'Khó'].map(level => (
                            <label key={level} className="checkbox-row">
                                <input 
                                    type="checkbox" 
                                    checked={selectedDiff.includes(level)}
                                    onChange={() => handleDifficultyChange(level)}
                                />
                                <span className="cb-label">{level}</span>
                            </label>
                        ))}
                    </div>

                    {/* Filter 3: Thời gian */}
                    <div className="filter-group">
                        <h4>Thời gian nấu (tối đa)</h4>
                        <input 
                            type="range" min="0" max="180" step="5"
                            value={maxTime}
                            onChange={(e) => setMaxTime(e.target.value)}
                            className="range-slider" 
                        />
                        <div className="range-labels">
                            <span>0p</span>
                            <span className="highlight-text">{maxTime}p</span>
                            <span>180p</span>
                        </div>
                    </div>
                </aside>

                {/* --- KẾT QUẢ --- */}
                <main className="results-content">
                    <div className="results-header">
                        <div className="results-title">
                            Kết quả: <strong>{recipes.length} món</strong>
                        </div>
                    </div>

                    {loading ? <p>Đang tải...</p> : (
                        <div className="recipe-grid-modern">
                            {recipes.length > 0 ? recipes.map((recipe) => (
                                <div key={recipe.recipe_id} className="recipe-card-modern">
                                    <div className="card-image-wrapper">
                                        {/* --- SỬA LỖI ẢNH TẠI ĐÂY --- */}
                                        <img 
                                            // Kiểm tra cả 2 trường hợp tên biến
                                            src={getImageUrl(recipe.image_url || recipe.image)} 
                                            alt={recipe.title} 
                                            onError={(e)=>{
                                                e.target.onerror = null; 
                                                e.target.src = '/default-food.png'; // Ảnh dự phòng local
                                            }} 
                                        />
                                        <span className="time-badge">⏱ {recipe.cooking_time}p</span>
                                    </div>

                                    <div className="card-body">
                                        <Link to={`/recipes/${recipe.recipe_id}`} className="card-title">
                                            {recipe.title}
                                        </Link>
                                        
                                        <div className="card-meta">
                                            <div className="rating">
                                                <span className="star">★</span> 
                                                <span className="score">
                                                    {recipe.reviews_avg_rating ? parseFloat(recipe.reviews_avg_rating).toFixed(1) : '0.0'}
                                                </span>
                                                <span className="review-count">({recipe.reviews_count || 0})</span>
                                            </div>
                                            
                                            <span className={`difficulty-pill ${getDifficultyClass(recipe.difficulty)}`}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>

                                        <div className="card-footer">
                                            <span className="author-name">Người đăng: User #{recipe.user_id}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : <p>Không tìm thấy món nào phù hợp với bộ lọc.</p>}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchResults;