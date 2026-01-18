import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Để bấm vào xem chi tiết

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      // 1. Lấy Token
      const token = localStorage.getItem("ACCESS_TOKEN"); // Kiểm tra kỹ tên biến này (token hay ACCESS_TOKEN)
      
      if (!token) return;

      try {
        // 2. Gọi API kèm Token
        const response = await axios.get("http://localhost:8000/api/my-recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecipes(response.data);
      } catch (error) {
        console.error("Lỗi tải món ăn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🍳 Công thức của tôi</h2>

      {recipes.length === 0 ? (
        <p>Bạn chưa đăng công thức nào. <Link to="/create-recipe" className="text-blue-500">Đăng ngay!</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.recipe_id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              {/* Ảnh món ăn */}
              <img 
                src={recipe.image_url || "https://via.placeholder.com/300"} 
                alt={recipe.title} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-3">
                <h3 className="font-bold text-lg mb-1">{recipe.title}</h3>
                
                <div className="flex justify-between text-sm text-gray-500">
                   <span>🕒 {recipe.cooking_time} phút</span>
                   <span className={recipe.status === 'Published' ? 'text-green-600' : 'text-gray-500'}>
                      {recipe.status === 'Published' ? 'Đã đăng' : 'Nháp'}
                   </span>
                </div>

                <div className="mt-3 flex gap-2">
                    {/* Nút xem chi tiết */}
                    <Link to={`/recipes/${recipe.recipe_id}`} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm">
                        Xem
                    </Link>
                    {/* Nút sửa (Bạn sẽ làm sau) */}
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                        Sửa
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;