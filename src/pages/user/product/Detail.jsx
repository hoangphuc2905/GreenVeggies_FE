import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Carousel,
  Divider,
  InputNumber,
  Pagination,
  Rate,
  Space,
  Typography,
  Image,
} from "antd";
import { LeftOutlined, RightOutlined, ZoomInOutlined } from "@ant-design/icons";
import Favourite from "../layouts/Favourite";
import {
  getUserInfo,
  saveShoppingCarts,
} from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lưu thông tin sản phẩm vào order
import { getProductById } from "../../../services/ProductService";

// Change this import
import {
  formattedPrice,
  CalcPrice,
} from "../../../components/calcSoldPrice/CalcPrice";

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
  const [showDescription, setShowDescription] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [showInformations, setShowInformations] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const descriptionRef = useRef(null);
  const fullDescriptionRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("description");
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
        // Scroll to top when product data is loaded
        window.scrollTo(0, 0);
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

  const handleZoom = () => {
    setIsZoomed((prev) => !prev); // Toggle zoom
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
                  autoplay={true}
                  autoplaySpeed={3000}
                  afterChange={(current) => {
                    if (Array.isArray(product.imageUrl)) {
                      setSelectedImage(product.imageUrl[current]);
                    }
                  }}>
                  {Array.isArray(product.imageUrl) &&
                    product.imageUrl.map((img, index) => (
                      <div key={index}>
                        <Image
                          src={img}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-96 object-cover rounded-md"
                          preview={{
                            mask: (
                              <div className="flex items-center justify-center group hover:text-[#82AE46] transition-colors duration-300">
                                <ZoomInOutlined className="text-2xl" />
                                <span className="ml-2">Xem</span>
                              </div>
                            ),
                          }}
                        />
                      </div>
                    ))}
                </Carousel>
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

            <div className="p-4 w-full h-[416px] overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#82AE46] [&::-webkit-scrollbar-thumb]:rounded-full">
              <Typography.Title level={2} className="mt-4">
                {product.name}
              </Typography.Title>

              <Space className="mt-4" align="center">
                <Rate allowHalf value={averageRating} disabled />
                <Typography.Text>
                  ({product.reviews.length} đánh giá)
                </Typography.Text>
              </Space>

              <div className="mt-4">
                <Typography.Paragraph
                  ref={descriptionRef}
                  ellipsis={{ rows: 3 }}>
                  {product.description}
                </Typography.Paragraph>
                {showSeeMore && (
                  <Button
                    type="link"
                    onClick={() => {
                      // Make sure description tab is selected
                      setSelectedTab("description");
                      setShowDescription(true);
                      setShowReviews(false);
                      setShowInformations(false);

                      // Scroll to a position slightly above the description section
                      setTimeout(() => {
                        if (fullDescriptionRef.current) {
                          // Get position of the element
                          const yOffset = -80; // Add a 80px offset to scroll a bit higher
                          const element = fullDescriptionRef.current;
                          const y =
                            element.getBoundingClientRect().top +
                            window.pageYOffset +
                            yOffset;

                          window.scrollTo({
                            top: y,
                            behavior: "smooth",
                          });
                        }
                      }, 100);
                    }}
                    className="text-[#82AE46]">
                    Xem thêm
                  </Button>
                )}
              </div>

              <Typography.Text
                className="text-xl block mt-2"
                style={{ color: "#FEA837" }}>
                {formattedPrice(CalcPrice(product.price))}
              </Typography.Text>

              <div className="mt-4">
                <Typography.Text strong className="block mb-2">
                  Số lượng: {product.quantity}
                </Typography.Text>
                <Typography.Text strong className="block mb-4">
                  Loại: {product.category.name}
                </Typography.Text>
              </div>

              <Space className="mt-4" align="center">
                <Space.Compact>
                  <Button
                    onClick={decrementQuantity}
                    disabled={product.quantity === 0 || quantity <= 1}
                    className="hover:text-[#82AE46] hover:border-[#82AE46] transition-colors">
                    -
                  </Button>
                  <InputNumber
                    min={1}
                    max={product.quantity}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(value)}
                    className="w-16 hover:border-[#82AE46] "
                    disabled={product.quantity === 0}
                    controls={false}
                    style={{ textAlign: "center" }}
                  />
                  <Button
                    onClick={incrementQuantity}
                    disabled={
                      product.quantity === 0 || quantity >= product.quantity
                    }
                    className="!hover:bg-[#82AE46] !hover:text-white !hover:border-[#82AE46] transition-colors">
                    +
                  </Button>
                </Space.Compact>

                <Button
                  type="primary"
                  onClick={addToWishlist}
                  disabled={product.quantity === 0}
                  className="!bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] hover:scale-105 !hover:from-[#82AE46] !hover:to-[#5A8E1B]">
                  THÊM VÀO GIỎ
                </Button>
              </Space>
            </div>

            <div
              className="w-full rounded-lg bg-[#ffffff] p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#82AE46] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#5A8E1B] transition-all duration-300"
              style={{
                height: "416px",
                overflowY: "auto",
                overflowX: "hidden",
                boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
                scrollbarWidth: "thin",
                scrollbarColor: "#82AE46 #f0f0f0",
              }}>
              <Favourite />
            </div>
          </div>
        </div>
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
        <div className="grid grid-cols-3 gap-4 mb-">
          <Button
            type={selectedTab === "description" ? "primary" : "default"}
            className={`w-full h-14 text-base font-medium hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 ${
              selectedTab === "description"
                ? "!bg-[#82AE46] !text-white !border-[#82AE46]"
                : "!bg-[#f0fdf4] !text-[#82AE46] !border-[#82AE46]"
            }`}
            onClick={() => {
              setSelectedTab("description");
              toggleDescription();
            }}>
            MÔ TẢ
          </Button>
          <Button
            type={selectedTab === "informations" ? "primary" : "default"}
            className={`w-full h-14 text-base font-medium hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 ${
              selectedTab === "informations"
                ? "!bg-[#82AE46] !text-white !border-[#82AE46]"
                : "!bg-[#f0fdf4] !text-[#82AE46] !border-[#82AE46]"
            }`}
            onClick={() => {
              setSelectedTab("informations");
              toggleInformations();
            }}>
            THÔNG TIN LIÊN QUAN
          </Button>

          <Button
            type={selectedTab === "reviews" ? "primary" : "default"}
            className={`w-full h-14 text-base font-medium hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 ${
              selectedTab === "reviews"
                ? "!bg-[#82AE46] !text-white !border-[#82AE46]"
                : "!bg-[#f0fdf4] !text-[#82AE46] !border-[#82AE46]"
            }`}
            onClick={() => {
              setSelectedTab("reviews");
              toggleReviews();
            }}>
            ĐÁNH GIÁ
          </Button>
        </div>
        {showDescription && (
          <div
            ref={fullDescriptionRef}
            className="mt-4 p-4 rounded-lg bg-[#f0fdf4]">
            <Typography.Title level={2}>Mô tả sản phẩm</Typography.Title>
            <Typography.Paragraph className="whitespace-pre-line">
              {product.description}
            </Typography.Paragraph>
          </div>
        )}
        {showInformations && (
          <div className="mt-4 p-4 rounded-lg bg-[#f0fdf4]">
            <Typography.Title level={2}>Thông tin sản phẩm</Typography.Title>
            <div className="grid grid-cols-2 gap-4">
              <Typography.Text strong>
                Danh mục:{" "}
                <Typography.Text>{product.category.name}</Typography.Text>
              </Typography.Text>
              <Typography.Text strong>
                Nguồn gốc: <Typography.Text>{product.origin}</Typography.Text>
              </Typography.Text>
              <Typography.Text strong>
                Đơn vị tính: <Typography.Text>{product.unit}</Typography.Text>
              </Typography.Text>
              <Typography.Text strong>
                Trạng thái:{" "}
                {product.quantity === 0 ? (
                  <Typography.Text type="danger">Hết hàng</Typography.Text>
                ) : product.status === "available" ? (
                  <Typography.Text type="success">Còn hàng</Typography.Text>
                ) : (
                  <Typography.Text type="danger">Hết hàng</Typography.Text>
                )}
              </Typography.Text>
            </div>
          </div>
        )}
        {showReviews && (
          <div className="mt-4 p-4 rounded-lg bg-[#f0fdf4]">
            <Typography.Title level={2}>Đánh giá sản phẩm</Typography.Title>

            {product.reviews
              // Sort by date, newest first
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((review, index) => (
                <div key={index} className="mt-4">
                  <Space direction="vertical" size="small" className="w-full">
                    <Space align="center">
                      <Typography.Text strong>
                        {userData[review.userID] || "Người dùng ẩn danh"}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {new Date(review.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </Typography.Text>
                    </Space>
                    <Rate disabled defaultValue={review.rating} />
                    <Typography.Paragraph>
                      {review.comment}
                    </Typography.Paragraph>

                    {/* Display review images if available */}
                    {review.imageUrl && review.imageUrl.length > 0 && (
                      <div className="mt-2">
                        <Typography.Text className="text-sm mb-1 block text-gray-500">
                          Hình ảnh đánh giá:
                        </Typography.Text>
                        <Image.PreviewGroup>
                          <div className="flex flex-wrap gap-2">
                            {review.imageUrl.map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="w-16 h-16 rounded overflow-hidden border border-gray-200">
                                <Image
                                  src={img}
                                  alt={`Review image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                  preview={{
                                    mask: (
                                      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-20 group hover:bg-opacity-40 transition-all duration-300">
                                        <ZoomInOutlined className="text-white text-lg" />
                                      </div>
                                    ),
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </Image.PreviewGroup>
                      </div>
                    )}

                    <Divider style={{ margin: "12px 0" }} />
                  </Space>
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
