import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pagination,
  notification,
  Card,
  List,
  Badge,
  Typography,
  Button,
  Spin,
} from "antd";

import PropTypes from "prop-types";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { saveShoppingCarts } from "../../../services/ShoppingCartService";
import {
  formattedPrice,
  CalcPrice,
} from "../../../components/calcSoldPrice/CalcPrice";
import { getProducts } from "../../../services/ProductService";

// Custom style for notifications
const customNotificationStyle = `
  .custom-notification {
    margin-top: 50px !important;
  }
  .custom-notification .ant-notification-notice-message {
    margin-bottom: 4px !important;
    font-size: 18px !important;
    font-weight: 500 !important;
  }
  .custom-notification .ant-notification-notice-description {
    margin-left: 0 !important;
    margin-right: 0 !important;
    font-size: 18px !important;
  }
  .custom-notification .ant-notification-notice-with-icon .ant-notification-notice-message, 
  .custom-notification .ant-notification-notice-with-icon .ant-notification-notice-description {
    margin-left: 24px !important;
  }
  .custom-notification .ant-notification-notice-icon {
    margin-left: 8px !important;
    font-size: 18px !important;
  }
  .custom-notification .ant-notification-notice-close {
    top: 6px !important;
    right: 6px !important;
  }
  .custom-notification .ant-notification-notice {
    padding: 8px !important;
    width: 260px !important; /* Giảm từ 280px xuống 260px */
    max-width: 260px !important; /* Giảm từ 280px xuống 260px */
    margin-right: 8px !important;
  }
  .custom-notification img {
    width: 48px !important;
    height: 48px !important;
  }
  .custom-notification .ant-btn-sm {
    font-size: 14px !important;
    height: 24px !important;
    padding: 0px 8px !important;
  }
`;

