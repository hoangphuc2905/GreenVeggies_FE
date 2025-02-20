import { useState } from "react";
import Header from "../layouts/header";
import Footer from "../layouts/footer";

const Page = () => {
  const [activeMenu, setActiveMenu] = useState("profile"); // Xác định tab đang chọn
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [userInfo, setUserInfo] = useState({
    username: "Nguyễn Minh Thuận",
    phone: "0977041860",
    email: "nguyenminhthuan250718@gmail.com",
    dateOfBirth: "2003-09-09", // Định dạng YYYY-MM-DD để hỗ trợ input date
    address: "Long An",
  });

  const [selectedFile, setSelectedFile] = useState("https://i.imgur.com/TdZ9vVu.png");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      alert("Bạn đã đăng xuất!");
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
                <li
                  className={`p-2 cursor-pointer ${
                    activeMenu === "profile"
                      ? "text-green-600 font-semibold border-l-4 border-green-500"
                      : "text-gray-600 hover:text-green-500"
                  }`}
                  onClick={() => setActiveMenu("profile")}
                >
                  Thông tin cá nhân
                </li>
                <li
                  className={`p-2 cursor-pointer ${
                    activeMenu === "change-password"
                      ? "text-green-600 font-semibold border-l-4 border-green-500"
                      : "text-gray-600 hover:text-green-500"
                  }`}
                  onClick={() => setActiveMenu("change-password")}
                >
                  Đặt lại mật khẩu
                </li>
                <li
                  className="p-2 cursor-pointer text-gray-600 hover:text-red-500"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </li>
              </ul>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-2/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
              {activeMenu === "profile" ? (
                <>
                  <h2 className="text-xl font-bold text-center mb-4">Thông tin cá nhân</h2>

                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={selectedFile}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
                    />
                    <label className="mt-3 bg-gray-200 text-gray-700 px-4 py-1 rounded-lg cursor-pointer hover:bg-gray-300 transition">
                      Chọn ảnh
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <p className="text-sm text-gray-500 mt-1">Dung lượng file tối đa 1MB | Định dạng: .JPEG .PNG</p>
                  </div>

                  {/* User Info Table */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {Object.entries(userInfo).map(([key, value], index) => (
                      <div key={index} className="grid grid-cols-2 border-b">
                        <div className="p-3 font-semibold border-r capitalize">
                          {key === "dateOfBirth" ? "Ngày sinh" : key === "phone" ? "Số điện thoại" : key.charAt(0).toUpperCase() + key.slice(1)}:
                        </div>
                        <div className="p-3">
                          {isEditing ? (
                            key === "dateOfBirth" ? (
                              <input
                                type="date"
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                              />
                            ) : (
                              <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                              />
                            )
                          ) : (
                            value
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Update / Save Button */}
                  <button
                    className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
                    onClick={handleEditClick}
                  >
                    {isEditing ? "Lưu" : "Cập nhật thông tin"}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-center mb-4">Đặt lại mật khẩu</h2>

                  {/* Change Password Form */}
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Mật khẩu cũ:</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Mật khẩu mới:</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Nhập lại mật khẩu mới:</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300"
                        required
                      />
                    </div>

                    <button type="submit" className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition">
                      Đặt lại mật khẩu
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Page;
