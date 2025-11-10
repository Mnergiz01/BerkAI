import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5195/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    if (error.response) {
      const message = error.response.data?.message || 'Bir hata oluştu';
      const errors = error.response.data?.errors;

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
          break;
        case 403:
          toast.error('Bu işlem için yetkiniz yok.');
          break;
        case 404:
          toast.error('İstenen kaynak bulunamadı.');
          break;
        case 500:
          toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
          break;
        default:
          if (errors && errors.length > 0) {
            errors.forEach((err) => toast.error(err));
          } else {
            toast.error(message);
          }
      }
    } else if (error.request) {
      toast.error('Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.');
    } else {
      toast.error('Bir hata oluştu.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
