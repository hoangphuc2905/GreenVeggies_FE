import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { changePassword } from "../../../api/api";

const ChangePassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "user@example.com"); // Get email from state or use a default value

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

  const token = localStorage.getItem("token"); // Assuming token is needed for auth

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu mới và nhập lại mật khẩu mới không khớp.");
      setSuccessMessage("");
      return;
    }

    // Call the API to change password
    const response = await changePassword(email, oldPassword, newPassword, token);
    if (response) { // If the API call is successful
      setSuccessMessage("Đổi mật khẩu thành công!");
      setErrorMessage(""); // Clear error message
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      setErrorMessage("Đổi mật khẩu thất bại. Vui lòng thử lại sau.");
      setSuccessMessage(""); // Clear success message
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-4">Đặt lại mật khẩu</h2>
      <p className="text-center text-gray-500 mb-4">{email}</p> {/* Display email */}

      {/* Change Password Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 mb-1">Mật khẩu cũ:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Mật khẩu mới:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Nhập lại mật khẩu mới:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
        >
          Đặt lại mật khẩu
        </button>
      </form>

      {/* Display success or error message */}
      {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
    </>
  );
};

export default ChangePassword;
