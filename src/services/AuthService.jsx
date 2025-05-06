import { handleAuthApi } from "../api/api";

export const sendOtp = async (email) => {
  try {
    const response = await handleAuthApi.sendOtp(email);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    throw { message: "Phản hồi từ API không hợp lệ." };
  } catch (error) {
    if (error.email) {
      throw { email: error.email }; // Lỗi email không hợp lệ
    } else if (error.server) {
      throw { server: error.server }; // Lỗi server từ backend
    } else {
      console.error("Lỗi khi gọi API sendOtp:", error);
      throw { message: error.message || "Lỗi kết nối đến máy chủ!" };
    }
  }
};

export const verifyOtpforRegister = async (email, otp) => {
  try {
    const response = await handleAuthApi.verifyOtpforRegister(email, otp);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend nếu OTP hợp lệ
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    throw { message: "Phản hồi từ API không hợp lệ." };
  } catch (error) {
    if (error.errors?.otp) {
      throw { otp: error.errors.otp }; // Lỗi OTP không hợp lệ hoặc đã hết hạn
    } else if (error.errors?.server) {
      throw { server: error.errors.server }; // Lỗi server từ backend
    } else {
      console.error("Lỗi khi gọi API verifyOtp:", error);
      throw { message: error.message || "Lỗi kết nối đến máy chủ!" };
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await handleAuthApi.register(userData);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    // Xử lý lỗi cụ thể từ backend
    if (error.errors?.email) {
      throw { email: error.errors.email }; // Lỗi email chưa xác thực OTP
    } else if (error.errors?.username) {
      throw { username: error.errors.username }; // Lỗi tên người dùng không hợp lệ
    } else if (error.errors?.phone) {
      throw { phone: error.errors.phone }; // Lỗi số điện thoại không hợp lệ
    } else if (error.errors?.password) {
      throw { password: error.errors.password }; // Lỗi mật khẩu không hợp lệ
    } else if (error.errors?.server) {
      throw { server: error.errors.server }; // Lỗi server từ backend
    } else {
      console.error("Lỗi khi gọi API register:", error);
      throw new Error(error.message || "Lỗi kết nối đến máy chủ!");
    }
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
export const forgotPassword = async (emailqmk) => {
  try {
    const response = await handleAuthApi.forgotPassword(emailqmk);
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
export const verifyOtp = async (emailqmk, otp) => {
  try {
    const response = await handleAuthApi.verifyOtp(emailqmk, otp);
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
export const updatePassword = async (emailqmk, newPassword) => {
  try {
    const response = await handleAuthApi.updatePassword(emailqmk, newPassword);
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
export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await handleAuthApi.changePassword(email, oldPassword, newPassword);
    if (response && response.message) {
      return response.message; // Trả về thông báo từ backend
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    throw { message: "Phản hồi từ API không hợp lệ." };
  } catch (error) {
    if (error.errors?.email) {
      throw { email: error.errors.email }; // Lỗi email không hợp lệ
    } else if (error.errors?.oldPassword) {
      throw { oldPassword: error.errors.oldPassword }; // Lỗi mật khẩu cũ không hợp lệ
    } else if (error.errors?.newPassword) {
      throw { newPassword: error.errors.newPassword }; // Lỗi mật khẩu mới không hợp lệ
    } else if (error.errors?.server) {
      throw { server: error.errors.server }; // Lỗi server từ backend
    } else {
      console.error("Lỗi khi gọi API changePassword:", error);
      throw { message: error.message || "Lỗi kết nối đến máy chủ!" };
    }
  }
};