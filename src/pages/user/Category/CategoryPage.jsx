import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Footer from "../layouts/footer";
import Menu from "../layouts/Menu";
import bgImage from "../../../assets/bg_1.png";

import Favourite from "../layouts/favourite";
import { getAllProducts } from "../../../api/api"; // Import hàm API để lấy tất cả sản phẩm
import FilterPrice from "../layouts/filterPrice"; // Import FilterPrice từ layout
import ProductList from "../layouts/listProductByCatelogyID"; // Import ProductList từ layout

const CategoryPage = () => {
  const { id } = useParams(); // Lấy ID danh mục từ URL
  const [allProducts, setAllProducts] = useState([]); // Tất cả sản phẩm
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_VALUE);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24); // Số lượng sản phẩm trên mỗi trang
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProducts();
        console.log("Danh sách tất cả sản phẩm:", productsData);
        setAllProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tất cả sản phẩm:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col mx-[10%]">
      {/* Header */}

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
              />

              {/* Sản phẩm bạn có thể thích */}
              <Favourite />
            </div>
            {/* 80% */}
            <div className="flex flex-col w-full">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Đang tải...</p>
                </div>
              ) : (
                <ProductList
                  allProducts={allProducts}
                  categoryId={id}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageSize={pageSize}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CategoryPage;
