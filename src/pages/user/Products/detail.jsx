import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import { getProductById } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin sản phẩm

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <Header />
      {/* Content */}
      <div className="container mx-auto mt-10">
        <div className="flex flex-col items-center">
          <img
            src={
              Array.isArray(product.imageUrl)
                ? product.imageUrl[0]
                : product.imageUrl
            }
            alt={product.name}
            className="w-full h-auto object-cover"
          />
          <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
          <p className="text-xl mt-2">{product.price}đ</p>
          {product.oldPrice && (
            <p className="text-xl line-through">{product.oldPrice}đ</p>
          )}
          <p className="mt-4">{product.description}</p>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Detail;
