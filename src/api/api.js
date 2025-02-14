import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_USER = import.meta.env.VITE_API_URL_USER;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
};

// Hàm lấy thông tin người dùng cụ thể
export const getUserInfo = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL_USER}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Thông tin người dùng:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

export default api;
