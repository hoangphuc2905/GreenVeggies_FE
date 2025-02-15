import { useState, useEffect } from "react";
import { getProducts } from "../../api/api";

import Countdown from "react-countdown";
// Đặt thời gian đếm ngược
const countdownDate = new Date("2025-04-13T00:00:00").getTime();

import bgImage from "../../../src/assets/bg.png";
import shipImage from "../../../src/assets/ship.png";
import alwayImage from "../../../src/assets/alway.png";
import supportImage from "../../../src/assets/support.png";
import qualityImage from "../../../src/assets/quality.png";
import categoryImage from "../../../src/assets/category1.png";
import category1Image from "../../../src/assets/category11.png";
import category2Image from "../../../src/assets/category-2.png";
import category3Image from "../../../src/assets/category-3.png";
import category4Image from "../../../src/assets/category-4.png";
import bg3Image from "../../../src/assets/bg_3_1.png";
import personImage from "../../../src/assets/person_1.png";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import Menu from "./layouts/Menu";

import { Carousel } from "antd";

const reviews = [
  {
    name: "Nguyễn Minh Thuận",
    role: "UI Designer",
    review:
      "Rau củ ở đây luôn tươi ngon, sạch sẽ và giao hàng rất nhanh! Gia đình tôi rất yên tâm khi sử dụng.",
    image: personImage,
  },
  {
    name: "Phạm Đăng Khôi",
    role: "Web Developer",
    review:
      "Sản phẩm chất lượng, rau giòn ngọt, trái cây tươi mọng. Mua nhiều lần rồi mà lần nào cũng hài lòng!",
    image: personImage,
  },
  {
    name: "Huỳnh Hoàng Phúc",
    role: "System Analyst",
    review:
      "Dịch vụ tuyệt vời, rau củ đúng chuẩn organic, ăn rất an toàn. Chắc chắn sẽ tiếp tục ủng hộ!",
    image: personImage,
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="h-screen w-full bg-green-50 flex flex-col">
      {/* //<Headers */}
      <Header />

      {/* Content */}

      {/* Lấy hình ảnh */}
      <div className="container mx-auto relative">
        <img src={bgImage} alt="Mô tả hình ảnh" className="w-full h-auto" />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white text-6xl md:text-8xl font-bold  font-amatic">
            100% FRESH & ORGANIC FOODS
          </h2>
          <h3 className="text-white text-lg md:text-xl font-bold  mt-4">
            CHÚNG TÔI PHÂN PHỐI RAU CỦ VÀ TRÁI CÂY
          </h3>
        </div>
      </div>

      {/* Danh mục sản phẩm */}
      <div className="container mx-auto mt-5">
        <div className="flex flex-wrap">
          {/* Danh mục bên trái */}
          <div className="w-full md:w-1/4 ">
            <Menu />

            {/* Sản phẩm bạn có thể thích */}
            <div>
              <h2 className="text-white text-2xl bg-[#82AE46] rounded-[15px] p-4 text-center mt-6 w-full">
                Bạn có thể thích
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map((product, index) => (
                  <div className="flex mt-4" key={index}>
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
                      <p className="text-gray-700 font-bold">
                        {product.price}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phần nội dung bên phải chiếm phần còn lại */}
          <div className="w-full md:w-3/4 p-4">
            {/* Hàng trên: 4 cột */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center">
                {/* Lấy hình ảnh */}
                <div className="container mx-auto relative h-[120px]">
                  <img
                    src={shipImage}
                    alt="Mô tả hình ảnh"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin vận chuyển */}
                <div className="mt-4 text-center text-xl font-bold">
                  MIỄN PHÍ VẬN CHUYỂN
                  <div className="text-base text-[#BCBCBC]">
                    CHO ĐƠN HÀNG TRÊN 100.000đ
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center">
                {/* Lấy hình ảnh */}
                <div className="container mx-auto relative h-[120px]">
                  <img
                    src={alwayImage}
                    alt="Mô tả hình ảnh"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin vận chuyển */}
                <div className="mt-4 text-center text-xl font-bold">
                  LUÔN LUÔN
                  <div className="text-base text-[#BCBCBC]">
                    SẢN PHẨM ĐƯỢC ĐÓNG GÓI TỐT
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center">
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

              <div className="p-6 rounded-lg shadow-md min-h-[250px] flex flex-col items-center">
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
              <div className="text-white rounded-lg shadow-md min-h-[180px] flex items-center justify-center overflow-hidden">
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

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-md w-full md:w-[300px] h-[300px] m-4 relative">
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
                      className="w-full h-full object-over"
                    />
                  </div>
                  <p className="text-gray-700 font-bold text-center">
                    {product.name}
                  </p>
                  <p className="text-gray-700 text-center">
                    {product.oldPrice && (
                      <span className="line-through">{product.oldPrice}đ</span>
                    )}{" "}
                    <span className="text-gray-700">{product.price}đ</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto relative z-0">
          {/* {Lấy ảnh}  */}
          <img src={bg3Image} alt="Mô tả hình ảnh" className="w-full h-auto" />
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

          <Carousel autoplay dots={true} className="mt-10">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 text-center">
                <div className="mx-auto relative h-[200px] w-[200px]">
                  <img
                    src={review.image}
                    alt={`Ảnh của ${review.name}`}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <p className="mt-4">{review.review}</p>
                <h3 className="text-xl font-semibold mt-4">{review.name}</h3>
                <p className="text-sm">{review.role}</p>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
