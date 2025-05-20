import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Menu from "../layouts/Menu";
import bgImage from "../../../assets/pictures/bg_1.png";
import Favourite from "../layouts/Favourite";
import ListProduct from "../layouts/ListProduct";
import FilterPrice from "../layouts/FilterPrice";
import { getProducts } from "../../../services/ProductService";

const Page = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_VALUE);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      // Sắp xếp sản phẩm: còn hàng lên đầu, hết hàng và ngừng kinh doanh xuống cuối
      const sortedProducts = [...data].sort((a, b) => {
        // Sắp xếp ưu tiên: available > out_of_stock > unavailable
        if (a.status === "available" && b.status !== "available") {
          return -1; // a đứng trước b
        }
        if (a.status !== "available" && b.status === "available") {
          return 1; // a đứng sau b
        }

        // Nếu cả hai không phải available, ưu tiên out_of_stock trước unavailable
        if (a.status === "out_of_stock" && b.status === "unavailable") {
          return -1; // a đứng trước b
        }
        if (a.status === "unavailable" && b.status === "out_of_stock") {
          return 1; // a đứng sau b
        }

        // Nếu cả hai cùng trạng thái, sắp xếp theo tên
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu!", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <div className="container mx-auto mt-[122px]">
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
