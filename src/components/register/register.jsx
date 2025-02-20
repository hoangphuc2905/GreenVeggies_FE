import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // Import icon mũi tên quay về

const RegisterForm = ({ goBack, closeRegisterForm, openOtpFormdk }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra định dạng email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    setLoading(true);
    setError("");

    const VITE_API_URL_USER = import.meta.env.VITE_API_URL_USER;
    try {
      const response = await fetch(
        VITE_API_URL_USER`/auth/send-otp?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Mở form OTP
        alert("Mã xác thực đã được gửi đến email của bạn!");
        closeRegisterForm(); // Đóng form đăng ký
        openOtpFormdk(email); // Mở form OTP và truyền email
      } else {
        setError(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
      {/* Nút quay lại */}
      <button
        onClick={goBack} // Gọi goBack để quay về trang đăng nhập
        className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition">
        <ArrowLeft size={24} />
      </button>

      {/* Nút đóng ở góc trên bên phải */}
      <button
        onClick={closeRegisterForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
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
          Register an account
        </h3>
        <p className="text-center text-gray-500 mb-3">
          Please enter your email address to receive the verification code
        </p>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
            disabled={loading}>
            {loading ? "Đang gửi mã..." : "Continue"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-2">
          <button
            onClick={goBack} // Gọi goBack để quay lại trang đăng nhập
            className="text-green-500 hover:underline">
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
