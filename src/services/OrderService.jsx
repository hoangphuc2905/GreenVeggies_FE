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
      // Log the entire response to see its structure
      console.log("API response structure:", response);
      return response.data; // Trả về danh sách đơn hàng
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API getOrdersByUserId:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
// Cập nhật trạng thái đơn hàng
export const updateStatus = async (orderID, updateData) => {
  try {
    // Nếu updateData là string, chuyển thành đối tượng { status: updateData }
    const payload =
      typeof updateData === "string" ? { status: updateData } : updateData;

    console.log("Gửi yêu cầu cập nhật trạng thái:", orderID, payload);

    const response = await handleOrderApi.updateStatus(orderID, payload);

    if (response && response.data) {
      console.log("Cập nhật trạng thái thành công:", response.data);
      return response.data;
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
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
