import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy danh sách sản phẩm

const Favourite = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productID) => {
    navigate(`/product/${productID}`);
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div>
      <h2
        className="text-white text-2xl font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-xl p-4 shadow-lg 
               hover:scale-105 transition duration-300 ease-in-out">
        Bạn có thể thích
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {products.slice(0, 4).map((product, index) => (
          <div
            key={index}
            className="flex mt-4 cursor-pointer hover:shadow-xl hover:scale-110"
            onClick={() => handleProductClick(product.productID)}>
            <div className="w-1/2 h-[100px]">
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
            <div className="w-1/2 pl-4 flex flex-col justify-center">
              <p className="text-gray-700 font-bold">{product.name}</p>
              <span className="text-gray-700">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourite;
