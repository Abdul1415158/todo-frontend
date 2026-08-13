import axios from "axios";

const API = axios.create({
    baseURL: 'https://todo-backend-eight-beta.vercel.app/api',
    headers: {
        "Content-Type": "application/json"
    }
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `bearer ${token}`;
    }
    return config;
});

export default API