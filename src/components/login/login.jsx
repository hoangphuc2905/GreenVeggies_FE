import { notification } from "antd"; // Import notification từ Ant Design
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../redux/userSlice";
import { getUserInfo } from "../../api/api";

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

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");  // Track email error
  const [passwordError, setPasswordError] = useState("");  // Track password error
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Real-time email validation
    if (e.target.name === "username") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!e.target.value) {
        setEmailError("Vui lòng nhập Email.");
      } else if (!emailRegex.test(e.target.value)) {
        setEmailError("Vui lòng nhập địa chỉ Gmail hợp lệ.");
      } else {
        setEmailError(""); // Clear error if valid
      }
    }

    // Real-time password validation
    if (e.target.name === "password") {
      if (!e.target.value) {
        setPasswordError("Vui lòng nhập mật khẩu.");
      } else if (e.target.value.length < 6) {
        setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      } else {
        setPasswordError(""); // Clear error if valid
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    if (token && userID) {
      dispatch(fetchUser({ userID, token }));
      getUserInfo(userID, token).then((userInfo) => {
        setUserInfo(userInfo);
        if (userInfo.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset general error message

    // Ensure no validation errors before submitting
    if (!formData.username) {
      setEmailError("Vui lòng nhập Email.");
    }

    if (!formData.password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
    }

    // If there are validation errors, stop form submission
    if (emailError || passwordError || !formData.username || !formData.password) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8001/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("user data", data.user);

      if (response.ok && data.user) {
        const role = data.user.role;
        setUserRole(role);
        onLoginSuccess(data);

        // Store user information in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data.user.id);
        localStorage.setItem("role", role);

        // Hiển thị thông báo đăng nhập thành công
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn đã quay lại!",
          placement: "topRight", // Vị trí thông báo
          duration: 3, // Thời gian hiển thị thông báo
        });

        closeLoginForm();
      } else {
        setError(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
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

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
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
