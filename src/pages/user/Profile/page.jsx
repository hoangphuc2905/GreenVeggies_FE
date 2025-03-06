import { Outlet, Link, useNavigate } from "react-router-dom";
import Header from "../../user/layouts/header";
import Footer from "../layouts/UserFooter";
import { useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Thêm trạng thái để lưu thông tin người dùng

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Xóa thông tin người dùng và token khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      setUser(null); // Cập nhật trạng thái user về null
      alert("Bạn đã đăng xuất!");
      navigate("/"); // Chuyển hướng về trang Home
    }
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto relative">
        <div className="flex justify-center items-start py-8 bg-gray-100 min-h-screen mt-32">
          {/* Sidebar */}
          <div className="w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                <li className="p-2 cursor-pointer text-gray-600 hover:text-green-500">
                  <Link to="/user/profile">Thông tin cá nhân</Link>
                </li>
                <li className="p-2 cursor-pointer text-gray-600 hover:text-green-500">
                  <Link to="/user/change-password">Đặt lại mật khẩu</Link>
                </li>
                <li className="p-2 cursor-pointer text-gray-600 hover:text-green-500">
                  <Link to="/user/address">Địa chỉ của bạn</Link>
                </li>
                <li
                  className="p-2 cursor-pointer text-gray-600 hover:text-red-500"
                  onClick={handleLogout}>
                  Đăng xuất
                </li>
              </ul>
            </div>
          </div>

          {/* Nội dung thay đổi theo route */}
          <div className="w-2/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
              <Outlet />{" "}
              {/* Hiển thị nội dung của Profile hoặc ChangePassword */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ProfilePage;
