import { handleNotifyApi } from "../api/api";
import { message } from "antd";

// Hàm lấy danh sách thông báo từ API
export const getNotify = async (userID) => {
  try {
    const response = await handleNotifyApi.getNotificationsByReceiver(userID);
    if (response && response.data) {
      return response.data; // Trả về danh sách thông báo
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API getNotify:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Đánh dấu thông báo là đã đọc
export const readNotify = async (notificationID) => {
  try {
    const response = await handleNotifyApi.markAsRead(notificationID);
    if (response && response.data) {
      return response.data; // Trả về thông báo đã được đánh dấu là đã đọc
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API readNotify:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Hàm tải thông báo với các tham số để tái sử dụng
export const fetchNotifications = async (
  userID,
  page,
  setNotifies,
  setHasMore,
  setLoading
) => {
  if (setLoading) setLoading(true);

  try {
    const response = await getNotify(userID);

    if (response && response.length > 0) {
      // setNotifies((prev) => [...prev, ...response]);
      setNotifies(response);
      if (setHasMore) setHasMore(true);
    } else {
      if (setHasMore) setHasMore(false);
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    message.error("Không thể tải thông báo!");
  } finally {
    if (setLoading) setLoading(false);
  }
};
