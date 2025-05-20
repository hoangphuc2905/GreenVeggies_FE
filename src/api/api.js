import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Sửa import thành named export

const API_URL = import.meta.env.VITE_API_REVIEW_URL;
const OFFICIAL_WEBSITE = import.meta.env.VITE_API;
export const cloundinaryURL = import.meta.env.VITE_CLOUDINARY_CLOUD_URL;
export const cloundinaryPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
export const cloundinaryName = import.meta.env.VITE_CLOUDINARY_NAME;

const api = axios.create({
  baseURL: OFFICIAL_WEBSITE,
  headers: {
    "Content-Type": "application/json",
  },
});

const reviewAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const checkTokenExpiration = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Hàm làm mới token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken || checkTokenExpiration(refreshToken)) {
    throw new Error("Refresh token is missing or expired");
  }
  console.log("Đang gọi refresh-token...");
  const response = await axios.post(`${OFFICIAL_WEBSITE}/auth/refresh-token`, {
    refreshToken,
  });
  console.log("Full response from refresh-token:", response.data);
  if (!response.data.accessToken) {
    throw new Error("No accessToken in response from server");
  }
  const { accessToken } = response.data;
  console.log("Token mới nhận được:", accessToken);
  localStorage.setItem("accessToken", accessToken);
  return accessToken;
};

// Interceptor để kiểm tra token trước khi gửi yêu cầu
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken && checkTokenExpiration(accessToken)) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token on request:", error.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        window.location.href = "/login";
        throw error;
      }
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi 401 (dự phòng)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Failed to refresh token on response. Error details:",
          refreshError.response?.data || refreshError.message
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});
//SẢN PHẨM
export const handleProductApi = {
  getListProducts: async (key) => {
    return await api.get(`/${key}`, {
      headers: getAuthHeader(),
    });
  },
  //Cập nhật trạng thái sản phẩm
  updateProductStatus: async (productID, status) => {
    return await api.put(
      `/products/status/${productID}`,
      { status },
      {
        headers: getAuthHeader(),
      }
    );
  },
  //Tìm sản phẩm theo id
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  //Thêm sản phẩm mới
  addProduct: async (data) => {
    return await api.post("/products", data, {
      headers: getAuthHeader(),
    });
  },
  addCategory: async (data) => {
    return await api.post("/categories", data, {
      headers: getAuthHeader(),
    });
  },
  //Lấy danh sách danh mục
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  updateProduct: async (id, data) => {
    return await api.put(`/products/${id}`, data, {
      headers: getAuthHeader(),
    });
  },
  //Thêm phiếu nhập kho

  insertStockEntry: async (data) => {
    return await api.post("/stock-entries", data, {
      headers: getAuthHeader(),
    });
  },
  //Lấy thông tin nhập hàng
  getStockEntry: async (stockID) => {
    return await api.get(`/stock-entries/${stockID}`, {
      headers: getAuthHeader(),
    });
  },
  //Xóa hình ảnh trên cloud
  deleteImage: async (publicId) => {
    return await api.post(
      "/products/delete-image",
      { publicId },
      {
        headers: getAuthHeader(),
      }
    );
  },
};

//NGƯỜI DÙNG
export const handleUserApi = {
  //Lấy thông tin của người dùng
  getUserInfo: async (userID) => {
    return await api.get(`/user/${userID}`, {
      headers: getAuthHeader(),
    });
  },
  //Lấy danh sách người dùng
  getUsers: async () => {
    return await api.get("/user", {
      headers: getAuthHeader(),
    });
  },
  //Cập nhật thông tin người dùng
  updateUserInfo: async (userID, data) => {
    return await api.put(`/user/${userID}`, data, {
      headers: getAuthHeader(),
    });
  },
  //Cập nhật trạng thái người dùng
  updateUserStatus: async (userID, status) => {
    return await api.patch(
      `/user/${userID}/account-status`,
      { status },
      {
        headers: getAuthHeader(),
      }
    );
  },
};

