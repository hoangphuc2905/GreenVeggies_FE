import { handleProductApi } from "../api/api";
import updateStatus from "../components/updateProduct/updateStatus";

//Lấy danh sách sản phẩm từ API và cập nhật trạng thái sản phẩm
export const getProducts = async () => {
  try {
    const response = await handleProductApi.getAllProducts();

    // Cập nhật trạng thái sản phẩm nếu cần
    const updatedProducts = await Promise.all(
      response.map(async (product) => {
        if (product.quantity === 0 && product.status !== "out_of_stock") {
          try {
            await updateProductStatus(product.productID, "out_of_stock");
            return { ...product, status: "out_of_stock" };
          } catch (error) {
            console.error(
              `Lỗi cập nhật trạng thái sản phẩm ${product.name}:`,
              error
            );
          }
        } else if (product.status === "out_of_stock" && product.quantity > 0) {
          try {
            await updateProductStatus(product.productID, "available");
            return { ...product, status: "available" };
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
    console.error("Lỗi khi lấy và cập nhật sản phẩm:", error);
    return [];
  }
};

//Cập nhật trạng thái sản phẩm
export const updateProductStatus = async (productID, status) => {
  try {
    const response = await handleProductApi.updateProductStatus(
      productID,
      status
    );
    if (response) {
      return response;
    }
    console.error("API không trả về dữ liệu hợp lệ khi cập nhật trạng thái");
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API updateProductStatus:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

//Lấy danh sách các danh mục sản phẩm từ API
export const getCategories = async () => {
  try {
    return await handleProductApi.getCategories();
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    return [];
  }
};

// Lấy danh sách danh mục từ sản phẩm
export const getCategoriesFromProducts = async () => {
  try {
    const products = await handleProductApi.getAllProducts();
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục từ sản phẩm:", error);
    return [];
  }
};

//Tìm sản phẩm theo id
export const getProductById = async (id) => {
  try {
    const product = await handleProductApi.getProductById(id);
    if (product) {
      return product;
    }
    console.error("API không trả về dữ liệu hợp lệ khi lấy sản phẩm theo ID");
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API getProductById:", error);
    return { error: "Lỗi kết nối đến máy chủ!" };
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
      return response.data;
    }
    console.error("API không trả về dữ liệu hợp lệ khi thêm sản phẩm");
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API addProduct:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

//Thêm danh mục mới
export const addCategory = async (values) => {
  try {
    const response = await handleProductApi.addCategory(values);
    if (response && response.data) {
      return response.data;
    }
    console.error("API không trả về dữ liệu hợp lệ khi thêm danh mục");
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API addCategory:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (productID, values) => {
  try {
    // Xử lý danh sách hình ảnh
    const imageUrls =
      values.imageUrl?.map((file) => file.url || file.response?.url) || [];

    // Chuẩn bị dữ liệu gửi lên API
    const formData = {
      name: values.name,
      description: values.description,
      origin: values.origin,
      imageUrl: imageUrls,
      category: values.category,
      unit: values.unit,
      status: values.status,
      price: values.price,
    };

    // Gọi API cập nhật sản phẩm
    const response = await handleProductApi.updateProduct(productID, formData);
    if (response && response.data) {
      return response.data;
    }
    console.error("API không trả về dữ liệu hợp lệ khi cập nhật sản phẩm");
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API updateProduct:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

//Thêm phiếu nhập hàng
export const insertStockEntry = async (values) => {
  try {
    // Chuẩn bị dữ liệu
    const formData = {
      productID: values.productID,
      entryPrice: values.entryPrice,
      entryQuantity: values.entryQuantity,
    };

    const response = await handleProductApi.insertStockEntry(formData);
    if (response && response.data) {
      return response.data;
    }
    console.error("API không trả về dữ liệu hợp lệ khi thêm phiếu nhập");
    return null;
  } catch (error) {
    console.error("Lỗi khi gọi API insertStockEntry:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

// Xóa hình ảnh
export const deleteImage = async (publicId) => {
  try {
    return await handleProductApi.deleteImage(publicId);
  } catch (error) {
    console.error("Lỗi khi xóa hình ảnh:", error);
    return null;
  }
};

// Lấy tất cả sản phẩm không cập nhật trạng thái
export const getAllProducts = async () => {
  try {
    return await handleProductApi.getAllProducts();
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    return [];
  }
};

// Tính giá đã giảm của sản phẩm (nếu có)
export const calcSoldPrice = (originalPrice, discount = 0) => {
  if (!originalPrice) return 0;
  const price = Number(originalPrice);
  if (isNaN(price)) return 0;

  return discount > 0 ? price * (1 - discount / 100) : price;
};

// Format giá thành chuỗi có định dạng
export const formatPrice = (price) => {
  if (!price) return "0 VND";
  return price.toLocaleString() + " VND";
};
