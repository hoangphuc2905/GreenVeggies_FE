import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react"; // Import icon mũi tên quay về

const OtpFormdk = ({ goBack, closeOtpFormdk, openSignupForm, email }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // Để lưu thông báo lỗi từ API
    const [success, setSuccess] = useState(""); // Để lưu thông báo thành công
    const inputRefs = useRef([]);

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Chỉ cho phép nhập số
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự động chuyển focus sang ô tiếp theo khi có giá trị
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Khi nhấn phím Backspace, chuyển focus sang ô trước
        if (e.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Kết hợp các ký tự OTP thành một chuỗi
        const otpValue = otp.join("");

        // Kiểm tra OTP đầy đủ chưa
        if (otpValue.length !== 6) {
            setError("Vui lòng nhập đầy đủ mã OTP.");
            setLoading(false);
            return;
        }

        // Gửi yêu cầu xác thực OTP đến API
        try {
            const response = await fetch(
                `http://localhost:8001/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otpValue}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            console.log('Email:', email);
            console.log('OTP:', otpValue);

            if (response.ok) {
                setSuccess("OTP đã được xác nhận thành công!");
                setTimeout(() => {
                    closeOtpFormdk();
                    openSignupForm(email); // Truyền email sang SignupForm
                }, 2000);
            } else {
                setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            setError("Lỗi kết nối, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
            {/* Nút quay lại ở góc trên bên trái */}
            <button
                onClick={goBack}
                className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Nút đóng ở góc trên bên phải */}
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
                <h2 className="text-xl font-bold text-green-700 text-center">GREENVEGGIES</h2>
                <h3 className="text-xl font-bold mb-4 text-black text-center">Nhập mã OTP</h3>
                <p className="text-center text-gray-500 mb-3">Nhập mã OTP đã gửi đến email của bạn</p>
                <p className="text-center text-gray-500 mb-3">Email: {email}</p>

                {error && <div className="text-red-500 text-center mb-3">{error}</div>}
                {success && <div className="text-green-500 text-center mb-3">{success}</div>}

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
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "Đang xác nhận..." : "Tiếp tục"}
                    </button>
                </form>

                {/* Hiển thị thông báo nếu OTP nhập đúng */}
                {otp.join('').length === 6 && !loading && !success && (
                    <p className="text-center text-gray-500 mt-2">Mã OTP đã đầy đủ, vui lòng kiểm tra và xác nhận.</p>
                )}
            </div>
        </div>
    );
};

export default OtpFormdk;
