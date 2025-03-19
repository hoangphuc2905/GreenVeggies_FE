import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import PropTypes from "prop-types";
import { saveShoppingCarts } from "../../../api/api";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const ListProductByCatelogyID = ({
  allProducts,
  categoryId,
  minPrice,
  maxPrice,
  currentPage,
  setCurrentPage,
  pageSize,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filterProductsByCategory = () => {
      const filteredProducts = allProducts.filter((product) => {
        return (
          product.category._id === categoryId &&
          product.status !== "unavailable" &&
          calculateSellingPrice(product.price) >= minPrice &&
          calculateSellingPrice(product.price) <= maxPrice
        );
      });
      setProducts(filteredProducts);
      setLoading(false);
    };

    filterProductsByCategory();
  }, [allProducts, categoryId, minPrice, maxPrice]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const calculateSellingPrice = (price) => {
    return price * 1.5;
  };

  const addToWishlist = async (product) => {
    const userID = localStorage.getItem("userID"); // Lấy userID từ localStorage
    const imageUrl = Array.isArray(product.imageUrl)
      ? product.imageUrl[0]
      : product.imageUrl; // Lấy hình ảnh đầu tiên nếu imageUrl là mảng
    const newWishlistItem = {
      userID: userID,
      items: [
        {
          productID: product.productID, // Đảm bảo sử dụng đúng thuộc tính productID
          name: product.name, // Thêm tên sản phẩm
          quantity: 1,
          description: product.description,
          price: calculateSellingPrice(product.price),
          imageUrl: imageUrl,
        },
      ],
      totalPrice: calculateSellingPrice(product.price) * 1,
    };
    try {
      console.log("New Wishlist Item:", newWishlistItem); // In ra dữ liệu gửi đi
      await saveShoppingCarts(newWishlistItem); // Gọi API để lưu thông tin sản phẩm vào order

      // Lưu sản phẩm vào localStorage
      const currentWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];
      const existingItemIndex = currentWishlist.findIndex(
        (item) => item.productID === product.productID // Đảm bảo sử dụng đúng thuộc tính productID
      );

      if (existingItemIndex !== -1) {
        // Sản phẩm đã tồn tại, tăng số lượng
        currentWishlist[existingItemIndex].quantity += 1;
      } else {
        // Sản phẩm chưa tồn tại, thêm sản phẩm mới
        currentWishlist.push(newWishlistItem.items[0]);
      }

      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));

      // Phát ra sự kiện cập nhật giỏ hàng
      const event = new CustomEvent("wishlistUpdated", {
        detail: currentWishlist.length,
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] bg-clip-text text-transparent cursor-pointer">
          Sản phẩm thuộc danh mục: {products[0]?.category?.name}
        </h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => {
                const averageRating =
                  product.reviews?.length > 0
                    ? product.reviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                      ) / product.reviews.length
                    : 0;
                return (
                  <div
                    key={product.productID} // Thêm key cho mỗi sản phẩm
                    className="p-4 bg-white rounded-sm shadow-md ml-4 h-[300px] relative hover:shadow-xl hover:scale-105">
                    {product.discount && (
                      <div className="absolute top-0 left-0 bg-[#82AE46] text-white px-2 py-1 rounded-br-lg">
                        {product.discount}%
                      </div>
                    )}

                    <div className="container mx-auto relative h-[150px] group">
                      {/* Image */}
                      <img
                        src={
                          Array.isArray(product.imageUrl)
                            ? product.imageUrl[0]
                            : product.imageUrl
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                      />

                      {/* Icons on hover */}
                      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        {/* Icon "Xem chi tiết" - left */}
                        <Link
                          to={`/product/${product._id}`}
                          key={product.productID} // Thêm key cho mỗi phần tử Link
                          state={{ productID: product.productID }}
                          className="flex flex-col items-center text-gray-500 hover:text-[#82AE46] transition-transform transform hover:scale-125">
                          <i className="fas fa-info-circle text-3xl"></i>
                          <p className="text-xs mt-2">
                            <EyeOutlined />
                            Xem chi tiết
                          </p>
                        </Link>

                        {/* Icon "Thêm vào giỏ hàng" - right */}
                        <button
                          onClick={() =>
                            product.quantity > 0 && addToWishlist(product)
                          } // Only call addToWishlist if quantity > 0
                          disabled={product.quantity === 0} // Disable the button if quantity is 0
                          className={`flex flex-col items-center ${
                            product.quantity === 0
                              ? "text-gray-300 cursor-not-allowed" // Styles for disabled state
                              : "text-gray-500 hover:text-[#82AE46] transition-transform transform hover:scale-125" // Styles for enabled state
                          }`}>
                          <i className="fas fa-cart-plus text-3xl"></i>
                          <p className="text-xs mt-2">
                            <ShoppingCartOutlined /> Thêm vào giỏ hàng
                          </p>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 font-bold text-center overflow-hidden text-ellipsis line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-gray-700 text-center">
                      {product.oldPrice && (
                        <span className="line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                      <span className="text-gray-700">
                        {formatPrice(calculateSellingPrice(product.price))}
                      </span>
                    </p>
                    <div className="absolute bottom-2 right-2 text-gray-700 text-xs px-2 py-1 rounded-md">
                      Đã bán: {product.sold}
                    </div>
                    <div className="absolute bottom-2 left-2 text-gray-700 text-xs px-2 py-1 rounded-md">
                      Đánh giá: {averageRating.toFixed(1)}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Không có sản phẩm nào trong danh mục này.</p>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mt-6 text-[#82AE46]">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={products.length}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

ListProductByCatelogyID.propTypes = {
  allProducts: PropTypes.array.isRequired,
  categoryId: PropTypes.string.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
};

export default ListProductByCatelogyID;
