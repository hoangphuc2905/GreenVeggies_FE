import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // Import icon mũi tên quay về

const ResetPasswordForm = ({ goBack, closeResetPasswordForm }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra nếu mật khẩu và xác nhận mật khẩu trùng nhau
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        alert("Mật khẩu đã được thay đổi thành công!");
        closeResetPasswordForm(); // Đóng form Reset Password
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
            {/* Nút quay lại ở góc trên bên trái */}
            <button
                onClick={goBack}  // Quay lại form OTP hoặc form trước đó
                className="absolute top-2 left-2 flex items-center text-gray-500 hover:text-gray-700 transition"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Nút đóng ở góc trên bên phải */}
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;