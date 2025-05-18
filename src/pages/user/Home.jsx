import { useState, useEffect } from "react";
import { getAllReviews } from "../../services/ReviewService";

import Countdown from "react-countdown";
// Đặt thời gian đếm ngược
const countdownDate = new Date("2025-04-13T00:00:00").getTime();

import bgImage from "../../../src/assets/pictures/bg.png";
import bg1Image from "../../../src/assets/pictures/bg1.png";
import bg2Image from "../../../src/assets/pictures/bg2.png";
import shipImage from "../../../src/assets/pictures/ship.png";
import alwayImage from "../../../src/assets/pictures/alway.png";
import supportImage from "../../../src/assets/pictures/support.png";
import qualityImage from "../../../src/assets/pictures/quality.png";
import categoryImage from "../../../src/assets/pictures/category1.png";
import category1Image from "../../../src/assets/pictures/category11.png";
import category2Image from "../../../src/assets/pictures/category-2.png";
import category3Image from "../../../src/assets/pictures/category-3.png";
import category4Image from "../../../src/assets/pictures/category-4.png";
import bg3Image from "../../../src/assets/pictures/bg_3_1.png";

import Menu from "./layouts/Menu";
import { useNavigate } from "react-router-dom";
import { Carousel, Image, Rate, Spin } from "antd";
import Favourite from "./layouts/Favourite";
import { formattedPrice } from "../../components/calcSoldPrice/CalcPrice";
import { ZoomInOutlined } from "@ant-design/icons";
import { getProducts, getProductById } from "../../services/ProductService";

