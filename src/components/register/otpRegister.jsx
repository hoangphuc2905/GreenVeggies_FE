import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { verifyOtpforRegister } from "../../services/AuthService"; // Import hàm verifyOtp từ AuthService

const OtpFormdk = ({ goBack, closeOtpFormdk, openSignupForm, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Lưu lỗi từ BE

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Chỉ cho phép nhập số
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Chuyển focus sang ô tiếp theo
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Chuyển focus sang ô trước đó khi nhấn Backspace
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset lỗi trước khi gửi

    // Lấy email từ localStorage
    const email = localStorage.getItem("verifiedEmail");

    // Gộp OTP thành chuỗi
    const otpValue = otp.join("");

    // Kiểm tra OTP đầy đủ
    if (otpValue.length !== 6) {
      setErrors({ otp: "Vui lòng nhập đầy đủ mã OTP." });
      setLoading(false);
      return;
    }

    try {
      // Gọi API xác thực OTP
      const response = await verifyOtpforRegister(email, otpValue);

      if (response) {
        // Đóng form OTP và mở form đăng ký
        closeOtpFormdk();
        openSignupForm(email); // Mở form đăng ký và truyền email
      }
    } catch (err) {
      // Xử lý lỗi từ backend hoặc lỗi kết nối
      if (err.otp) {
        setErrors({ otp: err.otp }); // Hiển thị lỗi OTP không hợp lệ
      } else if (err.server) {
        setErrors({ server: err.server }); // Hiển thị lỗi server từ backend
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
        onClick={closeOtpFormdk}
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
          Nhập mã OTP
        </h3>
        <p className="text-center text-gray-500 mb-3">
          Nhập mã OTP đã gửi đến email của bạn
        </p>

        {/* Hiển thị lỗi từ BE */}
        {errors.server && (
          <div className="text-red-500 text-center mb-4">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg"
                maxLength="1"
              />
            ))}
          </div>
          {errors.otp && (
            <div className="text-red-500 text-sm text-center">{errors.otp}</div>
          )}

          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Tiếp tục"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpFormdk;
