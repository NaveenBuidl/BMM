import axios from "axios";

const token = localStorage.getItem("token");

export const axiosInstance = axios.create({
  // baseURL: "https://academy-june-25.onrender.com",
  baseURL: "http://localhost:5000",
  headers: {
    withCredentials: true,
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);
