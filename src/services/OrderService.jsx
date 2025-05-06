import { handleOrderApi } from "../api/api";

export const getOrderById = async (orderID) => {
  try {
    const response = await handleOrderApi.getOrderById(orderID);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu đơn hàng
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API getOrderById:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

export const getOrdersByUserId = async (userID) => {
  try {
    const response = await handleOrderApi.getOrdersByUserId(userID);
    if (response && response.data) {
      console.log("Danh sách đơn hàng:", response.data); // In ra danh sách đơn hàng
      return response.data; // Trả về danh sách đơn hàng
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API getOrdersByUserId:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
// Cập nhật trạng thái đơn hàng
export const updateStatus = async (orderID, newStatus) => {
  try {
    const response = await handleOrderApi.updateStatus(orderID, newStatus);
    if (response && response.data) {
      console.log("Cập nhật trạng thái thành công:", response.data); // In ra thông báo thành công
      return response.data; // Trả về dữ liệu cập nhật
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API updateStatus:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
//Lấy danh sách dơn hàng từ API
export const getOrders = async () => {
  try {
    const response = await handleOrderApi.getAllOrders();
    if (response && response.data) {
      return response.data; // Trả về danh sách đơn hàng
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API getOrders:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
//Thêm đơn hàng mới
export const addOrder = async (orderData) => {
  try {
    const response = await handleOrderApi.addOrder(orderData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm đơn đặt hàng:", error);
    return null;
  }
};