const images = [
  {
    id: 1,
    src: bgImage,
    description: "100% FRESH & ORGANIC FOODS",
    subText: "CHÚNG TÔI PHÂN PHỐI RAU CỦ VÀ TRÁI CÂY",
  },
  { id: 2, src: bg1Image },
  { id: 3, src: bg2Image },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const data = await getProducts();

        // Get random products for featured section
        const randomProductIds = getRandomProducts(data, 6).map(
          (product) => product.productID
        );

        // Fetch detailed product information for each featured product
        const detailedProducts = await Promise.all(
          randomProductIds.map(async (productID) => {
            const productDetails = await getProductById(productID);
            return productDetails;
          })
        );

        // Filter out any null results
        const validProducts = detailedProducts.filter((product) => product);
        setFeaturedProducts(validProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await getAllReviews();

        // Lấy thông tin chi tiết của sản phẩm cho mỗi đánh giá
        const reviewsWithProductDetails = await Promise.all(
          data.map(async (review) => {
            if (review.productID) {
              // ProductID nằm trực tiếp trong review, không phải trong object product
              const productDetails = await getProductById(review.productID);
              return {
                ...review,
                product: productDetails, // Lưu thông tin sản phẩm vào thuộc tính product
                _id: review._id, // Đảm bảo _id của review được giữ lại
              };
            }
            return review;
          })
        );

        console.log("Reviews with product details:", reviewsWithProductDetails);
        setReviews(reviewsWithProductDetails);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`, {
      state: { productID: product.productID },
    });
  };

  const getRandomProducts = (products, count) => {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col px-[10%]">
      <div className="container mx-auto mt-[100px]">
        <Carousel arrows autoplay infinite={false}>
          {images.map((item) => (
            <div key={item.id} className="">
              <img
                src={item.src}
                alt="Mô tả hình ảnh"
                className="w-full h-[70vh] object-fill"
              />
              {item.description && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h2 className="text-white text-6xl md:text-8xl font-bold font-amatic">
                    {item.description}
                  </h2>
                  <h3 className="text-white text-lg md:text-xl font-bold mt-4">
                    {item.subText}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </Carousel>
      </div>

      <div className="relative container mx-auto mt-5">
        <div className="flex flex-wrap">
          {/* Danh mục bên trái */}
          <div className="w-full md:w-1/4 ">
            <Menu />
            <div className=" mt-6 overflow-y-auto overflow-x-hidden max-h-[max] pr-2">
              {/* Sản phẩm bạn có thể thích */}
              <Favourite />
            </div>
          </div>

          {/* Phần nội dung bên phải chiếm phần còn lại */}
          <div className="w-full md:w-3/4 p-4">
            {/* Hàng trên: 4 cột */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center  hover:shadow-xl hover:scale-105">
                {/* Lấy hình ảnh */}
                <div className="container mx-auto relative h-[120px]">
                  <img
                    src={shipImage}
                    alt="Mô tả hình ảnh"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin vận chuyển */}
                <div className="mt-4 text-center text-xl font-bold  ">
                  MIỄN PHÍ VẬN CHUYỂN
                  <div className="text-base text-[#BCBCBC]">
                    CHO ĐƠN HÀNG TRÊN 100.000đ
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center  hover:shadow-xl hover:scale-105">
                {/* Lấy hình ảnh */}
                <div className="container mx-auto relative h-[120px]">
                  <img
                    src={alwayImage}
                    alt="Mô tả hình ảnh"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin vận chuyển */}
                <div className="mt-4 text-center text-xl font-bold  ">
                  LUÔN LUÔN
                  <div className="text-base text-[#BCBCBC]">
                    SẢN PHẨM ĐƯỢC ĐÓNG GÓI TỐT
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center  hover:shadow-xl hover:scale-105">
                {/* Lấy hình ảnh */}
                <div className="container mx-auto relative h-[120px]">
                  <img
                    src={qualityImage}
                    alt="Mô tả hình ảnh"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin vận chuyển */}
                <div className="mt-4 text-center text-xl font-bold">
                  CHẤT LƯỢNG VƯỢT TRỘI
                  <div className="text-base text-[#BCBCBC]">
                    SẢN PHẨM CHẤT LƯỢNG
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center  hover:shadow-xl hover:scale-105">
                {/* Lấy hình ảnh */}
                <div className="container mx-auto relative h-[120px]">
                  <img
                    src={supportImage}
                    alt="Mô tả hình ảnh"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin vận chuyển */}
                <div className="mt-4 text-center text-xl font-bold">
                  HỖ TRỢ
                  <div className="text-base text-[#BCBCBC]">HỖ TRỢ 24/7</div>
                </div>
              </div>
            </div>

            {/* Hàng dưới: 3 cột, 2 hàng */}
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
              <div className="text-white rounded-lg shadow-md min-h-[180px] flex items-center justify-center overflow-hidden ">
                <img
                  src={category1Image}
                  alt="Mô tả hình ảnh"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[#82AE46] rounded-lg shadow-md min-h-[180px] flex items-center justify-center row-span-2 overflow-hidden relative">
                <img
                  src={categoryImage}
                  alt="Mô tả hình ảnh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 text-center text-lg ">
                  RAU CỦ & QUẢ <br />
                  <div className="text-base text-[#BCBCBC]">
                    Bảo vệ sức khỏe của mọi ngôi nhà
                  </div>
                </div>
              </div>
              <div className="text-white rounded-lg shadow-md min-h-[180px] flex items-center justify-center overflow-hidden">
                <img
                  src={category3Image}
                  alt="Mô tả hình ảnh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white rounded-lg shadow-md min-h-[180px] flex items-center justify-center overflow-hidden">
                <img
                  src={category2Image}
                  alt="Mô tả hình ảnh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white rounded-lg shadow-md min-h-[180px] flex items-center justify-center overflow-hidden">
                <img
                  src={category4Image}
                  alt="Mô tả hình ảnh"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-center text-[#82AE46] text-3xl mt-6">
                Sản phẩm nổi bật
              </h3>
            </div>

            <div>
              <h3 className="text-center text-3xl mt-6">
                Sản phẩm của chúng tôi
              </h3>
            </div>

            <div>
              <h3 className="text-center text-[#BCBCBC] text-2xl mt-6">
                Tươi xanh mỗi ngày, trọn vẹn dinh dưỡng!
              </h3>
            </div>

            <Spin
              spinning={productsLoading}
              tip="Đang tải sản phẩm..."
              className="[&_.ant-spin-dot]:!text-[#82AE46] [&_.ant-spin-text]:!text-[#82AE46]">
              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 min-h-[450px]">
                {featuredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg shadow-md w-full md:w-[fit] h-[300px] m-4 relative cursor-pointer hover:shadow-xl hover:scale-105"
                    onClick={() => handleProductClick(product)}>
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
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-700 font-bold text-center">
                      {product.name}
                    </p>
                    <p className="text-gray-700 text-center">
                      {product.oldPrice && (
                        <span className="line-through">
                          {product.oldPrice}đ
                        </span>
                      )}{" "}
                      <span className="text-gray-700">
                        {formattedPrice(product.price)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </Spin>
          </div>
        </div>

        <div className="container mx-auto relative z-0">
          {/* {Lấy ảnh}  */}
          <img
            src={bg3Image}
            alt="Mô tả hình ảnh"
            className="w-full h-[80vh] object-fill"
          />
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
            <div className="p-4 rounded-lg">{/* Nội dung cột 1 */}</div>
            <div className="p-4 rounded-lg">
              <div className="">
                <h2 className="text-[#82AE46] text-2xl font-bold mt-8">
                  Giá tốt nhất cho bạn
                </h2>
                <h3 className="text-5xl font-bold mt-10">Ưu đãi trong ngày</h3>
                <h3 className="text-xl mt-10 text-[#BCBCBC]">
                  Rau củ quả tươi sạch, an toàn và giàu dinh dưỡng – cam kết
                  chất lượng từ trang trại đến bàn ăn
                </h3>
                <h2 className="text-[#82AE46] text-3xl mt-6">Rau Xanh</h2>
                <h3 className="text-xl font-bold mt-8 text-gray-700">
                  20.000đ bây giờ chỉ còn{" "}
                  <span className="text-[#82AE46]">10.000đ</span>
                </h3>

                <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-8">
                  <Countdown
                    date={countdownDate}
                    renderer={({ days, hours, minutes, seconds }) => (
                      <>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-4xl text-[#82AE46] font-semibold">
                            {days}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-4xl text-[#82AE46] font-semibold">
                            {hours}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-4xl text-[#82AE46] font-semibold">
                            {minutes}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-4xl text-[#82AE46] font-semibold">
                            {seconds}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-lg font-semibold">DAY</h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-lg font-semibold">HOUR</h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-lg font-semibold">MINUTES</h3>
                        </div>
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <h3 className="text-lg font-semibold">SECONDS</h3>
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto relative">
          <h3 className="text-center text-[#82AE46] text-4xl mt-10">
            Đánh giá của khách hàng
          </h3>
          <h3 className="text-center text-6xl mt-10">
            Khách hàng hài lòng của chúng tôi nói rằng
          </h3>
          <h3 className="text-center text-[#BCBCBC] text-2xl mt-6">
            Khách hàng của chúng tôi đánh giá cao rau củ quả tươi ngon, an toàn
            và giàu dinh dưỡng, mang đến bữa ăn chất lượng cho gia đình!
          </h3>

          <Spin
            spinning={reviewsLoading}
            tip="Đang tải đánh giá..."
            className="mt-10 [&_.ant-spin-dot]:!text-[#82AE46] [&_.ant-spin-text]:!text-[#82AE46]">
            <div className="min-h-[300px]">
              <Carousel
                autoplay
                dots={true}
                infinite={true}
                className="mt-10"
                slidesToShow={3}
                slidesToScroll={3}>
                {reviews
                  .filter((review) => review.rating === 5)
                  .map((review, index) => {
                    return (
                      <div key={index} className="p-4 text-center">
                        <div className="mx-auto relative h-[200px] w-[200px]">
                          <img
                            src={
                              review.user?.avatar ||
                              "https://via.placeholder.com/200?text=User"
                            }
                            alt={`Ảnh của ${
                              review.user?.username || "Khách hàng"
                            }`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <p className="mt-4 font-semibold text-black">
                          Khách hàng : {review.user?.username || "Khách hàng"}
                        </p>
                        <p
                          className="mt-4 font-semibold text-black cursor-pointer hover:text-[#82AE46] transition-colors"
                          onClick={() => {
                            if (review._id && review.productID) {
                              navigate(`/product/${review._id}`, {
                                state: { productID: review.productID },
                              });
                            }
                          }}>
                          Tên sản phẩm : {review.product?.name || "Sản phẩm"}
                        </p>
                        <h3 className="text-xl font-semibold mt-4">
                          Nhận xét : {review.comment}
                        </h3>
                        <div className="mt-2 flex justify-center">
                          <Rate disabled defaultValue={review.rating} />
                        </div>

                        {/* Display review images if available */}
                        {review.imageUrl && review.imageUrl.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">
                              Hình ảnh đánh giá:
                            </p>
                            <div className="flex justify-center gap-2">
                              <Image.PreviewGroup>
                                {review.imageUrl
                                  .slice(0, 3)
                                  .map((img, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className="w-16 h-16 rounded overflow-hidden">
                                      <Image
                                        src={img}
                                        alt={`Ảnh đánh giá ${imgIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        preview={{
                                          mask: (
                                            <div className="flex items-center justify-center">
                                              <ZoomInOutlined className="text-white" />
                                            </div>
                                          ),
                                        }}
                                      />
                                    </div>
                                  ))}
                                {review.imageUrl.length > 3 && (
                                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-500">
                                      +{review.imageUrl.length - 3}
                                    </span>
                                  </div>
                                )}
                              </Image.PreviewGroup>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </Carousel>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Home;
