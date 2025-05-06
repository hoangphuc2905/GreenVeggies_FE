import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Pagination,
  notification,
  Card,
  List,
  Badge,
  Typography,
  Empty,
  Spin,
} from "antd";
import PropTypes from "prop-types";

import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  formattedPrice,
  CalcPrice,
} from "../../../components/calcSoldPrice/CalcPrice";
import { saveShoppingCarts } from "../../../services/ShoppingCartService";

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
      setLoading(true);
      const filteredProducts = allProducts.filter((product) => {
        return (
          product.category._id === categoryId &&
          product.status !== "unavailable" &&
          CalcPrice(product.price) >= minPrice &&
          CalcPrice(product.price) <= maxPrice
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

      // Add success notification
      notification.success({
        message: "Thêm vào giỏ hàng thành công",
        description: `Đã thêm ${product.name} với số lượng 1 vào giỏ hàng`,
        duration: 4,
        placement: "topRight",
      });
    } catch (error) {
      console.error("Failed to save order:", error);
      // Add error notification
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng",
        duration: 4,
        placement: "topRight",
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] bg-clip-text text-transparent cursor-pointer px-4">
        Sản phẩm thuộc danh mục: {products[0]?.category?.name}
      </h2>
      <Spin
        spinning={loading}
        tip="Đang tải sản phẩm..."
        className="[&_.ant-spin-dot]:!text-[#82AE46] [&_.ant-spin-text]:!text-[#82AE46]">
        <List
          grid={{ gutter: 16, column: 4 }}
          className="px-2"
          dataSource={products}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-700">
                    Không có sản phẩm nào trong danh mục này
                  </span>
                }
              />
            ),
          }}
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
                  style={{ display: product.discount ? "block" : "none" }}>
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
                              className="flex flex-col items-center text-black hover:text-[#82AE46] transition-transform transform hover:scale-125">
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
                              }`}>
                              <ShoppingCartOutlined className="text-2xl" />
                              <Typography.Text className="text-xs mt-2">
                                Thêm vào giỏ hàng
                              </Typography.Text>
                            </button>
                          </div>
                        )}
                      </div>
                    }>
                    <Card.Meta
                      title={
                        <Typography.Text
                          ellipsis
                          className="font-bold text-center block"
                          style={{ textAlign: "center", width: "100%" }}>
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
          total={products.length}
          onChange={handlePageChange}
          className="[&_.ant-pagination-item]:!bg-white [&_.ant-pagination-item]:!border-[#82AE46] [&_.ant-pagination-item>a]:!text-[#82AE46] [&_.ant-pagination-item-active]:!bg-[#82AE46] [&_.ant-pagination-item-active>a]:!text-white [&_.ant-pagination-prev_.ant-pagination-item-link]:!text-[#82AE46] [&_.ant-pagination-next_.ant-pagination-item-link]:!text-[#82AE46] [&_.ant-pagination-item:hover]:!bg-[#82AE46] [&_.ant-pagination-item:hover>a]:!text-white [&_.ant-pagination-prev:hover_.ant-pagination-item-link]:!bg-[#82AE46] [&_.ant-pagination-prev:hover_.ant-pagination-item-link]:!text-white [&_.ant-pagination-next:hover_.ant-pagination-item-link]:!bg-[#82AE46] [&_.ant-pagination-next:hover_.ant-pagination-item-link]:!text-white"
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
