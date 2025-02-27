import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Footer from "../layouts/footer";
import { getProductById, getUserInfo } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin sản phẩm và người dùng
import { Breadcrumb, Divider, InputNumber, Pagination, Rate } from "antd";
import Favourite from "../layouts/favourite";

const Detail = ({ wishlist, setWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState({});

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showInformations, setShowInformations] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const descriptionRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
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

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!product?.reviews) return;

      const uniqueUserIDs = [...new Set(product.reviews.map((r) => r.userID))];

      try {
        const userInfoArray = await Promise.all(
          uniqueUserIDs.map(async (userID) => {
            if (!userID) return null;
            if (userData[userID]) return { userID, username: userData[userID] };

            try {
              console.log("Fetching user for ID:", userID);
              const response = await getUserInfo(userID);
              return {
                userID,
                username: response?.username || "Người dùng ẩn danh",
              };
            } catch (error) {
              console.error(`Lỗi khi lấy thông tin user ${userID}:`, error);
              return { userID, username: "Người dùng ẩn danh" };
            }
          })
        );

        // Cập nhật userData
        const newUserData = {};
        userInfoArray.forEach((user) => {
          if (user) newUserData[user.userID] = user.username;
        });

        setUserData((prev) => ({ ...prev, ...newUserData }));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
      }
    };

    fetchUserNames();
  }, [product?.reviews]);

  // Tính điểm trung bình đánh giá, cập nhật mỗi khi reviews thay đổi
  const averageRating = useMemo(() => {
    return product?.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
      : 0;
  }, [product?.reviews]);

  // Kiểm tra nếu mô tả dài hơn 3 dòng thì hiển thị nút "Xem thêm"
  useEffect(() => {
    if (descriptionRef.current) {
      setShowSeeMore(
        descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight
      );
    }
  }, [product?.description]);

  // Đặt lại trạng thái khi sản phẩm thay đổi
  useEffect(() => {
    setIsExpanded(false);
    setShowSeeMore(false);
  }, [id]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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
    console.log("wishlist:", wishlist);
    console.log("wishlist type:", typeof wishlist);
    console.log("wishlist isArray:", Array.isArray(wishlist));
    setWishlist([...wishlist, newWishlistItem]);
    navigate("/wishlist");
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col mx-[10%]">
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
          <Breadcrumb.Item>
            <Link to={`/category/${product.category.categoryID}`}>
              {product.category.name}
            </Link>
          </Breadcrumb.Item>
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
                  className="w-full h-96 object-cover rounded-md cursor-pointer"
                />
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
                        />
                      ))}
                    </div>
                  </>
                )}
            </div>
            <div className="p-4 w-[416px] h-[416px] overflow-auto">
              <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
              <div className="mt-4 flex items-center">
                <Rate allowHalf value={averageRating} disabled />
                <span className="ml-2">
                  ({product.reviews.length} đánh giá)
                </span>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="mt-4">
                <p
                  ref={descriptionRef}
                  className={`text-wrap ${!isExpanded ? "line-clamp-3" : ""}`}
                >
                  {product.description}
                </p>
                {showSeeMore && !isExpanded && (
                  <button
                    className="text-blue-500 underline mt-2"
                    onClick={() => setIsExpanded(true)}
                  >
                    Xem thêm
                  </button>
                )}
              </div>

              <p className="text-xl mt-2 text-[#FEA837]">
                {formatPrice(product.price)}{" "}
              </p>
              {product.oldPrice && (
                <p className="text-xl line-through">
                  {product.oldPrice} <span className="mr-2">VNĐ</span>
                </p>
              )}

              <p className="mt-4">
                <b>Số lượng : {product.quantity}</b>
              </p>
              <p className="mt-4">
                <b>Loại : {product.category.name}</b>
              </p>

              <p className="mt-4 flex items-center text-center">
                <button
                  className="px-2 py-1 border rounded-l bg-gray-200"
                  onClick={decrementQuantity}
                >
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
                  onClick={incrementQuantity}
                >
                  +
                </button>
                <button
                  className="text-white text-xl font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-xl p-4 shadow-lg 
               hover:scale-105 transition duration-300 ease-in-out ml-2"
                  onClick={addToWishlist}
                >
                  THÊM VÀO GIỎ
                </button>
              </p>
            </div>

            <div className="overflow-y-auto overflow-x-hidden max-h-[416px] pr-2">
              <Favourite />
            </div>
          </div>
        </div>
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
        <div className="grid grid-cols-3 gap-4">
          <button
            className={`hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 ${
              selectedTab === "description"
                ? "bg-[#82AE46] text-white font-bold"
                : ""
            }`}
            style={{
              backgroundColor:
                selectedTab === "description" ? "#82AE46" : "#f0fdf4",
              color: selectedTab === "description" ? "white" : "#82AE46",
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #82AE46",
            }}
            onClick={() => {
              setSelectedTab("description");
              toggleDescription();
            }}>

            MÔ TẢ
          </button>
          <button
            className={`hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 ${
              selectedTab === "informations"
                ? "bg-[#82AE46] text-white font-bold"
                : ""
            }`}
            style={{
              backgroundColor:
                selectedTab === "informations" ? "#82AE46" : "#f0fdf4",
              color: selectedTab === "informations" ? "white" : "#82AE46",
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #82AE46",
            }}
            onClick={() => {
              setSelectedTab("informations");
              toggleInformations();
            }}>

            THÔNG TIN LIÊN QUAN
          </button>

          <button
            className={`hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 ${
              selectedTab === "reviews"
                ? "bg-[#82AE46] text-white font-bold"
                : ""
            }`}
            style={{
              backgroundColor:
                selectedTab === "reviews" ? "#82AE46" : "#f0fdf4",
              color: selectedTab === "reviews" ? "white" : "#82AE46",
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #82AE46",
            }}
            onClick={() => {
              setSelectedTab("reviews");
              toggleReviews();
            }}>

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
              }}
            >
              <p>Danh mục: {product.category.name}</p>
              <p>Nguồn gốc: {product.origin}</p>
              <p>Đơn vị tính: {product.unit}</p>
              <p>
                Trạng thái:{" "}
                {product.status === "available" ? (
                  "Còn hàng"
                ) : (
                  <span className="text-red-500"> Hết hàng</span>
                )}
              </p>
            </div>
          </div>
        )}
        {showReviews && (
          <div className="mt-4 p-4 rounded-lg bg-[#f0fdf4]">
            <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>

            {/* Xác định phạm vi đánh giá hiển thị */}
            {product.reviews
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((review, index) => (
                <div key={index} className="mt-2">
                  <p>
                    <b>{userData[review.userID] || "Người dùng ẩn danh"}</b> -{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <Rate disabled defaultValue={review.rating} />
                  <p>{review.comment}</p>
                  <Divider />
                </div>
              ))}

            {/* Phân trang */}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={product.reviews.length}
              onChange={(page) => setCurrentPage(page)}
              className="mt-4 flex justify-center"
            />
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
      description: PropTypes.string.isRequired,
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
