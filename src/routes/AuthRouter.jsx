import { useState } from "react";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import OtpForm from "./OTPForm";
import OtpFormdk from "./OtpFormdk";
import ForgotPasswordForm from "./ForgotPasswordForm";
import RegisterForm from "./RegisterForm";
import SignupForm from "./SignupForm";
import "./App.css";

export default function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showOtpFormdk, setShowOtpFormdk] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [email, setEmail] = useState("");

  const closeLoginForm = () => setShowLoginForm(false);
  const closeResetPasswordForm = () => setShowResetPasswordForm(false);
  const closeOtpForm = () => setShowOtpForm(false);
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

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <h1 className="text-3xl font-bold underline mb-4 text-center">
        Website GreenVeggies welcomes you!
      </h1>

      {/* Hiển thị nút Login */}
      <div className="text-center">
        <button
          onClick={() => setShowLoginForm(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
          Login
        </button>
      </div>

      {/* Overlay mờ khi modal xuất hiện */}
      {(showLoginForm ||
        showForgotPasswordForm ||
        showOtpForm ||
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
            goBack={() => {
              setShowResetPasswordForm(false);
              setShowOtpForm(true);
            }}
          />
        </div>
      )}

      {/* Form OTP */}
      {showOtpForm && (
        <div className="fixed inset-0 z-20 flex justify-center items-center">
          <OtpForm
            closeOtpForm={closeOtpForm}
            openResetPasswordForm={openResetPasswordForm} // Gọi hàm này khi nhấn Continue
            goBack={() => {
              setShowOtpForm(false);
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
            openOtpForm={() => {
              setShowForgotPasswordForm(false);
              setShowOtpForm(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
