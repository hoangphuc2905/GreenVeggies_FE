import { Modal, Descriptions, Button, Table, ConfigProvider } from "antd";
import PropTypes from "prop-types";
import logo from "../../../../../assets/Green.png";
import { getProductById, updateOrderStatus } from "../../../../../api/api";
import { useEffect, useState } from "react";

const calculateShippingFee = (
  orderTotal,
  isNewCustomer = false,
  isVIP = false
) => {
  if (isVIP) {
    return 0; // Thành viên VIP miễn phí vận chuyển
  }
  if (isNewCustomer) {
    return 50000 * 0.5; // Khách hàng mới giảm 50% phí vận chuyển
  }
  if (orderTotal >= 600000) {
    return 0; // Miễn phí vận chuyển
  }
  if (orderTotal >= 400000) {
    return 15000;
  }
  if (orderTotal >= 200000) {
    return 30000;
  }
  return 50000; // Mặc định phí vận chuyển
};

const formattedDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
const OrderDetail = ({
  visible,
  onClose,
  order,
  userName,
  orderDetails,
  refreshOrders,
}) => {
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!order?.orderDetails?.length) return;

      try {
        const details = await Promise.all(
          order.orderDetails.map(async (item) => {
            const response = await getProductById(item.productID);
            return {
              ...item,
              item: response?.name || "Sản phẩm không tồn tại",
              unit: response?.unit || "N/A",
              //Nhớ sửa
              price: (item.totalAmount * 1.5) / item.quantity,
              totalAmount: item.totalAmount * 1.5,
            };
          })
        );
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchDetails();
  }, [order]);

  //Xử lý duyệt đơn hàng
  const handleApproveOrder = async () => {
    Modal.confirm({
      title: "Có chắc chắn duyệt đơn hàng này không?",
      content: "Đơn hàng sẽ được chuyển sang trạng thái đã duyệt.",
      okText: "Duyệt",
      cancelText: "Hủy",
      onOk() {
        updateOrderStatus(order.orderID, "Shipped")
          .then(() => {
            Modal.success({
              content: "Đơn hàng đã được duyệt thành công.",
            });
            setTimeout(() => {
              refreshOrders();
              onClose();
            }, 1000);
            // Đóng modal sau khi duyệt đơn hàng
          })
          .catch((error) => {
            Modal.error({
              content: "Đã xảy ra lỗi khi duyệt đơn hàng.",
            });
            console.error("Error approving order:", error);
          });
      },
    });
  };
  // Gửi yêu cầu duyệt đơn hàng đến API

  if (!order) return null;

  // Tính tổng giá tiền của các sản phẩm
  const totalProductPrice = productDetails.reduce(
    (sum, product) => sum + product.totalAmount,
    0
  );

  // Tính phí vận chuyển
  const shippingFee = calculateShippingFee(totalProductPrice);

  // Kiểm tra nếu tổng hóa đơn không khớp
  const discrepancy = order.totalAmount - (totalProductPrice + shippingFee);
  const shippingNote =
    discrepancy === 0
      ? `Phí vận chuyển: ${shippingFee.toLocaleString()} VNĐ`
      : `Phí vận chuyển: ${shippingFee.toLocaleString()} VNĐ (Chênh lệch: ${discrepancy.toLocaleString()} VNĐ)`;

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    { title: "Sản phẩm", dataIndex: "productID", key: "productID", width: 80 },
    { title: "Tên sản phẩm", dataIndex: "item", key: "item" },
    { title: "SL", dataIndex: "quantity", key: "quantity", width: 50 },
    { title: "Đơn vị", dataIndex: "unit", key: "unit", width: 80 },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `${text.toLocaleString()} VNĐ`,
    },
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
        width={"70%"}
        centered
        footer={[
          order.status === "Pending" && (
            <>
              <Button
                className="bg-primary text-white"
                key="approve"
                type="primary"
                onClick={handleApproveOrder}
              >
                Duyệt đơn
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
          order.status === "Shipped" && (
            <Button className="bg-primary text-white" key="ship" type="default">
              Xác nhận giao hàng
            </Button>
          ),
          order.status === "Cancelled" && (
            <Button
              className="bg-primary text-white"
              key="reorder"
              type="default"
            >
              Đặt lại đơn
            </Button>
          ),
          order.status === "Delivered" && (
            <>
              <Button
                className="bg-primary text-white"
                key="complete"
                type="default"
                onClick={onClose}
              >
                Xác nhận
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
        <Descriptions
          bordered
          column={1}
          size="small"
          labelStyle={{
            width: "200px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
          contentStyle={{
            fontSize: "12px",
            color: "#333",
            fontWeight: "normal",
          }}
        >
          <Descriptions.Item label="Mã đơn hàng">
            {order.orderID}
          </Descriptions.Item>
          <Descriptions.Item label="Tên khách hàng">
            {userName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {order.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{order.address}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {order.status === "Pending"
              ? "Đang chờ duyệt"
              : order.status === "Shipped"
              ? "Đang giao hàng"
              : order.status === "Delivered"
              ? "Đã giao thành công"
              : "Đã hủy"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            {formattedDate(order.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {order.paymentMethod.toLowerCase() === "cash"
              ? "Thanh toán khi nhận hàng"
              : order.paymentMethod === "MOMO"
              ? "Ví Momo"
              : "Chuyển khoản ngân hàng"}
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
              <ConfigProvider
                theme={{
                  components: {
                    Table: {
                      fontSize: 12, // Chỉnh cỡ chữ nhỏ hơn mặc định
                      headerBg: "#82AE46", // Tùy chỉnh màu nền header
                    },
                  },
                }}
              >
                <Table
                  columns={columns}
                  dataSource={productDetails}
                  rowKey="item"
                  size="small"
                  pagination={false}
                  scroll={{
                    x: "max-content",
                    y: 40 * 5,
                  }}
                  className="bg-white"
                  bordered
                />
              </ConfigProvider>
            </ConfigProvider>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền sản phẩm">
            <span className="font-bold">
              {totalProductPrice.toLocaleString()} đ
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            <span className="font-bold text-deleteColor">{shippingNote}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền hóa đơn">
            <span className="font-bold">
              {order.totalAmount.toLocaleString()} đ
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </ConfigProvider>
  );
};

OrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  order: PropTypes.shape({
    orderID: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    totalAmount: PropTypes.string.isRequired,
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
