import { handleAuthApi } from "../api/api";

export const register = async (userData) => {
  try {
    const response = await handleAuthApi.register(userData);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu người dùng đã đăng ký
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API register:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

export const login = async (credentials) => {
  try {
    const response = await handleAuthApi.login(credentials);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu người dùng đã đăng nhập
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API login:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
