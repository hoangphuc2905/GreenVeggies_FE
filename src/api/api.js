import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_USER = import.meta.env.VITE_API_URL_USER;
const API_PRODUCT_URL = import.meta.env.VITE_API_PRODUCT_URL;

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

// Hàm lấy thông tin sản phẩm cụ thể theo id
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    return null;
  }
};

const productAPI = axios.create({
  baseURL: API_PRODUCT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getListProducts = async (key) => {
  try {
    const response = await productAPI.get(`/${key}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
};

export const getProductDetail = async (id) => {
  try {
    const response = await productAPI.get(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return null;
  }
};

export const insertProduct = async (data) => {
  try {
    const response = await productAPI.post("/products", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return null;
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
