import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  Carousel,
  Divider,
  InputNumber,
  Pagination,
  Rate,
} from "antd";
import { LeftOutlined, RightOutlined, ZoomInOutlined } from "@ant-design/icons";
import Favourite from "../layouts/Favourite";
import {
  getProductById,
  getUserInfo,
  saveShoppingCarts,
} from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lưu thông tin sản phẩm vào order

const Detail = () => {
  const location = useLocation();
  const id = location.state?.productID;

  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const zoomCarouselRef = useRef(null);

  const carouselRef = useRef(null); // thêm dòng này
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

  const addToWishlist = async () => {
    const userID = localStorage.getItem("userID"); // Lấy userID từ localStorage
    const imageUrl = Array.isArray(product.imageUrl)
      ? product.imageUrl[0]
      : product.imageUrl; // Lấy hình ảnh đầu tiên nếu imageUrl là mảng
    const newWishlistItem = {
      userID: userID,
      items: [
        {
          productID: product.productID, // Đảm bảo sử dụng đúng thuộc tính productID
          name: product.name, // Thêm tên sản phẩm
          quantity: quantity,
          description: product.description,
          price: product.price,
          imageUrl: imageUrl,
        },
      ],
      totalPrice: product.price * quantity,
    };
    try {
      console.log("New Wishlist Item:", newWishlistItem); // In ra dữ liệu gửi đi
      await saveShoppingCarts(newWishlistItem); // Gọi API để lưu thông tin sản phẩm vào order

      // Lưu sản phẩm vào localStorage
      const currentWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];
      const existingItemIndex = currentWishlist.findIndex(
        (item) => item.productID === product.productID // Đảm bảo sử dụng đúng thuộc tính productID
      );

      if (existingItemIndex !== -1) {
        // Sản phẩm đã tồn tại, tăng số lượng
        currentWishlist[existingItemIndex].quantity += quantity;
      } else {
        // Sản phẩm chưa tồn tại, thêm sản phẩm mới
        currentWishlist.push(newWishlistItem.items[0]);
      }

      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));

      // Phát ra sự kiện cập nhật giỏ hàng
      const event = new CustomEvent("wishlistUpdated", {
        detail: currentWishlist.length,
      });
      window.dispatchEvent(event);

      navigate("/wishlist");
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleZoom = () => {
    setIsZoomed((prev) => !prev); // Toggle zoom
  };
  const calculateSellingPrice = (price) => {
    return price * 1.5;
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
        <Breadcrumb
          items={[
            { title: <Link to="/">Home</Link> },
            { title: <Link to="/product">Sản phẩm</Link> },
            {
              title: (
                <Link to={`/category/${product.category._id}`}>
                  {product.category.name}
                </Link>
              ),
            },
          ]}
        />
        <div className="flex flex-col items-center">
          <br></br>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4">
              <div className="mb-4 relative group">
                {" "}
                {/* group là lớp giúp xử lý hover */}
                <Carousel
                  ref={carouselRef}
                  infinite={true}
                  afterChange={(current) => {
                    if (Array.isArray(product.imageUrl)) {
                      setSelectedImage(product.imageUrl[current]);
                    }
                  }}>
                  {Array.isArray(product.imageUrl) &&
                    product.imageUrl.map((img, index) => (
                      <div key={index}>
                        <img
                          src={img}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-96 object-cover rounded-md cursor-pointer"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            transformOrigin: "center center",
                          }}
                        />
                      </div>
                    ))}
                </Carousel>
                {/* Nút Zoom */}
                <button
                  onClick={handleZoom}
                  className="absolute bottom-4 left-4 p-3 bg-transparent hover:bg-transparent transition-all">
                  <ZoomInOutlined className="text-gray-500 text-3xl hover:text-[#82AE46] transition-transform transform hover:scale-125" />
                </button>
                {/* Nút điều hướng bên trái và phải khi hover */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  <button
                    onClick={() => carouselRef.current.prev()}
                    className="text-gray-500 text-3xl hover:text-[#82AE46] transition-transform transform hover:scale-125">
                    <LeftOutlined />
                  </button>
                </div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  <button
                    onClick={() => carouselRef.current.next()}
                    className="text-gray-500 text-3xl hover:text-[#82AE46] transition-transform transform hover:scale-125">
                    <RightOutlined />
                  </button>
                </div>
              </div>

              {Array.isArray(product.imageUrl) &&
                product.imageUrl.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto justify-center">
                    {product.imageUrl.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumb ${index + 1}`}
                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${
                          selectedImage === img
                            ? "border-blue-500 border-2 opacity-100"
                            : "border-gray-300 opacity-50"
                        }`}
                        onClick={() => {
                          setSelectedImage(img);
                          carouselRef.current.goTo(index, false); // thêm dòng này
                        }}
                      />
                    ))}
                  </div>
                )}

              {isZoomed && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                  onClick={handleZoom} // Đóng khi click vào overlay
                >
                  <div
                    className="relative w-full h-auto max-w-4xl max-h-screen"
                    onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                  >
                    <Carousel
                      ref={zoomCarouselRef}
                      arrows
                      autoplay={false}
                      infinite={true}
                      afterChange={(current) => {
                        if (Array.isArray(product.imageUrl)) {
                          setSelectedImage(product.imageUrl[current]); // Cập nhật ảnh chính khi chuyển slide
                        }
                      }}
                      initialSlide={product.imageUrl.indexOf(selectedImage)} // Đặt ảnh hiện tại làm ảnh đầu tiên
                    >
                      {Array.isArray(product.imageUrl) &&
                        product.imageUrl.map((img, index) => (
                          <div key={index}>
                            <img
                              src={img}
                              alt={`Zoomed Image ${index + 1}`}
                              className="w-full h-auto object-over"
                              style={{ maxWidth: "100%", maxHeight: "100%" }}
                            />
                          </div>
                        ))}
                    </Carousel>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 w-full h-[416px] overflow-auto">
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
                  className={`text-wrap ${!isExpanded ? "line-clamp-3" : ""}`}>
                  {product.description}
                </p>
                {showSeeMore && (
                  <button
                    className="text-blue-500 underline mt-2"
                    onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "Rút gọn" : "Xem thêm"}
                  </button>
                )}
              </div>

              <p className="text-xl mt-2 text-[#FEA837]">
                {formatPrice(calculateSellingPrice(product.price))}
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

              <p
                className={`mt-4 flex items-center text-center ${
                  product.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                <button
                  className="px-2 py-1 border rounded-l bg-gray-200"
                  onClick={decrementQuantity}
                  disabled={product.quantity === 0 || quantity <= 1}>
                  -
                </button>
                <InputNumber
                  min={1}
                  max={product.quantity} // Giới hạn nhập số lượng không vượt quá số lượng trong kho
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center"
                  disabled={product.quantity === 0} // Vô hiệu hóa InputNumber nếu số lượng bằng 0
                />
                <button
                  className="px-2 py-1 border rounded-r bg-gray-200"
                  onClick={incrementQuantity}
                  disabled={
                    product.quantity === 0 || quantity >= product.quantity
                  } // Vô hiệu hóa nếu đã đạt số lượng tối đa
                >
                  +
                </button>
                <button
                  className={`text-white text-xs font-bold tracking-wide text-center 
      bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
      rounded-lg p-3 shadow-lg 
      hover:scale-105 transition duration-300 ease-in-out ml-2
      ${product.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={addToWishlist}
                  disabled={product.quantity === 0}>
                  THÊM VÀO GIỎ
                </button>
              </p>
            </div>

            <div className="overflow-y-auto overflow-x-hidden max-h-[416px] pr-2 w-full">
              <Favourite />
            </div>
          </div>
        </div>
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
        <div className="grid grid-cols-3 gap-4 mb-">
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
          <div className="mt-4 p-4 rounded-lg bg-[#f0fdf4]">
            <h2 className="text-2xl font-bold">Mô tả sản phẩm</h2>
            <p>
              {product.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
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
              <p>Danh mục: {product.category.name}</p>
              <p>Nguồn gốc: {product.origin}</p>
              <p>Đơn vị tính: {product.unit}</p>
              <p>
                Trạng thái:{" "}
                {product.quantity === 0 ? (
                  <span className="text-red-500">Hết hàng</span>
                ) : product.status === "available" ? (
                  "Còn hàng"
                ) : (
                  <span className="text-red-500">Hết hàng</span>
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
              className="mt-4 flex justify-center [&_.ant-pagination-item]:!bg-white [&_.ant-pagination-item]:!border-[#82AE46] [&_.ant-pagination-item>a]:!text-[#82AE46] [&_.ant-pagination-item-active]:!bg-[#82AE46] [&_.ant-pagination-item-active>a]:!text-white [&_.ant-pagination-prev_.ant-pagination-item-link]:!text-[#82AE46] [&_.ant-pagination-next_.ant-pagination-item-link]:!text-[#82AE46] [&_.ant-pagination-item:hover]:!bg-[#82AE46] [&_.ant-pagination-item:hover>a]:!text-white [&_.ant-pagination-prev:hover_.ant-pagination-item-link]:!bg-[#82AE46] [&_.ant-pagination-prev:hover_.ant-pagination-item-link]:!text-white [&_.ant-pagination-next:hover_.ant-pagination-item-link]:!bg-[#82AE46] [&_.ant-pagination-next:hover_.ant-pagination-item-link]:!text-white"
            />
          </div>
        )}
      </div>
      {/* Footer */}
    </div>
  );
};

export default Detail;
