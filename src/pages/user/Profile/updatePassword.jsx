import { useState } from "react";
import Header from "../layouts/header";
import Footer from "../layouts/footer";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    alert("Mật khẩu của bạn đã được đặt lại thành công!");
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mật khẩu cũ */}
            <div>
              <label className="block text-gray-700 mb-1">Mật khẩu cũ:</label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
                required
              />
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-gray-700 mb-1">Mật khẩu mới:</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
                required
              />
            </div>

            {/* Nhập lại mật khẩu mới */}
            <div>
              <label className="block text-gray-700 mb-1">Nhập lại mật khẩu mới:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
                required
              />
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              className="w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ResetPassword;
