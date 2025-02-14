import {
  faCartShopping,
  faMagnifyingGlass,
  faPaperPlane,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Badge, Space } from "antd";
import { useState } from "react";
import RegisterForm from "../../../components/register/register";
import LoginForm from "../../../components/login/login";
import ResetPasswordForm from "../../../components/forgotPassword/resetPassword";
import OtpFormqmk from "../../../components/forgotPassword/otpForgot";
import OtpFormdk from "../../../components/register/otpRegister";
import ForgotPasswordForm from "../../../components/forgotPassword/forgotPassword";

const Header = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showOtpFormqmk, setShowOtpFormqmk] = useState(false);
  const [showOtpFormdk, setShowOtpFormdk] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailqmk, setEmailqmk] = useState("");

  const closeLoginForm = () => setShowLoginForm(false);
  const closeResetPasswordForm = () => setShowResetPasswordForm(false);
  const closeOtpFormqmk = () => setShowOtpForm(false);
  const closeOtpFormdk = () => setShowOtpFormdk(false);
  const closeForgotPasswordForm = () => setShowForgotPasswordForm(false);
  const closeRegisterForm = () => setShowRegisterForm(false);

  // Hàm quay lại trang đăng nhập
  const goBack = () => {
    setShowRegisterForm(false); // Đóng form đăng ký
    setShowLoginForm(true); // Mở lại form đăng nhập
  };

  // Mở ResetPassword form khi nhấn "Continue" trong OTP form
  const openResetPasswordForm = () => {
    setShowOtpForm(false); // Đóng form OTP
    setShowResetPasswordForm(true); // Mở form Reset Password
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

  // Mở OTP form qmk với email
  const openOtpFormqmk = (email) => {
    setEmailqmk(emailqmk);
    setShowForgotPasswordForm(false);
    setShowOtpFormqmk(true);
  }


  return (
    <header className="bg-[#82AE46] w-screen flex items-center shadow-md p-2 fixed top-0 z-10 z-index-50">
      <div className="container mx-auto flex w-full justify-between items-center">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="text-white text-l" />
          <div className="text-white text-xl font-bold ml-2">
            +84 333 319 121
          </div>
        </div>

        <div className="flex items-center">
          <FontAwesomeIcon icon={faPaperPlane} className="text-white text-l" />
          <div className="text-white text-xl font-bold ml-2">
            khoinhokboddy@gmail.com
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-white text-xl font-bold bg-[#82AE46] px-4 py-2 rounded"
            onClick={() => setShowLoginForm(true)}>
            <FontAwesomeIcon icon={faUser} className="text-white text-l" /> Đăng
            nhập/ Đăng ký
          </button>
        </div>

        <div className="fixed top-[60px] bg-white w-screen left-0 shadow-md z-10">
          <div className="container flex justify-between items-center center mx-auto">
            <h1 className="text-[#82AE46] text-4xl py-2 font-bold">
              GreenVeggies
            </h1>

            <nav>
              <ul className="flex">
                <li className="mx-4 py-2">
                  <Link to="/" className="font-bold">
                    TRANG CHỦ
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/product" className="font-bold">
                    CỬA HÀNG
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/news" className="font-bold">
                    TIN TỨC
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/posts" className="font-bold">
                    BÀI VIẾT
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/contact" className="font-bold">
                    LIÊN HỆ
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/cart" className="font-bold">
                    <Space size="middle">
                      <Badge count={0} showZero>
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className="text-xl"
                        />
                      </Badge>
                    </Space>
                  </Link>
                </li>
                <li className="mx-4 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="px-3 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-[200px] bg-[#D9D9D9]"
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
            openOtpForm={openOtpFormdk} // Truyền hàm openOtpFormdk để mở OTP form với email
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
          />
        </div>
      )}

      {/* Form OTP */}
      {showOtpFormqmk && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <OtpFormqmk
            emailqmk={emailqmk} // Truyền email vào OtpForm
            closeOtpFormdk={closeOtpFormdk}
            openResetPasswordForm={openResetPasswordForm} // Gọi hàm này khi nhấn Continue
            goBack={() => {
              setShowOtpFormqmk(false);
              setShowForgotPasswordForm(true); // Quay lại ForgotPasswordForm
            }}
          />
        </div>
      )}

      {/* Form OTP2 */}
      {showOtpFormdk && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <OtpFormdk
            closeOtpForm={closeOtpFormdk}
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
            switchToLogin={openLoginForm} // Chuyển sang LoginForm khi đăng ký thành công
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
            openOtpFormqmk={() => {
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
