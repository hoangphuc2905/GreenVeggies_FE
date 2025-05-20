import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { changePassword } from "../../../services/AuthService";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Regex pattern for strong password validation
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Check if old password is provided
    if (!oldPassword.trim()) {
      setErrorMessage("Vui lòng nhập mật khẩu cũ.");
      setIsLoading(false);
      return;
    }

    // Check if new password meets requirements
    if (!strongPasswordRegex.test(newPassword)) {
      setErrorMessage(
        "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      setIsLoading(false);
      return;
    }

    // Check if new password is different from old password
    if (newPassword === oldPassword) {
      setErrorMessage("Mật khẩu mới không được trùng với mật khẩu cũ.");
      setIsLoading(false);
      return;
    }

    // Check password confirmation
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu mới và nhập lại không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending password change request:", {
        email,
        oldPassword,
        newPassword,
      });
      const message = await changePassword(email, oldPassword, newPassword);
      console.log("Password change response:", message);

      setSuccessMessage(message || "Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Password change error:", error);

      // Improved error handling
      if (typeof error === "object") {
        if (error.email) {
          setErrorMessage(error.email);
        } else if (error.oldPassword) {
          setErrorMessage(error.oldPassword);
        } else if (error.newPassword) {
          setErrorMessage(error.newPassword);
        } else if (error.server) {
          setErrorMessage(error.server);
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Lỗi không xác định, vui lòng thử lại sau.");
        }
      } else {
        setErrorMessage("Lỗi kết nối, vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đổi mật khẩu</h2>

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
            required
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
            required
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
            required
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
