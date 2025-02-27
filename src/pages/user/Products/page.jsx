import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";


import Footer from "../layouts/footer";
import Menu from "../layouts/Menu";
import bgImage from "../../../assets/bg_1.png";
import { Link } from "react-router-dom";

import { Pagination } from "antd";
import Favourite from "../layouts/favourite";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_VALUE);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24);
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const API_URL = import.meta.env.VITE_API_PRODUCT_URL;

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

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

  const handleFilter = () => {
    const newMinPrice = tempMinPrice ? Number(tempMinPrice) : 0;
    const newMaxPrice = tempMaxPrice ? Number(tempMaxPrice) : Number.MAX_VALUE;
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setCurrentPage(1);
    setSearchParams({ search: "" }); // Reset tìm kiếm theo tên
  };

  useEffect(() => {
    if (searchQuery) {
      setMinPrice(0);
      setMaxPrice(Number.MAX_VALUE);
      setTempMinPrice("");
      setTempMaxPrice("");
    }
  }, [searchQuery]);

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
  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1);
    switch (range) {
      case "under500k":
        setMinPrice(0);
        setMaxPrice(500000);
        break;
      case "500kTo1m":
        setMinPrice(500000);
        setMaxPrice(1000000);
        break;
      case "1mTo2m":
        setMinPrice(1000000);
        setMaxPrice(2000000);
        break;
      case "above2m":
        setMinPrice(2000000);
        setMaxPrice(Number.MAX_VALUE);
        break;
      default:
        setMinPrice(0);
        setMaxPrice(Number.MAX_VALUE);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col mx-[10%]">
      {/* Header */}
      <div className="container mx-auto">
        <div className="container mx-auto relative">
          <img src={bgImage} alt="Mô tả hình ảnh" className="w-full h-auto" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-white text-8xl font-bold shadow-md font-amatic">
              SẢN PHẨM
            </h2>
          </div>
        </div>

        <div className="container mx-auto mt-10">
          <div className="flex">
            <div className="w-[500px] mb-10">
              <Menu />
              <div className="p-4 border rounded-lg shadow-md mt-6 mb-6">
                <h3 className="text-xl font-bold mb-3 text-center">
                  Lọc theo giá
                </h3>
                <div className="flex flex-col space-y-4">
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === "under500k"}
                      onChange={() => handlePriceRangeChange("under500k")}
                    />
                    Dưới 500K
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === "500kTo1m"}
                      onChange={() => handlePriceRangeChange("500kTo1m")}
                    />
                    500K - 1M
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === "1mTo2m"}
                      onChange={() => handlePriceRangeChange("1mTo2m")}
                    />
                    1M - 2M
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === "above2m"}
                      onChange={() => handlePriceRangeChange("above2m")}
                    />
                    Trên 2M
                  </label>
                  <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    className="border px-3 py-2 rounded w-full"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Giá tối đa"
                    className="border px-3 py-2 rounded w-full"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                  />
                  <button
                    onClick={handleFilter}
                    className="text-white text-xl font-bold uppercase tracking-wide text-center bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] rounded-xl p-2 shadow-lg hover:scale-105 transition duration-300 ease-in-out">
                    Tìm kiếm
                  </button>
                </div>
              </div>
              <Favourite />
            </div>
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
                  total={
                    searchQuery
                      ? filteredBySearch.length
                      : filteredByPrice.length
                  }
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
