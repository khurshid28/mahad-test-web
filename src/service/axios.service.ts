import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL ?? "https://api.example.com";

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔴 RESPONSE: 401 bo‘lsa tokenni o‘chir
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      // Show custom error message if available
      const errorMessage = error.response?.data?.message || "Qurilma faol emas";
      toast.error(errorMessage);
      
      localStorage.removeItem("token"); // Tokenni o'chir
      
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        window.location.href = "/signin"; // Foydalanuvchini login sahifasiga qaytar
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
