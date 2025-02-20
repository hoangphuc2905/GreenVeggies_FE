import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import { getProductById, getProducts, getUserInfo } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin sản phẩm và người dùng
import { Breadcrumb, Divider, InputNumber, Rate } from "antd";

const Detail = ({ wishlist, setWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showInformations, setShowInformations] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        setSelectedImage(
          Array.isArray(productData.imageUrl)
            ? productData.imageUrl[0]
            : productData.imageUrl
        );
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

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!product?.reviews) return;

      const uniqueUserIDs = [...new Set(product.reviews.map((r) => r.userID))];

      uniqueUserIDs.forEach(async (userID) => {
        if (!userID) {
          console.error("Lỗi: userID bị null hoặc undefined");
          return;
        }

        if (!userData[userID]) {
          try {
            console.log("Fetching user for ID:", userID);
            const response = await getUserInfo(userID);
            console.log("User info:", response);

            setUserData((prev) => ({
              ...prev,
              [userID]: response?.username || "Người dùng ẩn danh",
            }));
          } catch (error) {
            console.error(`Lỗi khi lấy thông tin user ${userID}:`, error);
            setUserData((prev) => ({
              ...prev,
              [userID]: "Người dùng ẩn danh",
            }));
          }
        }
      });
    };

    fetchUserNames();
  }, [product?.reviews]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPosition({ top: y, left: x });
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
    setShowReviews(false); // Hide reviews when showing description
    setShowInformations(false);
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
    setShowDescription(false);
    setShowInformations(false); // Hide description when showing reviews
  };

  const toggleInformations = () => {
    setShowInformations(!showInformations);
    setShowDescription(false); // Hide description when showing reviews
    setShowReviews(false);
  };

  const addToWishlist = () => {
    const newWishlistItem = { ...product, quantity };
    setWishlist([...wishlist, newWishlistItem]);
    navigate("/wishlist");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Tính toán điểm trung bình của các đánh giá
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

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
            <div className="p-4">
              {/* Ảnh chính */}
              <div className="mb-4 relative">
                <img
                  src={selectedImage}
                  alt="Ảnh chính"
                  className="w-full h-96 object-cover rounded-md border cursor-pointer"
                  onClick={handleImageClick}
                  onMouseMove={isZoomed ? handleMouseMove : null}
                  style={{
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                />
                {isZoomed && (
                  <div
                    id="zoom-frame"
                    className="absolute border border-gray-300"
                    style={{
                      width: "200px",
                      height: "200px",
                      top: zoomPosition.top - 100,
                      left: zoomPosition.left + 220, // Đặt khung phóng to kế bên ảnh chính
                      backgroundImage: `url(${selectedImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: `${-zoomPosition.left + 100}px ${
                        -zoomPosition.top + 100
                      }px`,
                      pointerEvents: "none",
                    }}></div>
                )}
              </div>
              {/* Ảnh dạng slider nếu có nhiều ảnh */}
              {Array.isArray(product.imageUrl) &&
                product.imageUrl.length > 1 && (
                  <>
                    {/* Ảnh nhỏ bên dưới */}
                    <div className="flex gap-2 mt-2 overflow-x-auto justify-center">
                      {product.imageUrl.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumb ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${
                            selectedImage === img
                              ? "border-blue-500 border-2"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                          style={{
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
            </div>
            <div className="p-4 w-[416px] h-[416px] overflow-auto ">
              <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
              <div className="mt-4 flex items-center">
                <Rate allowHalf defaultValue={averageRating} />
                <span className="ml-2">
                  ({product.reviews.length} đánh giá)
                </span>
              </div>
              <p className="mt-4 text-wrap">{product.description}</p>
              <p className="text-xl mt-2 text-[#FEA837]">{product.price} VNĐ</p>
              {product.oldPrice && (
                <p className="text-xl line-through">
                  {product.oldPrice} <span className="mr-2">VNĐ</span>
                </p>
              )}
              <p className="mt-4">
                <b>Mã Loại : {product.category.categoryID}</b>
              </p>
              <p className="mt-4">
                <b>Loại : {product.category.name}</b>
              </p>
              <p className="mt-4 flex items-center text-center">
                <button
                  className="px-2 py-1 border rounded-l bg-gray-200  text-center"
                  onClick={decrementQuantity}>
                  -
                </button>
                <InputNumber
                  min={1}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center"
                />
                <button
                  className="px-2 py-1 border rounded-r bg-gray-200"
                  onClick={incrementQuantity}>
                  +
                </button>
                <button
                  className="bg-[#82AE46] text-white px-4 py-2 rounded-lg ml-4 hover:shadow-xl hover:scale-110 active:scale-105 active:shadow-lg transition-all duration-200"
                  onClick={addToWishlist}>
                  THÊM VÀO GIỎ
                </button>
              </p>
            </div>
            <div className=" p-4  w-[416px] h-[416px] overflow-auto">
              <div>
                <h2 className="text-white text-2xl bg-[#82AE46] rounded-[15px] p-4 text-center mt-6 w-full">
                  Bạn có thể thích
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {relatedProducts.slice(0, 4).map((product, index) => (
                    <div
                      key={index}
                      className="flex mt-4 cursor-pointer "
                      onClick={() => handleProductClick(product._id)}>
                      <div className="w-1/2 h-[100px]">
                        <img
                          src={
                            Array.isArray(product.imageUrl)
                              ? product.imageUrl[0]
                              : product.imageUrl
                          }
                          alt={product.name}
                          className="w-full h-full object-over hover:shadow-xl hover:scale-110"
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
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
        <div className="grid grid-cols-3 gap-4">
          <button
            className="hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200"
            style={{
              backgroundColor: "#f0fdf4", // bg-green-50
              color: "#82AE46",
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #82AE46",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#82AE46";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f0fdf4"; // bg-green-50
              e.target.style.color = "#82AE46";
            }}
            onClick={toggleDescription}>
            MÔ TẢ
          </button>
          <button
            className="hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200"
            style={{
              backgroundColor: "#f0fdf4", // bg-green-50
              color: "#82AE46",
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #82AE46",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#82AE46";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f0fdf4"; // bg-green-50
              e.target.style.color = "#82AE46";
            }}
            onClick={toggleInformations}>
            THÔNG TIN LIÊN QUAN
          </button>
          <button
            className="hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200"
            style={{
              backgroundColor: "#f0fdf4", // bg-green-50
              color: "#82AE46",
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #82AE46",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#82AE46";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f0fdf4"; // bg-green-50
              e.target.style.color = "#82AE46";
            }}
            onClick={toggleReviews}>
            ĐÁNH GIÁ
          </button>
        </div>
        {showDescription && (
          <div className="mt-4 p-4  rounded-lg bg-[#f0fdf4]">
            <h2 className="text-2xl font-bold">Mô tả sản phẩm</h2>
            <p>{product.description}</p>
          </div>
        )}
        {showInformations && (
          <div className="mt-4 p-4  rounded-lg bg-[#f0fdf4]">
            <h2 className="text-2xl font-bold">Thông tin sản phẩm</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}>
              <p>Số lượng: {product.quantity}</p>
              <p>Nguồn gốc: {product.origin}</p>
              <p>Đơn vị tính: {product.unit}</p>
              <p>
                Trạng thái:{" "}
                {product.status === "available" ? "Còn hàng" : "Hết hàng"}
              </p>
            </div>
          </div>
        )}
        {showReviews && (
          <div className="mt-4 p-4  rounded-lg bg-[#f0fdf4]">
            <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
            {product.reviews.map((review, index) => (
              <div key={index} className="mt-2">
                <p>
                  <b>{userData[review.userID]}</b> -{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <Rate disabled defaultValue={review.rating} />
                <p>{review.comment}</p>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

Detail.propTypes = {
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      imageUrl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
    })
  ).isRequired,
  setWishlist: PropTypes.func.isRequired,
};

export default Detail;
