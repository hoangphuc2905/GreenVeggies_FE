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
    const response = await handleProductApi.getProductById(id);
    return response; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error("Lỗi khi gọi API getProductById:", error);
    return null;
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
    if (response) {
      return response; // Trả về dữ liệu sản phẩm vừa thêm
    }

    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API addProduct:", error);
    return null;
  }
};
