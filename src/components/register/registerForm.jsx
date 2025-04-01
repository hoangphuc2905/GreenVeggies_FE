import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

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
  const [formErrors, setFormErrors] = useState({
    email: "",
    username: "",
    phone: "",
    dateOfBirth: "",
    password: "",
  });

  useEffect(() => {
    if (email) {
      setFormData((prevFormData) => ({ ...prevFormData, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear error when input changes
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateForm = () => {
    const errors = {};
  
    // Kiểm tra email
    if (!formData.email) errors.email = "Email không được để trống";
  
    // Kiểm tra tên người dùng (không được chứa số)
    if (!formData.username) {
      errors.username = "Tên người dùng không được để trống";
    } else if (/\d/.test(formData.username)) {
      errors.username = "Tên người dùng không được chứa số";
    }
  
    // Kiểm tra số điện thoại
    if (!formData.phone) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại phải gồm 10 chữ số";
    }
  
    // Kiểm tra ngày sinh (phải trên 12 tuổi)
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const month = new Date().getMonth() - birthDate.getMonth();
      if (age < 12 || (age === 12 && month < 0)) {
        errors.dateOfBirth = "Bạn phải trên 12 tuổi";
      }
    }
  
    // Kiểm tra mật khẩu
    if (!formData.password) errors.password = "Mật khẩu không được để trống";
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const avatar = formData.image ? formData.image.name : "https://res.cloudinary.com/dze57n4oa/image/upload/v1741758315/e693481de2901eaee3e8746472c2a552_nle9hj.jpg";

    const requestBody = {
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      password: formData.password,
      avatar: avatar,
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

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            readOnly
          />
          {formErrors.email && <div className="text-red-500">{formErrors.email}</div>}

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tên người dùng"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
          {formErrors.username && <div className="text-red-500">{formErrors.username}</div>}

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
          {formErrors.phone && <div className="text-red-500">{formErrors.phone}</div>}

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
          {formErrors.dateOfBirth && <div className="text-red-500">{formErrors.dateOfBirth}</div>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
          {formErrors.password && <div className="text-red-500">{formErrors.password}</div>}

          <input
            type="file"
            name="image"
            onChange={handleFileChange}
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
