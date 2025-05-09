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
//Authentication
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    return await productAPI.put(`/products/status/${productID}`, {
      status,
      headers: getAuthHeader(),
    });
  },
  //Tìm sản phẩm theo id
  getProductById: async (id) => {
    return await productAPI.get(`/products/${id}`);
  },

  //Thêm sản phẩm mới
  addProduct: async (data) => {
    return await productAPI.post("/products", data, {
      headers: getAuthHeader(),
    });
  },
  addCategory: async (data) => {
    return await productAPI.post("/categories", data, {
      headers: getAuthHeader(),
    });
  },
  //Lấy danh sách danh mục
  getCategories: async () => {
    const response = await productAPI.get("/categories");
    return response.data;
  },
  updateProduct: async (id, data) => {
    return await productAPI.put(`/products/${id}`, data);
  },
  //Thêm phiếu nhập kho

  insertStockEntry: async (data) => {
    return await productAPI.post("/stock-entries", data);
  },
  //Lấy thông tin nhập hàng
  getStockEntry: async (stockID) => {
    return await productAPI.get(`/stock-entries/${stockID}`);
  },
  //Xóa hình ảnh trên cloud
  deleteImage: async (publicId) => {
    return await productAPI.post("/products/delete-image", { publicId });
  },
};

//NGƯỜI DÙNG
export const handleUserApi = {
  //Lấy thông tin của người dùng
  getUserInfo: async (userID) => {
    return await userAPI.get(`/user/${userID}`, {
      headers: getAuthHeader(),
    });
  },
  //Lấy danh sách người dùng
  getUsers: async () => {
    return await userAPI.get("/user", {
      headers: getAuthHeader(),
    });
  },
  //Cập nhật thông tin người dùng
  updateUserInfo: async (userID, data) => {
    return await userAPI.put(`/user/${userID}`, data);
  },
};

//THÔNG BÁO
export const handleNotifyApi = {
  //Lấy danh sách thông báo

  getNotificationsByReceiver: async (receiverID) => {
    return await notifyAPI.get(`/notifications/${receiverID}`, {
      headers: getAuthHeader(),
    });
  },
  markAsRead: async (notifyID) => {
    return await notifyAPI.patch(`/notifications/${notifyID}/read`, {
      headers: getAuthHeader(),
    });
  },
  createNotification: async (data) => {
    return await notifyAPI.post("/notifications", data);
  },
};

//ĐƠN HÀNG
export const handleOrderApi = {
  //Lấy thông tin đơn hàng theo ID
  getOrderById: async (orderID) => {
    return await orderAPI.get(`/orders/${orderID}`, {
      headers: getAuthHeader(),
    });
  },
  //Lấy danh sách đơn hàng theo userID
  getOrdersByUserId: async (userID) => {
    return await orderAPI.get(`/orders/user/${userID}`);
  },
  updateStatus: async (orderID, status) => {
    return await orderAPI.put(`/orders/${orderID}`, { status });
  },
  //Lấy danh sách tất cva3 đơn hàng
  getAllOrders: async () => {
    return await orderAPI.get("/orders");
  },
  // 🟢 Thêm đơn đặt hàng mới
  addOrder: async (orderData) => {
    return await orderAPI.post("/orders", orderData);
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
// ĐÁNH GIÁ
export const handleReviewApi = {
  // Hàm tạo đánh giá
  createReview: async (data) => {
    return await reviewAPI.post("/reviews", data);
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
    return await shoppingCartAPI.post("/shopping-carts", orderData);
  },
  // Lấy giỏ hàng theo userID
  getShoppingCartByUserId: async (userID) => {
    return await shoppingCartAPI.get(`/shopping-carts/user/${userID}`, {
      headers: getAuthHeader(),
    });
  },
  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartQuantity: async (shoppingCartID, productID, quantity) => {
    return await shoppingCartAPI.patch("/shopping-carts/update-quantity", {
      shoppingCartID,
      productID,
      quantity,
    });
  },
  // Xóa chi tiết giỏ hàng theo shoppingCartDetailID
  deleteShoppingCartDetailById: async (shoppingCartDetailID) => {
    return await shoppingCartAPI.delete(
      `/shopping-carts/shopping-cart-details/${shoppingCartDetailID}`
    );
  },
};
//THANH TOÁN
export const handlePaymentApi = {
  // Tạo mã QR cho thanh toán
  createPaymentQR: async (amount, orderID, paymentMethod) => {
    const response = await paymentAPI.post("/payments/create-qr", {
      amount,
      orderID,
      paymentMethod,
    });
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (data) => {
    const response = await paymentAPI.post("/payments/update-status", {
      paymentID: data,
      newStatus: "Completed",
    });
    return response.data;
  },

  // Lấy danh sách thanh toán theo orderID
  getPaymentByOrderId: async (orderID) => {
    const response = await paymentAPI.get(`/payments/${orderID}`);
    return response.data;
  },
};
//Auth
export const handleAuthApi = {
  // Đăng nhập
  login: async (formData) => {
    return await auth.post("/auth/login", formData);
  },

  // quên mật khẩu
  forgotPassword: async (emailqmk) => {
    try {
      // Gửi yêu cầu đến API với email dưới dạng query parameter
      const response = await auth.post(
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
      const response = await auth.post(
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
      const response = await auth.post(
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
      const response = await auth.post(
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
      const response = await auth.post(
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
      const response = await auth.post(
        `/auth/change-password?email=${encodeURIComponent(
          email
        )}&oldPassword=${encodeURIComponent(
          oldPassword
        )}&newPassword=${encodeURIComponent(newPassword)}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
  getAddressesByUserId: async (userID) => {
    try {
      const response = await address.get(`/address`, {
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
      const response = await address.post("/address", addressData);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },

  // Đăng ký tài khoản
  register: async (userData) => {
    try {
      const response = await auth.post(`/auth/register`, userData);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Lỗi khi đăng ký tài khoản:", error);
      throw error.response?.data || { message: "Lỗi kết nối đến máy chủ!" };
    }
  },
};
//dang ky

export default api;
