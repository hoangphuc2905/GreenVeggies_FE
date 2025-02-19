import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_USER = import.meta.env.VITE_API_USER_URL;

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

const productAPI = axios.create({
  baseURL: API_PRODUCT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const userAPI = axios.create({
  baseURL: API_URL_USER,
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

export const getUserInfo = async (id) => {
  try {
    const response = await userAPI.get(`user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

export const insertProduct = async (data) => {
  try {
    const formattedData = {
      name: decodeURIComponent(data.name),
      description: decodeURIComponent(data.description),
      origin: decodeURIComponent(data.origin),
      imageUrl: data.imageUrl, // Không cần decode URL ảnh
      price: data.price,
      sold: 0,
      quantity: data.import,
      import: data.import,
      category: data.category,
      unit: data.unit,
      status: data.status,
    };

    console.log("data", data);

    const response = await productAPI.post("/products", formattedData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return null;
  }
};

export default api;
