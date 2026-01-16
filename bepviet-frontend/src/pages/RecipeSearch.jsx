import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const RecipeSearch = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Lấy chữ 'thịt bò' từ URL
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            if (!query) return;

            setLoading(true);
            try {
                // Gọi API Laravel
                const res = await axios.get(`http://localhost:8000/api/recipes/search?q=${query}`);
                setRecipes(res.data.data);
            } catch (error) {
                console.error("Lỗi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [query]); // Chạy lại mỗi khi từ khóa (query) thay đổi

    return (
        <div className="container">
            <h2>Kết quả tìm kiếm cho: "{query}"</h2>

            {loading && <p>Đang tìm kiếm...</p>}

            <div className="recipe-list">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <div key={recipe.id} className="recipe-item">
                            <img src={recipe.image} alt={recipe.title} width="200" />
                            <h3>{recipe.title}</h3>
                        </div>
                    ))
                ) : (
                    !loading && <p>Không tìm thấy món nào!</p>
                )}
            </div>
        </div>
    );
};
// Search kết quả tìm kiếm
export default RecipeSearch;