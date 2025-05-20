import { notification } from "antd"; // Import notification từ Ant Design
import { useState } from "react";
import { forgotPassword } from "../../services/AuthService"; // Import hàm forgotPassword từ AuthService

const ForgotPasswordForm = ({
  closeForgotPasswordForm,
  openLoginForm,
  openOtpFormqmk,
}) => {
  const [emailqmk, setEmailqmk] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Lưu lỗi từ BE
  const [emailError, setEmailError] = useState(""); // Lưu lỗi email từ BE

  const handleChange = (e) => {
    const value = e.target.value;
    setEmailqmk(value);

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Email không đúng định dạng.");
    } else {
      setEmailError(""); // Xóa lỗi nếu email hợp lệ
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset lỗi chung
    setEmailError(""); // Reset lỗi email

    // Kiểm tra nếu email không hợp lệ
    if (!emailqmk) {
      setEmailError("Vui lòng nhập email.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailqmk)) {
      setEmailError("Email không đúng định dạng.");
      setLoading(false);
      return;
    }

    try {
      // Gọi hàm forgotPassword từ AuthService
      const message = await forgotPassword(emailqmk);

      if (message) {
        notification.success({
          message: "Thành công",
          description: message,
          placement: "topRight",
        });
        closeForgotPasswordForm(); // Đóng form quên mật khẩu
        openOtpFormqmk(emailqmk); // Mở form OTP và truyền email
      }
    } catch (err) {
      if (err.email) {
        // Hiển thị lỗi nếu email không tồn tại trong database
        setEmailError(err.email);
      } else if (err.server) {
        // Hiển thị lỗi từ backend nếu hệ thống gặp sự cố
        setError(err.server);
      } else if (err.message) {
        // Hiển thị lỗi chung từ backend
        setError(err.message);
      } else {
        // Hiển thị lỗi mặc định nếu không có thông tin từ backend
        setError("Lỗi kết nối, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
      <button
        onClick={closeForgotPasswordForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
      >
        &times;
      </button>

      <div className="w-1/2 hidden md:flex justify-center items-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPR4Rmg4qFHK7HJE9AYNqHBfG7mCkVgc0_EA&s"
          alt="GreenVeggies"
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className="w-full md:w-1/2 p-6">
        <h2 className="text-xl font-bold text-green-700 text-center">
          GREENVEGGIES
        </h2>
        <h3 className="text-xl font-bold mb-4 text-black text-center">
          Quên mật khẩu?
        </h3>
        <p className="text-center text-gray-500 mb-3">
          Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

        {/* Hiển thị lỗi từ BE */}
        {error && <div className="text-red-500 text-center mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="emailqmk"
              value={emailqmk}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full p-2 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {emailError && (
              <div className="text-red-500 text-sm">{emailError}</div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang gửi OTP..." : "Tiếp tục"}
          </button>

          <div className="text-center text-sm text-gray-500 mt-2">
            <button
              type="button"
              onClick={openLoginForm}
              className="text-green-500 hover:underline"
            >
              Quay lại trang đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
