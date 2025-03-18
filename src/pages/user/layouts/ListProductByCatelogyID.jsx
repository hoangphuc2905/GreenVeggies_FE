import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import PropTypes from "prop-types";

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
          product.price >= minPrice &&
          product.price <= maxPrice
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
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    state={{ productID: product.productID }}>
                    <div className="p-4 bg-white rounded-sm shadow-md ml-4 h-[270px] relative hover:shadow-xl hover:scale-105">
                      {product.discount && (
                        <div className="absolute top-0 left-0 bg-[#82AE46] text-white px-2 py-1 rounded-br-lg">
                          {product.discount}%
                        </div>
                      )}
                      <div className="container mx-auto relative h-[150px]">
                        <img
                          src={
                            Array.isArray(product.imageUrl)
                              ? product.imageUrl[0]
                              : product.imageUrl
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
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
                          {formatPrice(product.price)}
                        </span>
                      </p>
                      <div className="absolute bottom-2 right-2 text-gray-700 text-xs px-2 py-1 rounded-md">
                        Đã bán: {product.sold}
                      </div>
                      <div className="absolute bottom-2 left-2 text-gray-700 text-xs px-2 py-1 rounded-md">
                        Đánh giá: {averageRating.toFixed(1)}
                      </div>
                    </div>
                  </Link>
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
