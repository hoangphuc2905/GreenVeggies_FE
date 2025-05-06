import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import Menu from "../layouts/Menu";
import bgImage from "../../../assets/pictures/bg_1.png";

import Favourite from "../layouts/Favourite";
import ListProduct from "../layouts/ListProduct";
import FilterPrice from "../layouts/FilterPrice"; // Import FilterPrice từ layout

const Page = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_VALUE);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_PRODUCT_URL;

  const fetchProducts = () => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu!", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [API_URL]);

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchProducts();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const handleFilter = () => {
    const newMinPrice = tempMinPrice ? Number(tempMinPrice) : 0;
    const newMaxPrice = tempMaxPrice ? Number(tempMaxPrice) : Number.MAX_VALUE;
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setCurrentPage(1);
    setSearchParams({ search: "" }); // Reset tìm kiếm theo tên
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
              <FilterPrice
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setCurrentPage={setCurrentPage}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                tempMinPrice={tempMinPrice}
                setTempMinPrice={setTempMinPrice}
                tempMaxPrice={tempMaxPrice}
                setTempMaxPrice={setTempMaxPrice}
                setSearchParams={setSearchParams} // Truyền setSearchParams vào FilterPrice
                handleFilter={handleFilter} // Truyền handleFilter vào FilterPrice
              />
              <Favourite />
            </div>
            <ListProduct
              minPrice={minPrice}
              maxPrice={maxPrice}
              searchQuery={searchQuery}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
