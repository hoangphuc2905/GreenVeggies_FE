import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { register } from "../../services/AuthService"; // Import hàm register

const SignupForm = ({ switchToLogin, email }) => {
  const [formData, setFormData] = useState({
    email: email || "",
    username: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    image: null,
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({}); // Lưu lỗi từ BE

  useEffect(() => {
    if (email) {
      setFormData((prevFormData) => ({ ...prevFormData, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Xóa lỗi khi người dùng sửa
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateForm = () => {
    const errors = {};

    // Kiểm tra số điện thoại
    const phoneRegex = /^0\d{9}$/; // Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 số.";
    }

    // Kiểm tra tuổi (ngày sinh)
    const currentDate = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (!formData.dateOfBirth || age < 12) {
      errors.dateOfBirth = "Tuổi phải từ 12 trở lên.";
    }

    // Kiểm tra mật khẩu
    if (!formData.password || formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Kiểm tra lỗi form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Xử lý avatar (nếu có)
      const avatar = formData.image
        ? formData.image.name
        : "https://res.cloudinary.com/dze57n4oa/image/upload/v1741758315/e693481de2901eaee3e8746472c2a552_nle9hj.jpg";

      // Chuẩn bị dữ liệu gửi lên API
      const userData = {
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        avatar: avatar,
        role: formData.role || "user",
      };

      console.log("Dữ liệu gửi lên API:", userData); // Debug log

      // Gọi API đăng ký
      const responseMessage = await register(userData);

      if (responseMessage) {
        setSuccess(responseMessage);
        setTimeout(() => {
          switchToLogin(); // Chuyển về trang đăng nhập
        }, 2000);
      }
    } catch (err) {
      // Xử lý lỗi từ backend
      if (err.email || err.phone || err.username || err.password) {
        setFormErrors(err); // Hiển thị lỗi cụ thể từ backend
      } else {
        setError(err.server || "Lỗi kết nối, vui lòng thử lại."); // Lỗi chung
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
      <button
        onClick={switchToLogin}
        className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900 transition"
      >
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

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              className={`w-full p-2 border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
              readOnly
            />
            {formErrors.email && (
              <div className="text-red-500 text-sm">{formErrors.email}</div>
            )}
          </div>

          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tên người dùng"
              className={`w-full p-2 border ${
                formErrors.username ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {formErrors.username && (
              <div className="text-red-500 text-sm">{formErrors.username}</div>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className={`w-full p-2 border ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {formErrors.phone && (
              <div className="text-red-500 text-sm">{formErrors.phone}</div>
            )}
          </div>

          <div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full p-2 border ${
                formErrors.dateOfBirth ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {formErrors.dateOfBirth && (
              <div className="text-red-500 text-sm">
                {formErrors.dateOfBirth}
              </div>
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
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-gray-100`}
            />
            {formErrors.password && (
              <div className="text-red-500 text-sm">{formErrors.password}</div>
            )}
          </div>

          <div>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
