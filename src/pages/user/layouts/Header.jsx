import {
  faPaperPlane,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import useLogout from "../../../components/logout/Logout";
import { Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Space } from "antd";
import { useState, useEffect } from "react";
import RegisterForm from "../../../components/register/register";
import LoginForm from "../../../components/login/login";
import ResetPasswordForm from "../../../components/forgotPassword/resetPassword";
import OtpFormqmk from "../../../components/forgotPassword/otpForgot";
import OtpFormdk from "../../../components/register/otpRegister";
import ForgotPasswordForm from "../../../components/forgotPassword/forgotPassword";
import SignupForm from "../../../components/register/registerForm";
import Navbar from "./Navbar";
import { getShoppingCartByUserId } from "../../../api/api";
import {
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";

import { getUserInfo } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin người dùng

const Header = () => {
  const navigate = useNavigate();

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
      const userInfo = await getUserInfo(userData.user.userID, userData.token); // Gọi API lấy thông tin người dùng
      console.log("User info:", userInfo); // Kiểm tra dữ liệu API trả về
      setUser(userInfo); // Cập nhật trạng thái user với thông tin người dùng
      localStorage.setItem("token", userData.token);
      localStorage.setItem("email", userData.user.email); // Lưu email vào localStorage
      localStorage.setItem("userID", userData.user.userID); // Lưu id vào localStorage

      const shoppingCart = await getShoppingCartByUserId(userData.user.userID);
      console.log("Shopping cart:", shoppingCart); // Debugging statement

      if (userInfo.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    console.log("Token:", token);
    console.log("userID:", userID);
    if (token && userID) {
      getUserInfo(userID, token)
        .then(async (userInfo) => {
          console.log("Fetched user:", userInfo); // Kiểm tra user lấy từ API
          setUser(userInfo); // Cập nhật trạng thái user với thông tin người dùng

          // Lấy giỏ hàng từ API và cập nhật trạng thái cartItemCount
          const shoppingCart = await getShoppingCartByUserId(userID);
          console.log("Shopping cart on mount:", shoppingCart); // Debugging statement
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

  // Mở OTP form qmk với email
  const openOtpFormqmk = (emailqmk) => {
    setEmailqmk(emailqmk);
    setShowForgotPasswordForm(false);
    setShowOtpFormqmk(true);
  };
  const handleLogout = useLogout();

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
      label: <Link to="/user/profile">Thông tin cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: <Link to="/user/change-password">Cập nhật mật khẩu</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "4",
      label: <Link to="/user/address">Địa chỉ của bạn</Link>,
      icon: <GlobalOutlined />,
    },
    {
      key: "5",
      label: <Link to="/user/orders">Đơn hàng đã đặt</Link>,
      icon: <ShoppingOutlined />,
    },
    {
      key: "6",
      label: <div onClick={handleLogout}>Đăng xuất</div>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-[#82AE46] to-[#5A8E1B]  w-full max-w-screen flex items-center shadow-md py-4 fixed top-0 z-50 left-0  px-[10%]">
      <div className="container mx-auto flex w-full justify-between items-center  ">
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
        <div className="flex items-center space-x-4 cursor-pointer">
          {user ? (
            <div className="text-white text-l font-bold flex items-center space-x-2">
              <span className="text-white">Xin chào, {user.username}</span>
              <Dropdown
                menu={{
                  items,
                }}
                className="ml-2"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover absolute top-2"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-white text-l"
                      />
                    )}
                  </Space>
                </a>
              </Dropdown>
            </div>
          ) : (
            <button
              className="text-white text-l font-bold px-4 rounded hover:cursor-pointer"
              onClick={() => setShowLoginForm(true)}
            >
              <FontAwesomeIcon icon={faUser} className="text-white text-l" />{" "}
              Đăng nhập/ Đăng ký
            </button>
          )}
        </div>
        <Navbar />
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
