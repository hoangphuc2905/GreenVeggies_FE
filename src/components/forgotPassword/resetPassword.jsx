import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ResetPasswordForm = ({ goBack, closeResetPasswordForm, emailqmk }) => {
    const [newPassword, setNewPassword] = useState(""); // Mật khẩu mới
    const [confirmPassword, setConfirmPassword] = useState(""); // Xác nhận mật khẩu
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const [error, setError] = useState(""); // Thông báo lỗi
    const [success, setSuccess] = useState(""); // Thông báo thành công

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp!");
            setLoading(false);
            return;
        }

        const otpStored = localStorage.getItem("verifiedOtp");
        const emailStored = localStorage.getItem("verifiedEmail");

        // Kiểm tra lại OTP và email
        if (!otpStored || !emailStored) {
            setError("Thông tin OTP hoặc email không hợp lệ.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8009/api/auth/update-password?email=${encodeURIComponent(emailqmk)}&newPassword=${encodeURIComponent(newPassword)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess("Mật khẩu đã được thay đổi thành công!");
                setTimeout(() => {
                    closeResetPasswordForm();
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
            <button
                onClick={goBack}
                className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition"
            >
                <ArrowLeft size={24} />
            </button>

            <button
                onClick={closeResetPasswordForm}
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
                <h3 className="text-xl font-bold mb-4 text-black text-center">Đặt lại mật khẩu</h3>
                <p className="text-center text-gray-500 mb-3">Nhập mật khẩu mới cho tài khoản</p>
                <p className="text-center text-gray-500 mb-3">Email: {emailqmk || "Không có email được truyền"}</p>

                {error && <div className="text-red-500 text-center mb-3">{error}</div>}
                {success && <div className="text-green-500 text-center mb-3">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Đang thay đổi..." : "Tiếp tục"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
