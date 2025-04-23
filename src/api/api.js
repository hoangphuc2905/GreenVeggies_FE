import axios from "axios";

const API_URL_USER = import.meta.env.VITE_API_USER_URL;
const API_PRODUCT_URL = import.meta.env.VITE_API_PRODUCT_URL;
const API_REVIEW_URL = import.meta.env.VITE_API_REVIEW_URL;
const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL;
const API_ADDRESS_URL = import.meta.env.VITE_API_ADDRESS_URL;
const API_ORDER_URL = import.meta.env.VITE_API_ORDER_URL;
const API_SHOPPING_CART_URL = import.meta.env.VITE_API_SHOPPING_CART_URL;
const API_URL_NOTIFY = import.meta.env.VITE_API_NOTIFICATION_URL;
const API_PAYMENT_URL = import.meta.env.VITE_API_PAYMENT_URL;
const API_URL_STATISTIC = import.meta.env.VITE_API_STATISTIC_URL;


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
const notifyAPI = axios.create({
  baseURL: API_URL_NOTIFY,
  headers: {
    "Content-Type": "application/json",
  },
});

const paymentAPI = axios.create({
  baseURL: API_PAYMENT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const statisticAPI = axios.create({
  baseURL: API_URL_STATISTIC,
  headers: {
    "Content-Type": "application/json",
  },
});

//SẢN PHẨM
export const handleProductApi = {
  getListProducts: async (key) => {
    try {
      const response = await productAPI.get(`/${key}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      return error;
    }
  },
  //Cập nhật trạng thái sản phẩm
  updateProductStatus: async (productID, status) => {
    try {
      const response = await productAPI.put(`/products/status/${productID}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      return null;
    }
  },
  //Tìm sản phẩm theo id
  getProductById: async (id) => {
    return await productAPI.get(`/products/${id}`);
  },

  //Thêm sản phẩm mới
  addProduct: async (data) => {
    return await productAPI.post("/products", data);
  },
  addCategory: async (data) => {
    return await productAPI.post("/categories", data);
  },
  updateProduct: async (id, data) => {
    return await productAPI.put(`/products/${id}`, data);
  },
  //Thêm phiếu nhập kho

  insertStockEntry: async (data) => {
    return await productAPI.post("/stock-entries", data);
  },
};

//THÔNG BÁO
export const handleNotifyApi = {
  //Lấy danh sách thông báo

  getNotificationsByReceiver: async (receiverID) => {
    return await notifyAPI.get(`/notifications/${receiverID}`);
  },
  markAsRead: async (notifyID) => {
    return await notifyAPI.patch(`/notifications/${notifyID}/read`);
  },
  createNotification: async (data) => {
    return await notifyAPI.post("/notifications", data);
  },
};

//ĐƠN HÀNG
export const handleOrderApi = {
  //Lấy thông tin đơn hàng theo ID
  getOrderById: async (orderID) => {
    return await orderAPI.get(`/orders/${orderID}`);
  },
  //Lấy danh sách đơn hàng theo userID
  getOrdersByUserId: async (userID) => {
    return await orderAPI.get(`/orders/user/${userID}`);
  },
};
//THỐNG KÊ
export const handleStatisticApi = {
  // Thống kê doanh thu hàng ngày
  getDailyRevenue: async (date) => {
    return await statisticAPI.get(`/statistics/daily?date=${date}`);
  },
  //Tình trạng doanh thu theo ngày
  getRevenueByPaymentMethod: async (date) => {
    return await statisticAPI.get(
      `/statistics/revenue-by-payment-method?date=${date}`
    );
  },
  //Thống kê đơn hàng theo trạng thái
  getOrderStatsByStatus: async (date) => {
    // statistics/order-status?date
    return await statisticAPI.get(`/statistics/order-status?date=${date}`);
  },
  //Thống kê doanh thu theo năm
  getYearlyRevenue: async (year) => {
    // statistics/yearly-revenue?year=2025
    return await statisticAPI.get(`/statistics/yearly-revenue?year=${year}`);
  },
  //Thống kê đơn hàng thành công theo tháng của năm
  getMonthlySuccessfulOrders: async (month, year) => {
    return await statisticAPI.get(
      `/statistics/daily-orders?month=${month}&year=${year}`
    );
  },
};
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
//Lấy danh sách tất cả đơn hàng
export const getAllOrders = async () => {
  try {
    const response = await orderAPI.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    return null;
  }
};

//Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderID, status) => {
  try {
    const response = await orderAPI.put(`/orders/${orderID}`, { status });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
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
      name: data.name,
      description: data.description,
      origin: data.origin,
      imageUrl: data.imageUrl,
      import: data.import,
      category: data.category,
      unit: data.unit,
      status: data.status,
      price: data.price,
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
    const reviews = response.data;

    // Fetch both user and product information for each review
    const reviewsWithInfo = await Promise.all(
      reviews.map(async (review) => {
        try {
          const [userResponse, productResponse] = await Promise.all([
            userAPI.get(`/user/${review.userID}`),
            productAPI.get(`/products/${review.productID}`),
          ]);

          return {
            ...review,
            user: userResponse.data,
            product: productResponse.data,
          };
        } catch (error) {
          console.error("Error fetching data:", error);
          return {
            ...review,
            user: null,
            product: null,
          };
        }
      })
    );

    return reviewsWithInfo;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
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

//THANH TOÁN
export const handlePaymentApi = {
  // Tạo mã QR cho thanh toán
  createPaymentQR: async (amount) => {
    try {
      console.log("API call: Creating payment QR for amount:", amount);
      const response = await paymentAPI.post("/payments/create-qr", {
        amount,
      });
      console.log("Payment QR API response:", response.data);

      // Xử lý response từ backend theo định dạng VietQR
      if (response.data && response.data.qrURL) {
        return {
          qrCodeUrl: response.data.qrURL,
          message: response.data.message,
          paymentId: "vietqr_" + Date.now(),
        };
      }
      return response.data;
    } catch (error) {
      console.error("Error details:", error.response || error);
      console.error("Lỗi khi tạo mã QR thanh toán:", error.message);

      // Fallback: Tạo URL VietQR trực tiếp nếu API không hoạt động
      const vietQrUrl =
        "https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=" +
        amount +
        "&addInfo=Thanh%20toan%20don%20hang&accountName=HUYNH%20HOANG%20PHUC&acqId=970422";

      return {
        qrCodeUrl: vietQrUrl,
        message: "Tạo mã QR thanh toán tạm thời.",
        paymentId: "vietqr_" + Date.now(),
      };
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (paymentId) => {
    try {
      console.log("API call: Checking payment status for ID:", paymentId);
      const response = await paymentAPI.get(
        `/api/payments/status/${paymentId}`
      );
      console.log("Payment status API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error details:", error.response || error);
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error.message);

      // Nếu API không khả dụng, giả lập response trạng thái
      if (paymentId.startsWith("vietqr_")) {
        return { status: "pending" };
      }
      throw error;
    }
  },
};

export default api;
