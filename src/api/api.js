import axios from "axios";

const API_URL_USER = import.meta.env.VITE_API_USER_URL;
const API_PRODUCT_URL = import.meta.env.VITE_API_PRODUCT_URL;
const API_REVIEW_URL = import.meta.env.VITE_API_REVIEW_URL;
const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;
const API_ADDRESS_URL = import.meta.env.VITE_API_ADDRESS_URL;
const API_ORDER_URL = import.meta.env.VITE_API_ORDER_URL;
const API_SHOPPING_CART_URL = import.meta.env.VITE_API_SHOPPING_CART_URL;

export const cloundinaryURL = import.meta.env.VITE_CLOUDINARY_CLOUD_URL;
export const cloundinaryPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
export const cloundinaryName = import.meta.env.VITE_CLOUDINARY_NAME;

const api = axios.create({
  baseURL: API_PRODUCT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

const auth = axios.create({
  baseURL: API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const address = axios.create({
  baseURL: API_ADDRESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const orderAPI = axios.create({
  baseURL: API_ORDER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const shoppingCartAPI = axios.create({
  baseURL: API_SHOPPING_CART_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Xóa hình ảnh trên cloundary
export const deleteImage = async (publicId) => {
  const response = await productAPI.post("/products/delete-image", {
    publicId,
  });
  return response.data;
};

// 🟢 Lưu thông tin sản phẩm vào order
export const saveShoppingCarts = async (orderData) => {
  try {
    const response = await shoppingCartAPI.post("/shopping-carts", orderData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // In ra phản hồi từ máy chủ nếu có
      console.error("API response error:", error.response.data);
    }
    console.error("Lỗi khi lưu thông tin sản phẩm vào giỏ hàng:", error);
    return null;
  }
};

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

// Hàm lấy thông tin sản phẩm cụ thể theo id
export const getUserById = async (userID) => {
  try {
    const response = await userAPI.get(`/users/${userID}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

// 🟢 Lấy giỏ hàng theo userID
export const getShoppingCartByUserId = async (userID) => {
  try {
    const response = await shoppingCartAPI.get(
      `/shopping-carts/user/${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng theo userID:", error);
    return null;
  }
};

// 🟢 Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartQuantity = async (
  shoppingCartID,
  productID,
  quantity
) => {
  try {
    console.log(
      "Request URL:",
      shoppingCartAPI.defaults.baseURL + "/shopping-carts/update-quantity"
    );
    console.log("Payload:", { shoppingCartID, productID, quantity });

    const response = await shoppingCartAPI.patch(
      "/shopping-carts/update-quantity",
      {
        shoppingCartID,
        productID,
        quantity,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    }
    console.error("Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng:", error);
    return null;
  }
};
// 🟢 Xóa chi tiết giỏ hàng theo shoppingCartDetailID
export const deleteShoppingCartDetailById = async (shoppingCartDetailID) => {
  try {
    const response = await shoppingCartAPI.delete(
      `/shopping-carts/shopping-cart-details/${shoppingCartDetailID}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa chi tiết giỏ hàng theo shoppingCartDetailID:",
      error
    );
    return null;
  }
};

// 🟢 Thêm đơn đặt hàng mới
export const addOrder = async (orderData) => {
  try {
    const response = await orderAPI.post("/orders", orderData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // In ra phản hồi từ máy chủ nếu có
      console.error("API response error:", error.response.data);
    }
    console.error("Lỗi khi thêm đơn đặt hàng:", error);
    return null;
  }
};

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

// 🟢 Lấy danh sách sản phẩm theo Category
export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
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
export const getUserInfo = async (userID) => {
  try {
    const response = await userAPI.get(`user/${userID}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

// 🟢 Cập nhật thông tin người dùng
export const updateUserInfo = async (userID, token, updatedData) => {
  try {
    const response = await userAPI.put(`user/${userID}`, updatedData, {
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

// 🟢 Lấy địa chỉ người dùng theo ID
export const getAddressByID = async (userID) => {
  try {
    const response = await address.get(`/address?userID=${userID}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
    return null;
  }
};



// 🟢 API thêm địa chỉ mới cho người dùng
export const addNewAddress = async (addressData) => {
  try {
    const response = await address.post("/address", addressData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      return {
        success: true,
        message: "✅ Địa chỉ đã được thêm thành công!",
      };
    } else {
      return {
        success: false,
        message: response.data.message || "❌ Lỗi khi thêm địa chỉ.",
      };
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi API thêm địa chỉ:", error);
    return {
      success: false,
      message: "❌ Lỗi kết nối hoặc dữ liệu không hợp lệ.",
    };
  }
};

export const changePassword = async (
  email,
  oldPassword,
  newPassword,
  token
) => {
  try {
    const response = await auth.post(
      "/auth/change-password",
      {
        email,
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu:", error);
    return null;
  }
};

// 🟢 Thêm mới sản phẩm
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

// 🟢 Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await api.get("/products");
    console.log("API response:", response.data); // In ra dữ liệu trả về từ API
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả sản phẩm:", error);
    return [];
  }
};

// 🟢 Lấy danh sách danh mục từ sản phẩm
export const getCategoriesFromProducts = async () => {
  try {
    const products = await getAllProducts();
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục từ sản phẩm:", error);
    return [];
  }
};

// 🟢 Lấy thông tin nhập hàng
export const getStockEntry = async (id) => {
  try {
    const response = await productAPI.get(`/stock-entries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhập hàng:", error);
    return null;
  }
};

export default api;
