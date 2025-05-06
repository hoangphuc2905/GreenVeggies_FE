import { handleShoppingCartApi } from "../api/api";

// Lưu thông tin sản phẩm vào giỏ hàng
export const saveShoppingCarts = async (orderData) => {
  try {
    const response = await handleShoppingCartApi.saveShoppingCarts(orderData);
    if (response && response.data) {
      return response.data;
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Lỗi từ BE:", error.response.data.message);
      return { error: error.response.data.message };
    }
    console.error("Lỗi khi lưu thông tin sản phẩm vào giỏ hàng:", error);
    return { error: "Lỗi kết nối đến máy chủ!" };
  }
};

// Lấy giỏ hàng theo userID
export const getShoppingCartByUserId = async (userID) => {
  try {
    const response = await handleShoppingCartApi.getShoppingCartByUserId(
      userID
    );
    if (response && response.data) {
      return response.data;
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Lỗi từ BE:", error.response.data.message);
      return { error: error.response.data.message };
    }
    console.error("Lỗi khi lấy giỏ hàng theo userID:", error);
    return { error: "Lỗi kết nối đến máy chủ!" };
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartQuantity = async (
  shoppingCartID,
  productID,
  quantity
) => {
  try {
    const response = await handleShoppingCartApi.updateCartQuantity(
      shoppingCartID,
      productID,
      quantity
    );
    if (response && response.data) {
      return response.data;
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Lỗi từ BE:", error.response.data.message);
      return { error: error.response.data.message };
    }
    console.error("Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng:", error);
    return { error: "Lỗi kết nối đến máy chủ!" };
  }
};

// Xóa chi tiết giỏ hàng theo shoppingCartDetailID
export const deleteShoppingCartDetailById = async (shoppingCartDetailID) => {
  try {
    const response = await handleShoppingCartApi.deleteShoppingCartDetailById(
      shoppingCartDetailID
    );
    if (response && response.data) {
      return response.data;
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Lỗi từ BE:", error.response.data.message);
      return { error: error.response.data.message };
    }
    console.error("Lỗi khi xóa chi tiết giỏ hàng:", error);
    return { error: "Lỗi kết nối đến máy chủ!" };
  }
};
