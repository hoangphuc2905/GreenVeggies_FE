import axios from "axios";

const API_URL = import.meta.env.VITE_API_AUTH_URL;
const API_URL_USER = import.meta.env.VITE_API_USER_URL;
const API_PRODUCT_URL = import.meta.env.VITE_API_PRODUCT_URL;
const API_REVIEW_URL = import.meta.env.VITE_API_REVIEW_URL;

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
const api_user = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Hàm lấy thông tin sản phẩm cụ thể theo id
export const getUserById = async (id) => {
  try {
    const response = await api_user.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
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

export const getListProducts = async (key) => {
  try {
    const response = await productAPI.get(`/${key}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
};

export const getListUsers = async (key) => {
  try {
    const response = await userAPI.get(`/${key}`);
    console.log("Full response:", response); // Xem toàn bộ response
    console.log("User API Base URL:", API_URL_USER);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
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

export const  getUserInfo = async (id) => {
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
    const response = await productAPI.post("/products", data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return null;
  }
};

export const insertStockEntry = async (data) => {
  try {
    if (!data.productID || data.entryPrice <= 0 || data.entryQuantity <= 0) {
      throw new Error("Dữ liệu nhập kho không hợp lệ!");
    }

    const response = await productAPI.post(
      "/stock-entries",
      {
        productID: data.productID,
        entryPrice: data.entryPrice,
        entryQuantity: data.entryQuantity,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.data) {
      throw new Error("Phản hồi từ server không hợp lệ!");
    }

    console.log("Stock entry response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm phiếu nhập kho:", error.message);
    return null;
  }
};

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

// Hàm lấy tất cả đánh giá
export const getAllReviews = async () => {
  try {
    const response = await reviewAPI.get("/reviews");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};

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
