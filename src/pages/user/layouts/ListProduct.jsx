import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

const ListProduct = ({
  minPrice,
  maxPrice,
  searchQuery,
  currentPage,
  setCurrentPage,
}) => {
  const [products, setProducts] = useState([]);
  const [pageSize] = useState(24);

  const API_URL = import.meta.env.VITE_API_PRODUCT_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu!", error);
      });
  }, [API_URL]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

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
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;

  const currentProducts = searchQuery
    ? filteredBySearch.slice(indexOfFirstProduct, indexOfLastProduct)
    : filteredByPrice.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-4 grid-rows-2 gap-4">
        {currentProducts.map((product, index) => {
          const averageRating =
            product.reviews?.length > 0
              ? product.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                ) / product.reviews.length
              : 0;
          return (
            <Link
              className=""
              to={`/product/${product._id}`}
              key={index}
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
        })}
      </div>
      <div className="w-full flex justify-center mt-6 text-[#82AE46]">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={searchQuery ? filteredBySearch.length : filteredByPrice.length}
          onChange={handlePageChange}
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

export default ListProduct;
