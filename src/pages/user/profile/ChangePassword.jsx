import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { changePassword } from "../../../services/AuthService"; // Import hàm changePassword

const ChangePassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem("email") || "user@example.com"
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Lưu lỗi từ BE
  const [successMessage, setSuccessMessage] = useState(""); // Lưu thông báo thành công từ BE
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset lỗi
    setSuccessMessage(""); // Reset thông báo thành công

    // ✅ Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      setErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    // ✅ Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu mới và nhập lại không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const message = await changePassword(email, oldPassword, newPassword);
      setSuccessMessage(message); // Hiển thị thông báo thành công
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      if (error.email) {
        setErrorMessage(error.email); // Hiển thị lỗi email từ backend
      } else if (error.oldPassword) {
        setErrorMessage(error.oldPassword); // Hiển thị lỗi mật khẩu cũ từ backend
      } else if (error.newPassword) {
        setErrorMessage(error.newPassword); // Hiển thị lỗi mật khẩu mới từ backend
      } else if (error.server) {
        setErrorMessage(error.server); // Hiển thị lỗi server từ backend
      } else {
        setErrorMessage("Lỗi kết nối, vui lòng thử lại."); // Hiển thị lỗi mặc định
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đổi mật khẩu</h2>

      {/* Form fields */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1 font-bold">Email:</label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-bold">
            Mật khẩu cũ:
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-bold">
            Mật khẩu mới:
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-bold">
            Nhập lại mật khẩu mới:
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-3 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>

      {successMessage && (
        <p className="text-green-500 text-center mt-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default ChangePassword;
