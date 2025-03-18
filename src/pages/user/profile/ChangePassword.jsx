import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ChangePassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "user@example.com");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới không giống mật khẩu cũ
    if (newPassword === oldPassword) {
      setErrorMessage("Mật khẩu mới không được giống mật khẩu cũ.");
      setSuccessMessage("");
      return;
    }

    // Kiểm tra mật khẩu mới có ít nhất 6 ký tự
    if (newPassword.length < 6) {
      setErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự.");
      setSuccessMessage("");
      return;
    }

    // Kiểm tra mật khẩu mới và nhập lại mật khẩu mới có khớp không
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu mới và nhập lại không khớp.");
      setSuccessMessage("");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(""); // Xóa lỗi cũ
      setSuccessMessage(""); // Xóa thành công cũ

      // Tạo URL đầy đủ với query parameters
      const apiUrl = `http://localhost:8001/api/auth/change-password?email=${encodeURIComponent(email)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`;

      // Gửi request đổi mật khẩu
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Accept": "*/*", // Đảm bảo API nhận đúng kiểu dữ liệu
          "Authorization": `Bearer ${token}`, // Nếu API cần xác thực
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        if (data.message.includes("Mật khẩu cũ không đúng")) {
          setErrorMessage("Mật khẩu cũ không đúng.");
        } else {
          setErrorMessage(data.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>

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
          <label className="block text-gray-700 mb-1 font-bold">Mật khẩu cũ:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-bold">Mật khẩu mới:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-bold">Nhập lại mật khẩu mới:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-3 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>

      {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ChangePassword;
