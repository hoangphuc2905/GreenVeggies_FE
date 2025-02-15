import { useState } from "react";

const LoginForm = ({
  closeLoginForm,
  openForgotPasswordForm,
  switchToRegister,
  onLoginSuccess, // Thêm hàm onLoginSuccess vào props
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(""); // Store the user's role (admin or user)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8009/api/auth/login?email=${encodeURIComponent(
          formData.username
        )}&password=${encodeURIComponent(formData.password)}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
        }
      );

      const data = await response.json();

      console.log("user data", data);

      if (response.ok) {
        // Set user role based on API response
        const role = data.user.role; // 'admin' or 'guest' (user)
        setUserRole(role);

        // Gọi hàm onLoginSuccess với dữ liệu người dùng
        onLoginSuccess(data);

        // Display login success message
        alert("Đăng nhập thành công!");
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
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
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
          Welcome Back
        </h3>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />

          <div className="text-right text-sm text-gray-500">
            <button
              type="button"
              onClick={openForgotPasswordForm}
              className="hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
            disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>

          <div className="text-center text-sm text-gray-500 mt-2">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-green-500 hover:underline">
              Sign up
            </button>
          </div>
        </form>

        {/* Conditionally render user role */}
        {userRole && (
          <div className="text-center mt-4">
            <p className="font-semibold">
              {userRole === "admin" ? "Admin" : "User"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
