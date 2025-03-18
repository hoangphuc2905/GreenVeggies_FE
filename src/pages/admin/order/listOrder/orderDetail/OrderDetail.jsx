import { Modal, Descriptions, Button, Table, ConfigProvider } from "antd";
import PropTypes from "prop-types";
import logo from "../../../../../assets/Green.png";

const OrderDetail = ({ visible, onClose, order }) => {
  if (!order) return null;

  const columns = [
    { title: "Sản phẩm", dataIndex: "item", key: "item" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Giá", dataIndex: "price", key: "price" },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: "#9ed455", // Light blue for primary buttons
          colorPrimaryActive: "#1e40af", // Darker blue for active state
          colorPrimaryTextHover: "#ffffff", // White text color on hover
        },
      }}
    >
      <Modal
        title={
          <div className="flex items-center justify-center gap-4">
            <img src={logo} className="w-14 h-14" alt="Logo" />
            <div className="py-3 font-bold text-xl text-primary">
              CHI TIẾT ĐƠN HÀNG
            </div>
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={"90%"}
        footer={[
          order.status === "Đang chờ duyệt" && (
            <Button
              className="bg-primary text-white"
              key="approve"
              type="primary"
            >
              Duyệt đơn
            </Button>
          ),
          order.status === "Đã duyệt" && (
            <Button className="bg-primary text-white" key="ship" type="default">
              Xác nhận giao hàng
            </Button>
          ),
          order.status === "Đã hủy" && (
            <Button
              className="bg-primary text-white"
              key="reorder"
              type="default"
            >
              Đặt lại đơn
            </Button>
          ),
          order.status === "Đã giao" && (
            <>
              <Button
                className="bg-primary text-white"
                key="complete"
                type="default"
                onClick={onClose}
              >
                Xác nhận
              </Button>
              <Button
                className="bg-primary text-white"
                key="complete"
                type="default"
              >
                In hóa đơn
              </Button>
            </>
          ),
          <ConfigProvider
            key="close-config"
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "#ff4d4f", // Red for close button hover
                  defaultHoverColor: "#ffffff", // White text color on hover
                  defaultActiveBg: "#d4380d", // Darker red for active state
                  defaultActiveColor: "#ffffff",
                  defaultActiveBorderColor: "none",
                },
              },
            }}
          >
            <Button
              className="bg-deleteColor text-white"
              key="close"
              onClick={onClose}
              type="default"
            >
              Đóng
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã đơn hàng">
            {order.orderId}
          </Descriptions.Item>
          <Descriptions.Item label="Mã khách hàng">
            {order.customerId}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {order.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{order.address}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {order.status}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">{order.time}</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {order.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Chi tiết">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "#82AE46",
                  },
                },
              }}
            >
              <Table
                columns={columns}
                dataSource={order.orderDetails}
                pagination={false}
                rowKey="item"
                size="small"
              />
            </ConfigProvider>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <span className="font-bold">{order.price}</span>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </ConfigProvider>
  );
};

OrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        item: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
};

export default OrderDetail;
