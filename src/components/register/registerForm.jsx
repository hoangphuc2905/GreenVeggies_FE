import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const SignupForm = ({ switchToLogin, email }) => {
  const [formData, setFormData] = useState({
    email: email || "", // Gán giá trị email từ props
    username: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    image: null,
    address: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cập nhật email khi nhận được từ props
  useEffect(() => {
    if (email) {
      setFormData((prevFormData) => ({ ...prevFormData, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Kiểm tra nếu các trường bắt buộc không có giá trị
    if (
      !formData.email ||
      !formData.phone ||
      !formData.username ||
      !formData.password ||
      !formData.dateOfBirth
    ) {
      setError(
        "Vui lòng nhập đầy đủ các trường: email, phone, username, password, dateOfBirth."
      );
      setLoading(false);
      return;
    }

    const requestBody = {
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      password: formData.password,
      address: formData.address,
      avatar: formData.image ? formData.image.name : null,
    };

    try {
      const response = await fetch("http://localhost:8001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setSuccess("Đăng ký thành công!");
        setTimeout(() => {
          switchToLogin();
        }, 2000);
      } else {
        setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
      <button
        onClick={switchToLogin}
        className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900 transition">
        <ArrowLeft size={24} className="mr-2" />
        Quay lại
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
          Tạo tài khoản
        </h3>

        {error && <div className="text-red-500 text-center mb-3">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-3">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
            readOnly // Không cho chỉnh sửa email
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tên người dùng"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            required
          />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
            disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
