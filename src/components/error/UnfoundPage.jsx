import { Button, ConfigProvider, Result } from "antd";
import { useNavigate } from "react-router-dom";

const UnfoundPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin/dashboard/revenue"); // Trang chủ cho admin
    } else {
      navigate("/"); // Trang chủ cho user hoặc guest
    }
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Không tìm thấy trang bạn yêu cầu."
      extra={
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBg: "#9ed455",
                defaultHoverColor: "#ffffff",
                defaultActiveBg: "#486127",
                defaultActiveColor: "#ffffff",
                defaultActiveBorderColor: "none",
                defaultHoverBorderColor: "none",
              },
            },
          }}
        >
          <Button
            type="default"
            className="bg-primary text-white"
            onClick={handleBackToHome} // Gọi hàm điều hướng
          >
            Quay lại trang chủ
          </Button>
        </ConfigProvider>
      }
    />
  );
};

export default UnfoundPage;
