import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_USER = import.meta.env.VITE_API_USER_URL;
const API_PRODUCT_URL = import.meta.env.VITE_API_PRODUCT_URL;
const API_REVIEW_URL = import.meta.env.VITE_API_REVIEW_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Lấy danh sách sản phẩm
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
};

// 🟢 Lấy thông tin sản phẩm theo ID
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

const userAPI = axios.create({
  baseURL: API_URL_USER,
  headers: {
    "Content-Type": "application/json",
  },
});

const reviewAPI = axios.create({
  baseURL: API_REVIEW_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Lấy danh sách sản phẩm theo khóa
export const getListProducts = async (key) => {
  try {
    const response = await productAPI.get(`/${key}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
};

// 🟢 Lấy danh sách người dùng theo khóa
export const getListUsers = async (key) => {
  try {
    const response = await userAPI.get(`/${key}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return [];
  }
};

// 🟢 Lấy thông tin sản phẩm chi tiết theo ID
export const getProductDetail = async (id) => {
  try {
    const response = await productAPI.get(`products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return null;
  }
};

// 🟢 Lấy thông tin người dùng theo ID
export const getUserInfo = async (id) => {
  try {
    const response = await userAPI.get(`user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

// 🟢 Cập nhật thông tin người dùng
export const updateUserInfo = async (id, token, updatedData) => {
  try {
    const response = await userAPI.put(`user/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    return null;
  }
};

// 🟢 Thêm mới sản phẩm
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

    const response = await productAPI.post("/products", formattedData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return null;
  }
};

// 🟢 Cập nhật sản phẩm theo ID
export const updateProduct = async (id, data) => {
  try {
    if (data.productID) {
      throw new Error("Không thể chỉnh sửa mã sản phẩm!");
    }

    const formattedData = {
      name: decodeURIComponent(data.name),
      description: decodeURIComponent(data.description),
      origin: decodeURIComponent(data.origin),
      imageUrl: data.imageUrl,
      price: data.price,
      sold: 0,
      quantity: data.import,
      import: data.import,
      category: data.category,
      unit: data.unit,
      status: data.status,
    };

    const response = await productAPI.put(`/products/${id}`, formattedData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return null;
  }
};

// 🟢 Lấy tất cả đánh giá sản phẩm
export const getAllReviews = async () => {
  try {
    const response = await reviewAPI.get("/reviews");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};

// 🟢 Thêm danh mục mới
export const insertCategory = async (data) => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    return null;
  }
};

export default api;
