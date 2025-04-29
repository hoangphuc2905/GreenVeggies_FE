import { handleUserApi } from "../api/api";

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
