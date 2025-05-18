import { Modal, notification } from 'antd'; // Import Modal và notification từ Ant Design
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';


const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đăng xuất?',
      onOk() {
        // Xóa thông tin người dùng và token khỏi localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        setUser(null);

        // Hiển thị thông báo đăng xuất thành công
        notification.success({
          message: 'Đăng xuất thành công',
          description: 'Bạn đã đăng xuất khỏi hệ thống.',
          placement: 'topRight',
          duration: 3,
        });

        // Chuyển hướng về trang Home và làm mới trang
        navigate('/');
        window.location.reload();
      },
      onCancel() {
        console.log('Đăng xuất đã bị hủy');
      },
    });
  };

  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto relative">
        <div className="flex justify-center items-start py-8 bg-grey-50 min-h-screen mt-32">
          {/* Sidebar */}
          <div className="w-1/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                <li
                  className={`p-2 cursor-pointer ${
                    location.pathname === '/user/profile'
                      ? 'text-green-500 font-bold' // Màu xanh khi đang ở trang đó
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                >
                  <Link to="/user/profile">Thông tin cá nhân</Link>
                </li>
                <li
                  className={`p-2 cursor-pointer ${
                    location.pathname === '/user/change-password'
                      ? 'text-green-500 font-bold'
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                >
                  <Link to="/user/change-password">Đặt lại mật khẩu</Link>
                </li>
                <li
                  className={`p-2 cursor-pointer ${
                    location.pathname === '/user/address'
                      ? 'text-green-500 font-bold'
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                >
                  <Link to="/user/address">Địa chỉ của bạn</Link>
                </li>
                <li
                  className={`p-2 cursor-pointer ${
                    location.pathname === '/user/orders'
                      ? 'text-green-500 font-bold'
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                > 
                  <Link to="/user/orders">Đơn hàng của bạn</Link>
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

          {/* Nội dung thay đổi theo route */}
          <div className="w-2/4 p-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
              <Outlet />{' '}
              {/* Hiển thị nội dung của Profile hoặc ChangePassword */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;