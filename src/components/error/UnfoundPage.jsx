import { Button, ConfigProvider, Result } from "antd";

const UnfoundPage = () => {
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
                defaultHoverBg: "#9ed455", // Red for close button hover
                defaultHoverColor: "#ffffff", // White text color on hover
                defaultActiveBg: "#486127", // Darker red for active state
                defaultActiveColor: "#ffffff",
                defaultActiveBorderColor: "none",
                defaultHoverBorderColor: "none",
              },
            },
          }}
        >
          <Button type="default" className="bg-primary text-white">
            Quay về trang chủ
          </Button>
        </ConfigProvider>
      }
    />
  );
};

export default UnfoundPage;
