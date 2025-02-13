import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const footer = () => {
    return (
        <footer>
                <div className="container mx-auto relative bg-[#F7F6F2] p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 ">
                      <h3 className=" text-2xl font-bold text-[#82AE46]">
                        Đăng ký vào Bản tin của chúng tôi
                      </h3>
                      <p className=" text-lg text-gray-700 mt-4">
                        Nhận thông tin cập nhật qua e-mail về các cửa hàng mới nhất và
                        ưu đãi đặc biệt của chúng tôi
                      </p>
                    </div>
                    <div className="p-4  flex items-center">
                      <input
                        type="email"
                        placeholder="Nhập địa chỉ email của bạn"
                        className="p-2 border rounded-l-lg flex-grow"
                      />
                      <button className="p-2 bg-[#82AE46] text-white rounded-r-lg">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </div>
                <div className="container mx-auto relative">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="p-4  ">
                      <h3 className="text-xl font-semibold">GreenVeggies</h3>
                      <p className="text-gray-700 mt-4">
                        Tươi xanh mỗi ngày, trọn vẹn dinh dưỡng!
                      </p>
                      <p className="text-gray-700 ">
                        {" "}
                        <br />{" "}
                      </p>
                      <p className="text-gray-700 ">
                        {" "}
                        <br />{" "}
                      </p>
                      <p className="text-gray-700 text-2xl mt-5">
                        <FontAwesomeIcon icon={faTwitter} className="mr-10" />
                        <FontAwesomeIcon icon={faFacebookF} className="mr-10" />
                        <FontAwesomeIcon icon={faInstagram} className="mr-10" />
                      </p>
                    </div>
                    <div className="p-4  ">
                      <h3 className="text-xl font-semibold">Menu</h3>
                      <p className="text-gray-700 mt-4">Cửa hàng</p>
                      <p className="text-gray-700 mt-4">Về</p>
                      <p className="text-gray-700 mt-4">Bài viết</p>
                      <p className="text-gray-700 mt-4">Liên hệ với chúng tôi</p>
                    </div>
                    <div className="p-4  ">
                      <h3 className="text-xl font-semibold">Hỗ trợ</h3>
                      <p className="text-gray-700 mt-4">Thông tin vận chuyển </p>
                      <p className="text-gray-700 mt-4">Trả hàng & Đổi hàng </p>
                      <p className="text-gray-700 mt-4">Điều khoản và điều kiện</p>
                      <p className="text-gray-700 mt-4">Chính sách bảo mật</p>
                    </div>
                    <div className="p-4  ">
                      <p className="text-gray-700 mt-11">Câu hỏi thường gặp</p>
                      <p className="text-gray-700 mt-4">Liên hệ</p>
                    </div>
                    <div className="p-4  ">
                      <h3 className="text-xl font-semibold">Bạn có câu hỏi?</h3>
                      <p className="text-gray-700 mt-4">
                        {/* Sử dụng icon ở đây */}
                        <FontAwesomeIcon icon={faLocationDot} className=" text-l" /> 12,
                        Phạm Văn Bảo, phường 1, quận Gò Vấp, Thành phố Hồ Chí Minh
                      </p>
                      <p className="text-gray-700 mt-4">
                        {/* Sử dụng icon ở đây */}
                        <FontAwesomeIcon icon={faPhone} className=" text-l" /> +84 333
                        319 121
                      </p>
                      <p className="text-gray-700 mt-4">
                        {/* Sử dụng icon ở đây */}
                        <FontAwesomeIcon icon={faEnvelope} className=" text-l" />{" "}
                        khoinhokboddy@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
    );
};

export default footer;