import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        // 'Content-Type': 'application/json', // <--- XÓA DÒNG NÀY ĐI (để Axios tự động nhận diện)
        'Accept': 'application/json',
    },
});

// Interceptor: Tự động gắn Token
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN'); // Đảm bảo tên key này khớp với lúc Login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// (Tùy chọn) Interceptor: Xử lý lỗi trả về chung
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Ví dụ: Nếu token hết hạn (401) thì tự logout hoặc đá về trang login
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem('ACCESS_TOKEN');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;