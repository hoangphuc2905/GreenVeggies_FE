import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";

const OtpFormqmk = ({ goBack, closeOtpForm, openResetPasswordForm, emailqmk }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // To store error message
    const [success, setSuccess] = useState(""); // To store success message

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Allow only numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to next input when a value is entered
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move focus to previous input when Backspace is pressed
        if (e.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error
        setSuccess(""); // Reset success

        // Combine OTP digits into a single string
        const otpValue = otp.join("");

        // Check if OTP is complete
        if (otpValue.length !== 6) {
            setError("Vui lòng nhập đầy đủ mã OTP.");
            setLoading(false);
            return;
        }

        // Send OTP verification request to the API
        try {
            const response = await fetch(
                `http://localhost:8001/api/auth/verify-otp-reset?email=${encodeURIComponent(emailqmk)}&otp=${otpValue}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess("OTP đã được xác nhận!");
                localStorage.setItem("verifiedOtp", otpValue); // Store OTP in localStorage
                localStorage.setItem("verifiedEmail", emailqmk); // Store email in localStorage
                closeOtpForm(); // Close OTP form
                openResetPasswordForm(emailqmk, otpValue); // Open reset password form and pass email and OTP
            } else {
                setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            setError("Lỗi kết nối, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
            {/* Back button */}
            <button
                onClick={goBack}
                className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Close button */}
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
                <h2 className="text-xl font-bold text-green-700 text-center">GREENVEGGIES</h2>
                <h3 className="text-xl font-bold mb-4 text-black text-center">Nhập mã OTP QMK</h3>
                <p className="text-center text-gray-500 mb-3">Nhập mã OTP đã gửi đến email của bạn</p>
                <p className="text-center text-gray-500 mb-3">
                    Email: {emailqmk ? emailqmk : "Không có email được truyền"}
                </p>

                {/* Error message */}
                {error && <div className="text-red-500 text-center mb-3">{error}</div>}

                {/* Success message */}
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
                        {loading ? "Đang xác thực..." : "Tiếp tục"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpFormqmk;
