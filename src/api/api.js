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
    return await productAPI.put(`/products/status/${productID}`, { status });
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
  //Lấy thông tin nhập hàng
  getStockEntry: async (stockID) => {
    return await productAPI.get(`/stock-entries/${stockID}`);
  },
  //Xóa hình ảnh trên cloud
  deleteImage: async (publicId) => {
    return await productAPI.post("/products/delete-image", { publicId });
  },
};

//NGƯỜI DUNG
export const handleUserApi = {
  //Lấy thông tin của người dùng
  getUserInfo: async (userID) => {
    return await userAPI.get(`/user/${userID}`);
  },
  //Lấy danh sách người dùng
  getUsers: async () => {
    return await userAPI.get("/user");
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
   updateStatus: async (orderID, updateData) => {
    try {
      // Truyền toàn bộ updateData trong body request
      const response = await orderAPI.put(`/orders/${orderID}`, updateData);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      throw error;
    }
  },
  //Lấy danh sách tất cva3 đơn hàng
  getAllOrders: async () => {
    return await orderAPI.get("/orders");
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

//THANH TOÁN
export const handlePaymentApi = {
  // Tạo mã QR cho thanh toán
  createPaymentQR: async (amount, orderID, paymentMethod) => {
    try {
      console.log(
        "API call: Creating payment QR for amount:",
        amount,
        "orderID:",
        orderID,
        "method:",
        paymentMethod
      );
      const response = await paymentAPI.post("/payments/create-qr", {
        amount,
        orderID,
        paymentMethod,
      });
      console.log("Payment QR API response:", response.data);

      if (response.data) {
        return {
          qrCodeUrl: response.data.qrURL,
          message: response.data.message,
          paymentId: response.data.paymentID,
          orderID: response.data.orderID,
          paymentMethod: response.data.paymentMethod,
          paymentStatus: response.data.paymentStatus,
          amount: response.data.amount,
          content: response.data.content,
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
        paymentMethod: paymentMethod || "Bank Transfer",
        content: "TT" + Math.floor(100000 + Math.random() * 900000), // Add random payment content like backend
      };
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (data) => {
    try {
      const response = await paymentAPI.post("/payments/update-status", {
        paymentID: data,
        newStatus: "Completed",
      });
      return response.data;
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw error;
    }
  },

  // Lấy danh sách thanh toán theo orderID
  getPaymentByOrderId: async (orderID) => {
    try {
      const response = await paymentAPI.get(`/payments/${orderID}`);
      return response;
    } catch (error) {
      console.error("Error fetching payment by order ID:", error);
      throw error;
    }
  },
};

export default api;
