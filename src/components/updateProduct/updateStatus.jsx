import { updateProductStatus } from "../../services/ProductService";

const updateStatus = async (id, status) => {
  try {
    // Gọi API để cập nhật trạng thái sản phẩm
    const response = await updateProductStatus(id, status);

    if (response && response.status === 200) {
      return response.data; // Trả về dữ liệu sản phẩm đã cập nhật
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    throw new Error("API không trả về dữ liệu hợp lệ.");
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }

    console.error("Lỗi khi gọi API updateStatus:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

export default updateStatus;
