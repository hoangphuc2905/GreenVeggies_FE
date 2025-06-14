import { notification } from "antd"; // Import notification từ Ant Design
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { verifyOtp } from "../../services/AuthService"; // Import hàm verifyOtp từ AuthService

const OtpFormqmk = ({
  goBack,
  closeOtpForm,
  openResetPasswordForm,
  emailqmk,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Lưu lỗi từ BE
  const [success, setSuccess] = useState(""); // Lưu thông báo thành công từ BE

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Chỉ cho phép nhập số
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Chuyển focus sang ô tiếp theo khi nhập xong
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Chuyển focus về ô trước đó khi nhấn Backspace
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset lỗi
    setSuccess(""); // Reset thông báo thành công

    // Kết hợp các chữ số OTP thành một chuỗi
    const otpValue = otp.join("");

    // Kiểm tra nếu OTP chưa được điền đầy đủ
    if (otpValue.length < otp.length) {
      setError("Vui lòng nhập đầy đủ mã OTP.");
      setLoading(false);
      return;
    }

    try {
      // Gọi hàm verifyOtp từ AuthService
      const message = await verifyOtp(emailqmk, otpValue);

      if (message) {
        notification.success({
          message: "Thành công",
          description: message,
          placement: "topRight",
        });
        setSuccess("OTP đã được xác nhận!");
        localStorage.setItem("verifiedOtp", otpValue); // Lưu OTP vào localStorage
        localStorage.setItem("verifiedEmail", emailqmk); // Lưu email vào localStorage
        closeOtpForm(); // Đóng form OTP
        openResetPasswordForm(emailqmk, otpValue); // Mở form đặt lại mật khẩu
      }
    } catch (err) {
      if (err.otp) {
        setError(err.otp); // Hiển thị lỗi OTP không hợp lệ
      } else if (err.server) {
        setError(err.server); // Hiển thị lỗi từ backend
      } else {
        setError("Lỗi kết nối, vui lòng thử lại."); // Hiển thị lỗi mặc định
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
        onClick={closeOtpForm}
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
          Nhập mã OTP QMK
        </h3>
        <p className="text-center text-gray-500 mb-3">
          Nhập mã OTP đã gửi đến email của bạn
        </p>
        <p className="text-center text-gray-500 mb-3">
          Email: {emailqmk ? emailqmk : "Không có email được truyền"}
        </p>

        {/* Hiển thị lỗi từ BE */}
        {error && <div className="text-red-500 text-center mb-3">{error}</div>}

        {/* Hiển thị thông báo thành công */}
        {success && (
          <div className="text-green-500 text-center mb-3">{success}</div>
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

export default OtpFormqmk;
