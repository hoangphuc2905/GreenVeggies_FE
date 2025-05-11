import { Modal, notification } from "antd";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      onOk() {
        // Xóa thông tin người dùng và token khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        // Hiển thị thông báo đăng xuất thành công
        notification.success({
          message: "Đăng xuất thành công",
          description: "Bạn đã đăng xuất khỏi hệ thống.",
          placement: "topRight",
          duration: 3,
        });

        // Chuyển hướng về trang Home và làm mới trang
        navigate("/");
        window.location.reload();
      },
      onCancel() {
        console.log("Đăng xuất đã bị hủy");
      },
    });
  };

  return handleLogout;
};

export default useLogout;
