import { ArrowLeft } from "lucide-react"; // Import the left arrow icon
import { useState } from "react";
import { sendOtp } from "../../services/AuthService";

const RegisterForm = ({ goBack, closeRegisterForm, openOtpFormdk }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Lưu lỗi từ BE

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Kiểm tra định dạng email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setErrors({ email: "Vui lòng nhập địa chỉ email hợp lệ." });
    } else {
      setErrors({}); // Xóa lỗi nếu email hợp lệ
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra email trước khi gửi
    if (!email) {
      setErrors({ email: "Vui lòng nhập email." });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Vui lòng nhập địa chỉ email hợp lệ." });
      return;
    }

    setLoading(true);
    setErrors({}); // Reset lỗi trước khi gửi

    try {
      // Gọi hàm gửi OTP từ AuthService
      const message = await sendOtp(email);

      // Nếu thành công, lưu email và mở form OTP
      localStorage.setItem("verifiedEmail", email);
      closeRegisterForm();
      openOtpFormdk(email);
    } catch (err) {
      // Hiển thị lỗi từ backend hoặc lỗi kết nối
      if (err.email) {
        setErrors({ email: err.email }); // Lỗi email không hợp lệ
      } else if (err.server) {
        setErrors({ server: err.server }); // Lỗi server từ backend
      } else {
        setErrors({ server: err.message || "Lỗi kết nối. Vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
      {/* Nút quay lại */}
      <button
        onClick={goBack}
        className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Nút đóng */}
      <button
        onClick={closeRegisterForm}
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
          Đăng ký tài khoản
        </h3>
        <p className="text-center text-gray-500 mb-3">
          Vui lòng nhập địa chỉ email để nhận mã xác thực
        </p>

        {/* Hiển thị lỗi từ BE */}
        {errors.server && (
          <div className="text-red-500 text-center mb-4">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang gửi mã..." : "Tiếp tục"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-2">
          <button onClick={goBack} className="text-green-500 hover:underline">
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
