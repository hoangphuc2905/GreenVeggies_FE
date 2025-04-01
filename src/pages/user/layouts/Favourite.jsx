import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../../api/api";
import { List, Avatar } from 'antd';

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

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: { productID: product.productID } });
  };
  
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-white text-lg font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-t-lg p-4
               transition duration-300 ease-in-out">
          Có thể bạn sẽ thích
        </h2>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={products.slice(0, 4)}
        className="mt-4"
        renderItem={(product) => (
          <List.Item
            className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-lg p-2"
            onClick={() => handleProductClick(product)}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size={100}
                  src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
                  className="object-cover"
                />
              }
              title={<span className="text-gray-700 font-bold">{product.name}</span>}
              description={<span className="text-gray-700">{formatPrice(product.price)}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Favourite;
