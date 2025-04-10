import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ResetPasswordForm = ({ goBack, closeResetPasswordForm, emailqmk }) => {
    const [newPassword, setNewPassword] = useState(""); // Mật khẩu mới
    const [confirmPassword, setConfirmPassword] = useState(""); // Xác nhận mật khẩu
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const [error, setError] = useState(""); // Thông báo lỗi từ BE
    const [success, setSuccess] = useState(""); // Thông báo thành công từ BE
    const [formErrors, setFormErrors] = useState({}); // Lưu lỗi từ FE

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setFormErrors({}); // Reset lỗi form

        // Kiểm tra các trường nhập
        const errors = {};
        if (!newPassword) {
            errors.newPassword = "Vui lòng nhập mật khẩu mới.";
        } else if (newPassword.length < 6) {
            errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8001/api/auth/update-password?email=${encodeURIComponent(emailqmk)}&newPassword=${encodeURIComponent(newPassword)}`,
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
                // Hiển thị lỗi từ BE
                if (data.errors?.email) {
                    setError(data.errors.email);
                } else if (data.errors?.newPassword) {
                    setError(data.errors.newPassword);
                } else if (data.errors?.server) {
                    setError(data.errors.server);
                } else {
                    setError("Có lỗi xảy ra. Vui lòng thử lại.");
                }
            }
        } catch (err) {
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

                {/* Hiển thị lỗi từ BE */}
                {error && <div className="text-red-500 text-center mb-3">{error}</div>}

                {/* Hiển thị thông báo thành công */}
                {success && <div className="text-green-500 text-center mb-3">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            className={`w-full p-2 border ${
                                formErrors.newPassword ? "border-red-500" : "border-gray-300"
                            } rounded-lg bg-gray-100`}
                            
                        />
                        {formErrors.newPassword && (
                            <div className="text-red-500 text-sm">{formErrors.newPassword}</div>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Xác nhận mật khẩu mới"
                            className={`w-full p-2 border ${
                                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                            } rounded-lg bg-gray-100`}
                    
                        />
                        {formErrors.confirmPassword && (
                            <div className="text-red-500 text-sm">{formErrors.confirmPassword}</div>
                        )}
                    </div>

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