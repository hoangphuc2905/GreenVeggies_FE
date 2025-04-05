import { handleProductApi } from "../api/api";
import updateStatus from "../components/updateProduct/updateStatus";

//Lấy danh sách sản phẩm từ API và cập nhật trạng thái sản phẩm
export const getProducts = async () => {
  try {
    const response = await handleProductApi.getListProducts("products");

    // Cập nhật trạng thái sản phẩm nếu cần
    const updatedProducts = await Promise.all(
      response.map(async (product) => {
        if (product.quantity === 0 && product.status !== "out_of_stock") {
          try {
            updateStatus(product.productID, "out_of_stock"); // Cập nhật trạng thái sản phẩm
            return { ...product, status: "out_of_stock" }; // Cập nhật trạng thái trong danh sách
          } catch (error) {
            console.error(
              `Lỗi cập nhật trạng thái sản phẩm ${product.name}:`,
              error
            );
          }
        } else if (product.status === "out_of_stock" && product.quantity > 0) {
          try {
            updateStatus(product.productID, "available"); // Cập nhật trạng thái sản phẩm
            return { ...product, status: "available" }; // Cập nhật trạng thái trong danh sách
          } catch (error) {
            console.error(
              `Lỗi cập nhật trạng thái sản phẩm ${product.name}:`,
              error
            );
          }
        }
        return product;
      })
    );

    return updatedProducts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

//Lấy danh sách các danh mục sản phẩm từ API
export const getCategories = async () => {
  try {
    const response = await handleProductApi.getListProducts("categories");
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

//Tìm sản phẩm theo id
export const getProductById = async (id) => {
  try {
    // Gọi API lấy thông tin sản phẩm theo id
    const response = await handleProductApi.getProductById(id);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu sản phẩm
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Xử lý lỗi từ BE nếu có
      console.error("Lỗi từ BE:", error.response.data.message);
      return { error: error.response.data.message }; // Trả về lỗi từ BE
    }
    console.error("Lỗi khi gọi API getProductById:", error);
    return { error: "Lỗi kết nối đến máy chủ!" }; // Trả về lỗi kết nối
  }
};
// Thêm sản phẩm mới
export const addProduct = async (values) => {
  try {
    // Xử lý danh sách hình ảnh
    const imageUrls =
      values.imageUrl?.map((file) => file.url || file.response?.url) || [];

    // Chuẩn bị dữ liệu gửi lên API
    const formData = {
      name: values.name,
      description: values.description,
      price: values.price,
      quantity: values.import,
      import: values.import,
      category: values.category,
      origin: values.origin,
      imageUrl: imageUrls,
      unit: values.unit,
      status: values.status,
    };

    // Gọi API thêm sản phẩm
    const response = await handleProductApi.addProduct(formData);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu sản phẩm vừa thêm
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      // Ném lỗi chứa danh sách lỗi từ BE
      throw error.response.data.errors;
    }
    console.error("Lỗi khi gọi API addProduct:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
//Thêm danh mục mới
export const addCategory = async (values) => {
  try {
    // Gọi API thêm danh mục
    const response = await handleProductApi.addCategory(values);
    if (response && response.data) {
      return response.data; // Trả về dữ liệu danh mục vừa thêm
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    if (error.response && error.response.data) {
      // Trả về thông báo lỗi từ BE nếu có
      throw error; // Ném lỗi để Frontend xử lý
    }
    console.error("Lỗi khi gọi API addCategory:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};
