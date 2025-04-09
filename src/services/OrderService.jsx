
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
    }
