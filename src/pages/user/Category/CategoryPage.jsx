import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";


import Footer from "../layouts/footer";
import Menu from "../layouts/Menu";
import bgImage from "../../../assets/bg_1.png";
import { Pagination } from "antd";
import Favourite from "../layouts/favourite";
import { getAllProducts } from "../../../api/api"; // Import hàm API để lấy tất cả sản phẩm

const CategoryPage = () => {
  const { id } = useParams(); // Lấy ID danh mục từ URL
  const [allProducts, setAllProducts] = useState([]); // Tất cả sản phẩm
  const [products, setProducts] = useState([]); // Sản phẩm đã lọc
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(24); // Số lượng sản phẩm trên mỗi trang

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

  useEffect(() => {
    const filterProductsByCategory = () => {
      const filteredProducts = allProducts.filter((product) => {
        console.log(
          `Product category: ${product.category.categoryID}, ID: ${id}`
        );
        return product.category.categoryID === id;
      });
      console.log("Sản phẩm đã lọc:", filteredProducts);
      setProducts(filteredProducts);
    };

    filterProductsByCategory();
  }, [id, allProducts]);

  const filteredProducts = products.filter(
    (product) => product.status !== "unavailable"
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] bg-clip-text text-transparent cursor-pointer">
                  Sản phẩm thuộc danh mục: {products[0]?.category?.name}
                </h2>
                {loading ? (
                  <p>Đang tải...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Link
                          key={product._id}
                          to={`/product/${product.productID}`}>
                          <div className="border p-4 rounded-lg shadow-md">
                            <img
                              src={
                                Array.isArray(product.imageUrl)
                                  ? product.imageUrl[0]
                                  : product.imageUrl
                              }
                              alt={product.name}
                              className="w-full h-40 object-cover rounded"
                            />
                            <h3 className="text-lg font-semibold mt-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-600">{product.price} VNĐ</p>
                          </div>
                        </Link>
                      ))
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

export default CategoryPage;
