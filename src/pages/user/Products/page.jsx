import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Menu from "../layouts/Menu";
import bgImage from "../../../assets/bg_1.png";
const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:8008/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* //<Headers */}
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
            <div className="w-[20%] mb-10">
              <Menu />
            </div>
            {/* 80% */}
            <div className="grid grid-cols-4 grid-rows-3 gap-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-md w-[300px] h-[300px] ml-4 relative">
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-[#82AE46] text-white px-2 py-1 rounded-br-lg">
                      {product.discount}%
                    </div>
                  )}
                  <div className="container mx-auto relative h-[200px]">
                    <img
                      src={
                        Array.isArray(product.imageUrl)
                          ? product.imageUrl[0]
                          : product.imageUrl
                      }
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-gray-700 font-bold text-center">
                    {product.name}
                  </p>
                  <p className="text-gray-700 text-center">
                    {product.oldPrice && (
                      <span className="line-through">{product.oldPrice}đ</span>
                    )}{" "}
                    <span className="text-gray-700">{product.price}đ</span>
                  </p>
                </div>
              ))}
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
