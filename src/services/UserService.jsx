import { handleAuthApi, handleUserApi } from "../api/api";

//Lấy thông tin của người dùng
export const getUserInfo = async (userID) => {
  try {
    const response = await handleUserApi.getUserInfo(userID);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu người dùng
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getUserInfo:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
//Cập nhật thông tin người dùng
export const updateUserInfo = async (userID, userData) => {
  try {
    const response = await handleUserApi.updateUserInfo(userID, userData);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu người dùng đã cập nhật
    }
  } catch (error) {
    console.error("Lỗi khi gọi API updateUserInfo:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

//Lấy danh sách người dùng
export const getListUsers = async () => {
  try {
    const response = await handleUserApi.getUsers();
    if (response && response.data) {
      return response.data; // Trả về danh sách người dùng
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getUsers:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

//Lấy danh sách đơn hàng của người dùng
export const getAddressesByUserId = async (userID) => {
  try {
    const addresses = await handleAuthApi.getAddressesByUserId(userID);
    return addresses; // Trả về danh sách địa chỉ
  } catch (error) {
    console.error("Lỗi khi gọi API getAddressesByUserId:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Thêm địa chỉ mới
export const addNewAddress = async (addressData) => {
  try {
    const newAddress = await handleAuthApi.addNewAddress(addressData);
    return newAddress; // Trả về địa chỉ mới
  } catch (error) {
    console.error("Lỗi khi gọi API addNewAddress:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

//Cập nhật trạng thái người dùng
export const updateUserStatus = async (userID, status) => {
  try {
    const response = await handleUserApi.updateUserStatus(userID, status);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu người dùng đã cập nhật
    }
  } catch (error) {
    console.error("Lỗi khi gọi API updateUserStatus:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (addressID, userID, addressData) => {
  try {
    const response = await handleAuthApi.updateAddress(
      addressID,
      userID,
      addressData
    );
    return response; // Trả về kết quả từ API
  } catch (error) {
    console.error("Lỗi khi gọi API updateAddress:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Xóa địa chỉ
export const deleteAddress = async (addressID, userID) => {
  try {
    const response = await handleAuthApi.deleteAddress(addressID, userID);
    return response; // Trả về kết quả từ API
  } catch (error) {
    console.error("Lỗi khi gọi API deleteAddress:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
