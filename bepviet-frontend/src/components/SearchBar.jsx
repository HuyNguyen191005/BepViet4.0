// File: src/components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/search?q=${encodeURIComponent(keyword)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-box">
            <input 
                type="text" 
                placeholder="Nhập món ăn..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
    );
}

export default SearchBar; // <--- QUAN TRỌNG: Phải có dòng này