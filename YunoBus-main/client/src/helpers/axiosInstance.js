import axios from "axios";

export const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    
    // If the token exists, set it in the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
