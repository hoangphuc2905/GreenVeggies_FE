import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Menu from "../layouts/Menu";
import bgImage from "../../../assets/bg_1.png";
import { Link } from "react-router-dom";

import { Pagination } from "antd";
import Favourite from "../layouts/favourite";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24); // Số lượng sản phẩm trên mỗi trang

  const API_URL = import.meta.env.VITE_API_PRODUCT_URL;

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    // Fetch dữ liệu từ API
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu!", error);
      });
  }, []);

  const filteredProducts = products.filter(
    (product) => product.status !== "unavailable"
  );

  // Tính toán sản phẩm hiển thị dựa trên trang hiện tại
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />
      {/* Content */}
      <div className="container mx-auto">
        {/* Lấy hình ảnh */}
        <div className="container mx-auto relative">
          <img src={bgImage} alt="Mô tả hình ảnh" className="w-full h-auto" />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-white text-8xl font-bold shadow-md font-amatic">
              SẢN PHẨM
            </h2>
          </div>
        </div>

        {/* Danh mục sản phẩm */}
        <div className="container mx-auto mt-10">
          <div className="flex ">
            {/* Danh mục bên trái */}
            <div className="w-[500px] mb-10">
              <Menu />
              {/* Bộ lọc giá */}
              <div className="p-4 border rounded-lg shadow-md mt-6 mb-6">
                <h3 className="text-xl font-bold mb-3 text-center">
                  Lọc theo giá
                </h3>
                <div className="flex flex-col space-y-4">
                  <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    className="border px-3 py-2 rounded w-full"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Giá tối đa"
                    className="border px-3 py-2 rounded w-full"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <input
                    type="submit"
                    value="Tìm kiếm"
                    className="text-white text-xl font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-xl p-2 shadow-lg 
               hover:scale-105 transition duration-300 ease-in-out"
                  />
                </div>
              </div>

              {/* Sản phẩm bạn có thể thích */}

              <Favourite />
            </div>
            {/* 80% */}
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
                      to={`/product/${product.productID}`}
                      key={index}>
                      <div
                        id={`product-${index}`}
                        className="p-4 bg-white rounded-sm shadow-md ml-4 h-[270px] relative hover:shadow-xl hover:scale-105">
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
                          )}{" "}
                          <span className="text-gray-700">
                            {formatPrice(product.price)}
                          </span>
                        </p>

                        {/* Hiển thị số lượng đã bán */}
                        <div className="absolute bottom-2 right-2  text-gray-700 text-xs px-2 py-1 rounded-md">
                          Đã bán: {product.sold}
                        </div>
                        {/* Hiển thị số lượng đã bán */}
                        <div className="absolute bottom-2 left-2  text-gray-700 text-xs px-2 py-1 rounded-md">
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
                  total={filteredProducts.length}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Product;
