import {
  faCartShopping,
  faMagnifyingGlass,
  faPaperPlane,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { Badge, Space } from "antd";
import { useState, useEffect } from "react";
import RegisterForm from "../../../components/register/register";
import LoginForm from "../../../components/login/login";
import ResetPasswordForm from "../../../components/forgotPassword/resetPassword";
import OtpFormqmk from "../../../components/forgotPassword/otpForgot";
import OtpFormdk from "../../../components/register/otpRegister";
import ForgotPasswordForm from "../../../components/forgotPassword/forgotPassword";
import SignupForm from "../../../components/register/registerForm";

import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";

import { getUserInfo } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin người dùng
// import { User } from "lucide-react";

const Header = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showOtpFormqmk, setShowOtpFormqmk] = useState(false);
  const [showOtpFormdk, setShowOtpFormdk] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [email, setEmail] = useState("");

  const [user, setUser] = useState(null); // Thêm trạng thái để lưu thông tin người dùng

  const [emailqmk, setEmailqmk] = useState("");
  const [otpqmk, setOtpqmk] = useState("");

  const closeLoginForm = () => setShowLoginForm(false);
  const closeResetPasswordForm = () => setShowResetPasswordForm(false);
  const closeOtpFormqmk = () => setShowOtpFormqmk(false);
  const closeOtpFormdk = () => setShowOtpFormdk(false);
  const closeForgotPasswordForm = () => setShowForgotPasswordForm(false);
  const closeRegisterForm = () => setShowRegisterForm(false);
  const closeSignupForm = () => setShowSignupForm(false);

  // Hàm quay lại trang đăng nhập
  const goBack = () => {
    setShowRegisterForm(false); // Đóng form đăng ký
    setShowLoginForm(true); // Mở lại form đăng nhập
  };

  // Mở ResetPassword form khi nhấn "Continue" trong OTP form
  const openResetPasswordForm = (emailqmk, otpqmk) => {
    setShowOtpFormqmk(false); // Đóng form OTP
    setShowResetPasswordForm(true); // Mở form Reset Password
    setEmailqmk(emailqmk); // Truyền email vào form Reset Password
    setOtpqmk(otpqmk); // Truyền OTP vào form Reset Password
  };

  // Mở Signup form khi nhấn "Continue" trong OTP form 2
  const openSignupForm = () => {
    setShowOtpFormdk(false); // Đóng form OTP 2
    setShowSignupForm(true); // Mở form Signup
  };

  // Mở Login form khi đăng ký thành công
  const openLoginForm = () => {
    setShowSignupForm(false); // Đóng form Signup
    setShowLoginForm(true); // Mở form Login
  };

  // Mở OTP form dk với email
  const openOtpFormdk = (email) => {
    setEmail(email);
    setShowRegisterForm(false);
    setShowOtpFormdk(true);
  };

  // Hàm xử lý đăng nhập thành công
  const handleLoginSuccess = async (userData) => {
    try {
      const userInfo = await getUserInfo(userData.user.id, userData.token); // Gọi API lấy thông tin người dùng
      console.log("User info:", userInfo); // Kiểm tra dữ liệu API trả về
      setUser(userInfo); // Cập nhật trạng thái user với thông tin người dùng
      setShowLoginForm(false);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userId", userData.user.id); // Lưu id vào localStorage
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("Token:", token);
    console.log("UserId:", userId);
    if (token && userId) {
      getUserInfo(userId, token)
        .then((userInfo) => {
          console.log("Fetched user:", userInfo); // Kiểm tra user lấy từ API
          setUser(userInfo); // Cập nhật trạng thái user với thông tin người dùng
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Mở OTP form qmk với email
  const openOtpFormqmk = (emailqmk) => {
    setEmailqmk(emailqmk);
    setShowForgotPasswordForm(false);
    setShowOtpFormqmk(true);
  };
  const items = [
    {
      key: "1",
      label: "Chào! Ngày mới vui vẻ",
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <Link to="/profile">Thông tin cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: "Đổi mật khẩu",
      icon: <SettingOutlined />,
    },
    {
      key: "4",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
    },
  ];

  const location = useLocation();
  const isHomeActive = location.pathname === "/";
  const isProductActive = location.pathname.startsWith("/product");
  const isNewsActive = location.pathname.startsWith("/news");
  const isCartActive = location.pathname.startsWith("/wishlist");

  return (
    <header className="bg-[#82AE46] w-full max-w-screen flex items-center shadow-md px-6 py-4 fixed top-0 z-50">
      <div className="container mx-auto flex w-full justify-between items-center ">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="text-white text-l " />
          <div className="text-white text-l font-bold ml-2">
            +84 333 319 121
          </div>
        </div>

        <div className="flex items-center">
          <FontAwesomeIcon icon={faPaperPlane} className="text-white text-l" />
          <div className="text-white text-l font-bold ml-2">
            khoinhokboddy@gmail.com
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="text-white text-l font-bold">
              Xin chào, {user.username}
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-white text-l "
                    />
                  </Space>
                </a>
              </Dropdown>
            </div>
          ) : (
            <button
              className="text-white text-l font-bold bg-[#82AE46] px-4 py-2 rounded"
              onClick={() => setShowLoginForm(true)}
            >
              <FontAwesomeIcon icon={faUser} className="text-white text-l" />{" "}
              Đăng nhập/ Đăng ký
            </button>
          )}
        </div>

        <div className="fixed top-[50px] bg-white w-screen left-0 shadow-md z-10">
          <div className="container flex justify-between items-center center mx-auto">
            <h1 className="text-[#82AE46] text-3xl py-2 font-bold">
              GreenVeggies
            </h1>

            <nav>
              <ul className="flex">
                {/* Trang chủ */}
                <li
                  className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                    isHomeActive
                      ? "text-[#82AE46] underline font-bold"
                      : "hover:text-[#82AE46] hover:underline active:scale-95"
                  }`}
                >
                  <Link to="/" className="font-bold" onClick={scrollToTop}>
                    TRANG CHỦ
                  </Link>
                </li>

                {/* Cửa hàng */}
                <li
                  className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                    isProductActive
                      ? "text-[#82AE46] underline font-bold"
                      : "hover:text-[#82AE46] hover:underline active:scale-95"
                  }`}
                >
                  <Link
                    to="/product"
                    className="font-bold"
                    onClick={scrollToTop}
                  >
                    CỬA HÀNG
                  </Link>
                </li>
                <li
                  className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                    isNewsActive
                      ? "text-[#82AE46] underline font-bold"
                      : "hover:text-[#82AE46] hover:underline active:scale-95"
                  }`}
                >
                  <Link to="/news" className="font-bold" onClick={scrollToTop}>
                    TIN TỨC
                  </Link>
                </li>
                <li className="mx-4 py-2 text-sm mt-1 hover:text-[#82AE46] hover:underline active:scale-95 transition-all duration-200">
                  <Link to="/posts" className="font-bold" onClick={scrollToTop}>
                    BÀI VIẾT
                  </Link>
                </li>
                <li className="mx-4 py-2 text-sm mt-1 hover:text-[#82AE46] hover:underline active:scale-95 transition-all duration-200">
                  <Link
                    to="/contact"
                    className="font-bold"
                    onClick={scrollToTop}
                  >
                    LIÊN HỆ
                  </Link>
                </li>
                <li
                  className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                    isCartActive
                      ? "text-[#82AE46] underline font-bold"
                      : "hover:text-[#82AE46] hover:underline active:scale-95"
                  }`}
                >
                  <Link
                    to="/wishlist"
                    className="font-bold"
                    onClick={scrollToTop}
                  >
                    <Space size="middle">
                      <Badge count={0} showZero>
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className={`text-xl ${
                            isCartActive ? "text-[#82AE46]" : ""
                          }`}
                        />
                      </Badge>
                    </Space>
                  </Link>
                </li>

                <li className="mx-4 relative hover:text-[#82AE46] hover:underline active:scale-95 transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="px-3 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-[300px] bg-[#D9D9D9]"
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black-500"
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Overlay mờ khi modal xuất hiện */}
      {(showLoginForm ||
        showForgotPasswordForm ||
        showOtpFormqmk ||
        showOtpFormdk ||
        showRegisterForm ||
        showResetPasswordForm ||
        showSignupForm) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-10"></div>
      )}

      {/* Modal Register Form */}
      {showRegisterForm && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <RegisterForm
            closeRegisterForm={closeRegisterForm}
            openOtpFormdk={openOtpFormdk} // Truyền hàm openOtpFormdk để mở OTP form với email
            goBack={goBack} // Truyền goBack để quay lại đăng nhập
          />
        </div>
      )}

      {/* Modal Login Form */}
      {showLoginForm && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <LoginForm
            closeLoginForm={closeLoginForm}
            openForgotPasswordForm={() => {
              setShowLoginForm(false);
              setShowForgotPasswordForm(true);
            }}
            switchToRegister={() => {
              setShowLoginForm(false);
              setShowRegisterForm(true); // Chuyển sang Register Form khi chọn Sign up
            }}
            onLoginSuccess={handleLoginSuccess} // Truyền hàm xử lý đăng nhập thành công
          />
        </div>
      )}

      {/* Form Reset Password */}
      {showResetPasswordForm && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <ResetPasswordForm
            closeResetPasswordForm={closeResetPasswordForm}
            openOtpFormqmk={openOtpFormqmk}
            goBack={() => {
              setShowResetPasswordForm(false);
              setShowOtpFormqmk(true); // Quay lại OtpFormqmk
            }}
            emailqmk={emailqmk} // Truyền email vào ResetPasswordForm
            otpqmk={otpqmk} // Truyền OTP vào ResetPasswordForm
          />
        </div>
      )}

      {/* Form OTP */}
      {showOtpFormqmk && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <OtpFormqmk
            closeOtpForm={closeOtpFormqmk}
            openResetPasswordForm={openResetPasswordForm} // Gọi hàm này khi nhấn Continue
            goBack={() => {
              setShowOtpFormqmk(false);
              setShowForgotPasswordForm(true); // Quay lại ForgotPasswordForm
            }}
            emailqmk={emailqmk} // Truyền email vào OtpForm
          />
        </div>
      )}

      {/* Form OTP2 */}
      {showOtpFormdk && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <OtpFormdk
            closeOtpFormdk={closeOtpFormdk}
            openSignupForm={openSignupForm} // Gọi hàm này khi nhấn Continue
            goBack={() => {
              setShowOtpFormdk(false);
              setShowRegisterForm(true); // Quay lại RegisterForm
            }}
            email={email} // Truyền email vào OtpFormdk
          />
        </div>
      )}

      {/* Form Signup */}
      {showSignupForm && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <SignupForm
            switchToLogin={openLoginForm}
            email={email} // Chuyển sang LoginForm khi đăng ký thành công
          />
        </div>
      )}

      {/* Form Forgot Password */}
      {showForgotPasswordForm && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <ForgotPasswordForm
            closeForgotPasswordForm={closeForgotPasswordForm}
            openLoginForm={() => {
              setShowForgotPasswordForm(false);
              setShowLoginForm(true);
            }}
            openOtpFormqmk={(emailqmk) => {
              setEmailqmk(emailqmk);
              setShowForgotPasswordForm(false);
              setShowOtpFormqmk(true);
            }}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
