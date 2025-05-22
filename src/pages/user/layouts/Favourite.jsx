import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { List, Avatar, Spin } from "antd";
import {
  CalcPrice,
  formattedPrice,
} from "../../../components/calcSoldPrice/CalcPrice";
import { getProducts } from "../../../services/ProductService";

// Hàm chuyển đổi đơn vị tính sang tiếng Việt
const translateUnit = (unit) => {
  const unitTranslations = {
    piece: "cái",
    kg: "kg",
    gram: "gram",
    liter: "lít",
    ml: "ml",
    pack: "gói",
    bundle: "bó",
    bottle: "chai",
    packet: "túi",
  };

  return unitTranslations[unit] || unit;
};

const Favourite = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsData = await getProducts();
        // Filter products to only include those with "available" status
        const availableProducts = productsData.filter(
          (product) => product.status === "available"
        );
        setProducts(availableProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, {
      state: { productID: product.productID },
    });
  };

  return (
    <div>
      <div className="mb-2">
        <h2
          className="text-white text-lg font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-t-lg p-4
               transition duration-300 ease-in-out">
          Có thể bạn sẽ thích
        </h2>
      </div>
      <Spin
        spinning={loading}
        tip="Đang tải..."
        className="[&_.ant-spin-dot]:!text-[#82AE46] [&_.ant-spin-text]:!text-[#82AE46]">
        {products.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={products.slice(0, 4)}
            className="mt-4"
            renderItem={(product) => (
              <List.Item
                className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-lg p-2"
                onClick={() => handleProductClick(product)}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={100}
                      src={
                        Array.isArray(product.imageUrl)
                          ? product.imageUrl[0]
                          : product.imageUrl
                      }
                      className="object-cover"
                    />
                  }
                  title={
                    <span className="text-gray-700 font-bold">
                      {product.name}
                    </span>
                  }
                  description={
                    <span className="text-gray-700">
                      {formattedPrice(CalcPrice(product.price))}
                      <span className="text-gray-500 ml-1">
                        /1 {translateUnit(product.unit)}
                      </span>
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Không có sản phẩm nào khả dụng
          </div>
        )}
      </Spin>
    </div>
  );
};

export default Favourite;