//THÔNG BÁO
export const handleNotifyApi = {
  //Lấy danh sách thông báo

  getNotificationsByReceiver: async (receiverID) => {
    return await api.get(`/notifications/${receiverID}`, {
      headers: getAuthHeader(),
    });
  },
  markAsRead: async (notificationID) => {
    return await api.patch(
      `/notifications/${notificationID}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
  },

  createNotification: async (data) => {
    return await api.post("/notifications", data, {
      headers: getAuthHeader(),
    });
  },
  //Lấy thông báo của đơn hàng bị hủy
  getNotificationsByOrderId: async (orderID) => {
    return await api.get(`/notifications/order/${orderID}`, {
      headers: getAuthHeader(),
    });
  },
};

//ĐƠN HÀNG
export const handleOrderApi = {
  //Lấy thông tin đơn hàng theo ID
  getOrderById: async (orderID) => {
    return await api.get(`/orders/${orderID}`, {
      headers: getAuthHeader(),
    });
  },
  //Lấy danh sách đơn hàng theo userID
  getOrdersByUserId: async (userID) => {
    return await api.get(`/orders/user/${userID}`, {
      headers: getAuthHeader(),
    });
  },
  updateStatus: async (orderID, status, reduceInventory = false) => {
    return await api.put(
      `/orders/${orderID}`,
      { status, reduceInventory },
      {
        headers: getAuthHeader(),
      }
    );
  },
  //Lấy danh sách tất cva3 đơn hàng
  getAllOrders: async () => {
    return await api.get("/orders", {
      headers: getAuthHeader(),
    });
  },
  // Thêm đơn đặt hàng mới
  addOrder: async (orderData) => {
    try {
      // Log dữ liệu trước khi gửi
      console.log("API addOrder - dữ liệu gửi đi:", orderData);

      // Đảm bảo dữ liệu đúng định dạng
      const formattedData = {
        ...orderData,
        totalQuantity: parseInt(orderData.totalQuantity),
        totalAmount: parseInt(orderData.totalAmount),
        orderDetails: orderData.orderDetails.map((item) => ({
          ...item,
          quantity: parseInt(item.quantity),
        })),
      };

      const response = await api.post("/orders", formattedData, {
        headers: getAuthHeader(),
      });

      console.log("Đã tạo đơn hàng thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("API addOrder - lỗi:", error.response || error);
      throw error;
    }
  },
};
//THỐNG KÊ
export const handleStatisticApi = {
  // Thống kê doanh thu hàng ngày
  getDailyRevenue: async (date) => {
    return await api.get(`/statistics/daily?date=${date}`, {
      headers: getAuthHeader(),
    });
  },
  //Tình trạng doanh thu theo ngày
  getRevenueByPaymentMethod: async (date) => {
    return await api.get(`/statistics/revenue-by-payment-method?date=${date}`, {
      headers: getAuthHeader(),
    });
  },
  //Thống kê đơn hàng theo trạng thái
  getOrderStatsByStatus: async (day, month, year) => {
    return await api.get(
      `/statistics/order-status?day=${day}&month=${month}&year=${year}`,
      {
        headers: getAuthHeader(),
      }
    );
  },
  //Thống kê doanh thu theo năm
  getYearlyRevenue: async (year) => {
    // statistics/yearly-revenue?year=2025
    return await api.get(`/statistics/yearly-revenue?year=${year}`, {
      headers: getAuthHeader(),
    });
  },
  //Thống kê đơn hàng thành công theo tháng của năm
  getMonthlySuccessfulOrders: async (month, year) => {
    return await api.get(
      `/statistics/daily-orders?month=${month}&year=${year}`,
      {
        headers: getAuthHeader(),
      }
    );
  },

  //Lấy danh sách đơn hàng theo ngày, tháng và năm
  getOrderStatusByDate: async ({ day, month, year, status }) => {
    console.log("Tham số ngày:", day);
    console.log("Tham số tháng:", month);
    console.log("Tham số năm:", year);
    console.log("Tham số trạng thái:", status);

    const params = { year, status };
    if (day) params.day = day;
    if (month) params.month = month;
    console.log("Tham số truy vấn:", params);

    return await api.get("/statistics/orderbydateandstatus", {
      params,
      headers: getAuthHeader(),
    });
  },
};
// ĐÁNH GIÁ
export const handleReviewApi = {
  // Hàm tạo đánh giá
  createReview: async (data) => {
    return await reviewAPI.post("/reviews", data, {
      headers: getAuthHeader(),
    });
  },
  // Lấy tất cả đánh giá sản phẩm
  getAllReviews: async () => {
    return await reviewAPI.get("/reviews");
  },
};

//GIỎ HÀNG
export const handleShoppingCartApi = {
  // Lưu thông tin sản phẩm vào giỏ hàng
  saveShoppingCarts: async (orderData) => {
    return await api.post("/shopping-carts", orderData, {
      headers: getAuthHeader(),
    });
  },
  // Lấy giỏ hàng theo userID
  getShoppingCartByUserId: async (userID) => {
    return await api.get(`/shopping-carts/user/${userID}`, {
      headers: getAuthHeader(),
    });
  },
  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartQuantity: async (shoppingCartID, productID, quantity) => {
    return await api.patch(
      "/shopping-carts/update-quantity",
      {
        shoppingCartID,
        productID,
        quantity,
      },
      {
        headers: getAuthHeader(),
      }
    );
  },
  // Xóa chi tiết giỏ hàng theo shoppingCartDetailID - cập nhật theo API mới
  deleteShoppingCartDetailById: async (shoppingCartDetailID) => {
    return await api.patch(
      `/shopping-carts/remove-item/${shoppingCartDetailID}`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
  },
  // Xóa giỏ hàng theo ID
  deleteShoppingCartById: async (shoppingCartID) => {
    return await api.delete(`/shopping-carts/${shoppingCartID}`, {
      headers: getAuthHeader(),
    });
  },
};
//THANH TOÁN
export const handlePaymentApi = {
  // Tạo mã QR cho thanh toán
  createPayment: async (amount, orderID, paymentMethod) => {
    try {
      // Chuẩn bị dữ liệu gửi đi - không cần gửi content, để backend tự tạo
      const requestData = {
        amount,
        orderID,
        paymentMethod,
      };

      console.log("Gửi request tạo payment:", requestData);

      const response = await api.post("/payments/create", requestData, {
        headers: getAuthHeader(),
      });

      // Đảm bảo trả về đúng dữ liệu từ response
      console.log("Response từ API payment/create:", response.data);

      // Trả về đúng cấu trúc dữ liệu mà backend gửi về
      return response.data;
    } catch (error) {
      console.error("Error creating payment record:", error);
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (paymentID) => {
    try {
      const response = await api.post(
        "/payments/update-status",
        {
          paymentID: paymentID,
          newStatus: "Completed",
        },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  // Lấy danh sách thanh toán theo orderID
  getPaymentByOrderId: async (orderID) => {
    const response = await api.get(`/payments/${orderID}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
//Auth
export const handleAuthApi = {
  // Đăng nhập
  login: async (formData) => {
    return await api.post("/auth/login", formData);
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await api.post("/auth/refresh-token", {
        refreshToken,
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },

  // quên mật khẩu
  forgotPassword: async (emailqmk) => {
    try {
      // Gửi yêu cầu đến API với email dưới dạng query parameter
      const response = await api.post(
        `/auth/forgot-password?email=${encodeURIComponent(emailqmk)}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
      // Ném lỗi từ backend nếu có, hoặc trả về lỗi mặc định
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
  verifyOtp: async (emailqmk, otp) => {
    try {
      // Gửi email và otp dưới dạng query parameters
      const response = await api.post(
        `/auth/verify-otp-reset?email=${encodeURIComponent(
          emailqmk
        )}&otp=${encodeURIComponent(otp)}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi xác thực OTP:", error);
      // Ném lỗi từ backend nếu có, hoặc trả về lỗi mặc định
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
  // Đặt lại mật khẩu
  updatePassword: async (emailqmk, newPassword) => {
    try {
      // Gửi email và mật khẩu mới dưới dạng query parameters
      const response = await api.post(
        `/auth/update-password?email=${encodeURIComponent(
          emailqmk
        )}&newPassword=${encodeURIComponent(newPassword)}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      // Ném lỗi từ backend nếu có, hoặc trả về lỗi mặc định
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },

  //dk
  // Gửi mã OTP đến email
  sendOtp: async (email) => {
    try {
      const response = await api.post(
        `/auth/send-otp?email=${encodeURIComponent(email)}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);

      if (error.response) {
        // Ném lỗi từ backend
        throw (
          error.response.data || {
            message: "Không thể gửi mã OTP. Vui lòng thử lại.",
          }
        );
      } else {
        // Ném lỗi kết nối hoặc lỗi không xác định
        throw { message: "Lỗi kết nối đến máy chủ!" };
      }
    }
  },

  // Xác thực OTP
  verifyOtpforRegister: async (email, otp) => {
    try {
      const response = await api.post(
        `/auth/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`
      );
      return response.data; // Trả về thông báo từ API
    } catch (error) {
      console.error("Lỗi khi xác thực OTP:", error);

      // Kiểm tra lỗi từ backend
      if (error.response) {
        console.error("Phản hồi từ backend:", error.response.data);
        throw error.response.data; // Ném lỗi từ backend
      }

      // Lỗi kết nối hoặc lỗi không xác định
      throw { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
  changePassword: async (email, oldPassword, newPassword) => {
    try {
      const response = await api.post(
        `/auth/change-password?email=${encodeURIComponent(
          email
        )}&oldPassword=${encodeURIComponent(
          oldPassword
        )}&newPassword=${encodeURIComponent(newPassword)}`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
  getAddressesByUserId: async (userID) => {
    try {
      const response = await api.get(`/address`, {
        params: { userID },
      });
      return response.data; // Trả về danh sách địa chỉ
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },

  // Thêm địa chỉ mới
  addNewAddress: async (addressData) => {
    try {
      const response = await api.post("/address", addressData);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },

  // Đăng ký tài khoản
  register: async (userData) => {
    try {
      const response = await api.post(`/auth/register`, userData);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi đăng ký tài khoản:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
  // Cập nhật địa chỉ
  updateAddress: async (addressID, userID, addressData) => {
    try {
      const response = await api.put(
        `/address/${addressID}/${userID}`,
        addressData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (addressID, userID) => {
    try {
      const response = await api.delete(`/address/${addressID}/${userID}`, {
        headers: getAuthHeader(),
      });
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
};
//dang ky

export default api;
