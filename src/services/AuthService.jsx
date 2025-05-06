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

export const login = async (formData) => {
  try {
    const response = await handleAuthApi.login(formData);
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
export const forgotPassword = async (email) => {
  try {
    const response = await handleAuthApi.forgotPassword(email);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.errors?.email) {
      // Ném lỗi email từ backend
      throw { email: error.errors.email };
    } else if (error.errors?.server) {
      // Ném lỗi server từ backend
      throw { server: error.errors.server };
    } else {
      console.error("Lỗi khi gọi API forgotPassword:", error);
      throw new Error(error.message || "Lỗi kết nối đến máy chủ!");
    }
  }
};
export const verifyOtp = async (email, otp) => {
  try {
    const response = await handleAuthApi.verifyOtp(email, otp);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.errors?.otp) {
      throw { otp: error.errors.otp }; // Ném lỗi OTP từ backend
    } else if (error.errors?.server) {
      throw { server: error.errors.server }; // Ném lỗi server từ backend
    } else {
      console.error("Lỗi khi gọi API verifyOtp:", error);
      throw new Error(error.message || "Lỗi kết nối đến máy chủ!");
    }
  }
};
export const updatePassword = async (email, newPassword) => {
  try {
    const response = await handleAuthApi.updatePassword(email, newPassword);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.errors?.email) {
      throw { email: error.errors.email }; // Ném lỗi email từ backend
    } else if (error.errors?.newPassword) {
      throw { newPassword: error.errors.newPassword }; // Ném lỗi mật khẩu từ backend
    } else if (error.errors?.server) {
      throw { server: error.errors.server }; // Ném lỗi server từ backend
    } else {
      console.error("Lỗi khi gọi API updatePassword:", error);
      throw new Error(error.message || "Lỗi kết nối đến máy chủ!");
    }
  }
};
