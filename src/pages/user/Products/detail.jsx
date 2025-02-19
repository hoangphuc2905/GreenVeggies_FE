import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import { getProductById, getProducts } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin sản phẩm
import { Breadcrumb, Divider, Rate } from "antd";

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const productsData = await getProducts();
        setRelatedProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <Header />
      {/* Content */}
      <div className="mt-20">
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
      </div>
      <div className="container mx-auto">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/product">Products</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Trái Cây</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex flex-col items-center">
          <br></br>
          <div className="grid grid-cols-3 gap-4">
            <div className=" p-4">
              <img
                src={
                  Array.isArray(product.imageUrl)
                    ? product.imageUrl[0]
                    : product.imageUrl
                }
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="p-4">
              <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
              <div className="mt-4">
                <Rate allowHalf defaultValue={2.5} />
              </div>
              <p className="mt-4">{product.description}</p>
              <p className="text-xl mt-2 text-[#FEA837]">{product.price} VNĐ</p>
              {product.oldPrice && (
                <p className="text-xl line-through">
                  {product.oldPrice} <span className="mr-2">VNĐ</span>
                </p>
              )}
            </div>
            <div className=" p-4 shadow-md w-[384px] h-[384px] overflow-auto">
              <div>
                <h2 className="text-white text-2xl bg-[#82AE46] rounded-[15px] p-4 text-center mt-6 w-full">
                  Bạn có thể thích
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {relatedProducts.slice(0, 4).map((product, index) => (
                    <div
                      key={index}
                      className="flex mt-4 cursor-pointer"
                      onClick={() => handleProductClick(product._id)}>
                      <div className="w-1/2 h-[100px]">
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
                      <div className="w-1/2 pl-4 flex flex-col justify-center">
                        <p className="text-gray-700 font-bold">
                          {product.name}
                        </p>
                        <p className="text-gray-700 font-bold">
                          {product.price}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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

export default Detail;