const ListProduct = ({
  minPrice,
  maxPrice,
  searchQuery,
  currentPage,
  setCurrentPage,
}) => {
  const [products, setProducts] = useState([]);
  const [pageSize] = useState(24);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure notification globally
  useEffect(() => {
    notification.config({
      top: 100,
      duration: 4,
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response && response) {
          setProducts(response);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const filteredBySearch = products.filter((product) =>
    removeAccents(product.name.toLowerCase()).includes(
      removeAccents(searchQuery.toLowerCase())
    )
  );

  const filteredByPrice = products.filter(
    (product) =>
      CalcPrice(product.price) >= minPrice &&
      CalcPrice(product.price) <= maxPrice
  );

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;

  const currentProducts = searchQuery
    ? filteredBySearch.slice(indexOfFirstProduct, indexOfLastProduct)
    : filteredByPrice.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Cuộn lên đầu trang khi thay đổi trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToWishlist = async (product) => {
    const userID = localStorage.getItem("userID");
    const imageUrl = Array.isArray(product.imageUrl)
      ? product.imageUrl[0]
      : product.imageUrl;
    const newWishlistItem = {
      userID: userID,
      items: [
        {
          productID: product.productID,
          name: product.name,
          quantity: 1,
          description: product.description,
          price: CalcPrice(product.price),
          imageUrl: imageUrl,
        },
      ],
      totalPrice: CalcPrice(product.price) * 1,
    };
    try {
      await saveShoppingCarts(newWishlistItem);

      const currentWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];
      const existingItemIndex = currentWishlist.findIndex(
        (item) => item.productID === product.productID
      );

      if (existingItemIndex !== -1) {
        currentWishlist[existingItemIndex].quantity += 1;
      } else {
        currentWishlist.push(newWishlistItem.items[0]);
      }

      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));

      // Dispatch cartUpdated event
      window.dispatchEvent(new Event("cartUpdated"));

      // Add notification
      const key = `open${Date.now()}`;
      notification.success({
        message: "Thêm vào giỏ hàng thành công",
        description: (
          <div className="flex items-center space-x-2">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-9 h-9 object-cover rounded"
            />
            <div className="text-xs">
              <div className="font-medium">{product.name}</div>
              <div>Số lượng: 1</div>
            </div>
          </div>
        ),
        duration: 3,
        key,
        placement: "topRight",
        className: "custom-notification",
        style: { padding: "6px" },
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              // Close all notifications then navigate
              notification.destroy();
              navigate("/wishlist");
            }}
            style={{
              background: "linear-gradient(to right, #82AE46, #5A8E1B)",
              color: "white",
              marginTop: "2px",
            }}
          >
            Đi đến giỏ hàng
          </Button>
        ),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
      // Add error notification
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng",
        duration: 3,
        placement: "topRight",
      });
    }
  };

  // Thêm itemRender để tùy chỉnh giao diện số trang
  const itemRender = (page, type, originalElement) => {
    if (type === "page") {
      return (
        <span
          style={
            page === currentPage
              ? {
                  backgroundColor: "#82AE46",
                  color: "white",
                  fontWeight: "bold",
                  padding: "6px 12px",
                  border: "2px solid #82AE46",
                  borderRadius: "4px",
                }
              : {
                  backgroundColor: "white",
                  color: "#82AE46",
                  padding: "6px 12px",
                  border: "1px solid #82AE46",
                  borderRadius: "4px",
                }
          }
        >
          {page}
        </span>
      );
    }
    return originalElement;
  };

  return (
    <div className="flex flex-col w-full">
      <Spin
        spinning={loading}
        tip="Đang tải sản phẩm..."
        className="[&_.ant-spin-dot]:!text-[#82AE46] [&_.ant-spin-text]:!text-[#82AE46]"
      >
        <List
          grid={{ gutter: 16, column: 4 }}
          className="px-2"
          dataSource={currentProducts}
          renderItem={(product) => {
            const averageRating =
              product.reviews?.length > 0
                ? product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product.reviews.length
                : 0;

            return (
              <List.Item>
                <Badge.Ribbon
                  text={`${product.discount}%`}
                  color="#82AE46"
                  style={{ display: product.discount ? "block" : "none" }}
                >
                  <Card
                    hoverable={product.status !== "out_of_stock"}
                    className={`h-[300px] relative transition-all duration-300 ${
                      product.status === "out_of_stock"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    cover={
                      <div className="relative h-[150px] group">
                        <img
                          src={
                            Array.isArray(product.imageUrl)
                              ? product.imageUrl[0]
                              : product.imageUrl
                          }
                          alt={product.name}
                          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                        />
                        {product.status !== "out_of_stock" && (
                          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <Link
                              to={`/product/${product._id}`}
                              state={{ productID: product.productID }}
                              className="flex flex-col items-center text-black hover:text-[#82AE46] transition-transform transform hover:scale-125"
                            >
                              <EyeOutlined className="text-2xl" />
                              <Typography.Text className="text-xs mt-2 text-center">
                                Xem chi tiết
                              </Typography.Text>
                            </Link>

                            <button
                              onClick={() =>
                                product.quantity > 0 && addToWishlist(product)
                              }
                              disabled={product.quantity === 0}
                              className={`flex flex-col items-center ${
                                product.quantity === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-black hover:text-[#82AE46] transition-transform transform hover:scale-125"
                              }`}
                            >
                              <ShoppingCartOutlined className="text-2xl" />
                              <Typography.Text className="text-xs mt-2">
                                Thêm vào giỏ hàng
                              </Typography.Text>
                            </button>
                          </div>
                        )}
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <Typography.Text
                          ellipsis
                          className="font-bold text-center block"
                          style={{ textAlign: "center", width: "100%" }}
                        >
                          {product.name}
                          {product.status === "out_of_stock" && (
                            <div className="text-red-500 text-sm mt-1">
                              Hết hàng
                            </div>
                          )}
                        </Typography.Text>
                      }
                      description={
                        <div className="text-center">
                          {product.oldPrice && (
                            <Typography.Text delete className="mr-2">
                              {formattedPrice(product.oldPrice)}
                            </Typography.Text>
                          )}
                          <Typography.Text strong>
                            {formattedPrice(CalcPrice(product.price))}
                          </Typography.Text>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Đánh giá: {averageRating.toFixed(1)}</span>
                            <span>Đã bán: {product.sold}</span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            );
          }}
        />
      </Spin>
      <div className="w-full flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={searchQuery ? filteredBySearch.length : filteredByPrice.length}
          onChange={handlePageChange}
          itemRender={itemRender}
          className="[&_.ant-pagination-prev_.ant-pagination-item-link]:!text-[#82AE46] [&_.ant-pagination-next_.ant-pagination-item-link]:!text-[#82AE46] [&_.ant-pagination-prev:hover_.ant-pagination-item-link]:!bg-[#82AE46] [&_.ant-pagination-prev:hover_.ant-pagination-item-link]:!text-white [&_.ant-pagination-next:hover_.ant-pagination-item-link]:!bg-[#82AE46] [&_.ant-pagination-next:hover_.ant-pagination-item-link]:!text-white"
        />
      </div>
    </div>
  );
};

ListProduct.propTypes = {
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

// Add the style tag to the document
document.head.insertAdjacentHTML(
  "beforeend",
  `<style>${customNotificationStyle}</style>`
);

export default ListProduct;
