import { notification } from "antd"; // Import notification từ Ant Design
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";

const LoginForm = ({
  closeLoginForm,
  openForgotPasswordForm,
  switchToRegister,
  onLoginSuccess,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // Lưu lỗi từ BE
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" })); // Xóa lỗi khi người dùng sửa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset lỗi trước khi gửi

    try {
      // Gọi hàm login từ AuthService
      const data = await login({
        email: formData.username,
        password: formData.password,
      });

      const role = data.user.role;
      setUserRole(role);
      onLoginSuccess(data);
      console.log("Đăng nhập thành công:", data);

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userID", data.user.userID);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", role);

      // Hiển thị thông báo đăng nhập thành công
      notification.success({
        message: "Đăng nhập thành công",
        description: "Chào mừng bạn đã quay lại!",
        placement: "topRight",
        duration: 3,
      });

      closeLoginForm();

      // Tải lại trang sau khi đăng nhập thành công
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Đợi 1 giây để hiển thị thông báo trước khi tải lại
    } catch (err) {
      setErrors(err || { server: "Lỗi kết nối. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
      <button
        onClick={closeLoginForm}
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
        <h2 className="text-xl font-bold text-green-700 text-center">
          GREENVEGGIES
        </h2>
        <h3 className="text-xl font-bold mb-4 text-black text-center">
          Chào mừng trở lại
        </h3>

        {/* Hiển thị lỗi từ BE */}
        {errors.server && (
          <div className="text-red-500 text-center mb-4">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>

          <div className="text-right text-sm text-gray-500">
            <button
              type="button"
              onClick={openForgotPasswordForm}
              className="hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-center text-sm text-gray-500 mt-2">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-green-500 hover:underline"
            >
              Đăng ký
            </button>
          </div>
        </form>

        {userRole && (
          <div className="text-center mt-4">
            <p className="font-semibold">
              {userRole === "admin" ? "Quản trị viên" : "Người dùng"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
