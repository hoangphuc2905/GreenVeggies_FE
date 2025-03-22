import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // Import the left arrow icon

const RegisterForm = ({ goBack, closeRegisterForm, openOtpFormdk }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // To track general error
  const [emailError, setEmailError] = useState(""); // To track email error

  const handleChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Real-time email validation
    if (!e.target.value) {
      setEmailError("Vui lòng nhập Email.");
    } else if (!emailRegex.test(e.target.value)) {
      setEmailError("Vui lòng nhập địa chỉ Email hợp lệ.");
    } else {
      setEmailError(""); // Clear error if valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset general error message

    // Ensure no validation errors before submitting
    if (!email) {
      setEmailError("Vui lòng nhập Email.");
      setLoading(false);
      return;
    } else if (emailError) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8001/api/auth/send-otp?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Open OTP form and pass the email
        closeRegisterForm(); // Close the register form
        openOtpFormdk(email); // Open the OTP form
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
      {/* Back button */}
      <button
        onClick={goBack} // Call goBack to return to the login page
        className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Close button */}
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
        <h2 className="text-xl font-bold text-green-700 text-center">GREENVEGGIES</h2>
        <h3 className="text-xl font-bold mb-4 text-black text-center">Đăng ký tài khoản</h3>
        <p className="text-center text-gray-500 mb-3">Vui lòng nhập địa chỉ email để nhận mã xác thực</p>

        {/* Display error if any */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            {/* Show email error */}
            {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
          </div>

          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? "Đang gửi mã..." : "Tiếp tục"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-2">
          <button
            onClick={goBack} // Call goBack to return to the login page
            className="text-green-500 hover:underline"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
