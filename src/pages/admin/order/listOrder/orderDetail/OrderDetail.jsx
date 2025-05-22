import {
  Modal,
  Descriptions,
  Button,
  Table,
  ConfigProvider,
  Select,
  Input,
} from "antd";
import PropTypes from "prop-types";
import logo from "../../../../../assets/pictures/Green.png";
import { useEffect, useState, useRef } from "react";
import {
  createNotify,
  fetchCancelledOrderNotifications,
} from "../../../../../services/NotifyService";
import {
  checkPaymentStatus,
  getPaymentByOrderId,
} from "../../../../../services/PaymentService";
import { updateStatus } from "../../../../../services/OrderService";
import {
  getProductById,
  updateProductQuantity,
} from "../../../../../services/ProductService";
import { formattedPrice } from "../../../../../components/calcSoldPrice/CalcPrice";
import ExportInvoice from "../ExportInvoice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Hàm tính phí vận chuyển dựa trên tổng tiền và loại khách hàng
// - Nếu là VIP: miễn phí vận chuyển
// - Nếu là khách mới: giảm 50% phí vận chuyển
// - Nếu tổng >= 600.000đ: miễn phí vận chuyển
// - Nếu tổng >= 400.000đ: phí 15.000đ
// - Nếu tổng >= 200.000đ: phí 30.000đ
// - Dưới 200.000đ: phí 50.000đ
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

// Hàm định dạng ngày tháng năm sang dạng DD-MM-YYYY HH:mm:ss
// Trả về chuỗi ngày/tháng/năm giờ:phút:giây
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
  customerName,
  customerPhone,
  customerID,
  orderDetails,
  refreshOrders,
}) => {
  const [productDetails, setProductDetails] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null); // State for payment details
  const [cancelReason, setCancelReason] = useState(""); // State for cancellation reason
  const [customReason, setCustomReason] = useState(""); // State for custom reason input
  const userID = localStorage.getItem("userID");
  const [reason, setReason] = useState(""); // State for cancellation reason
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef();

  const cancellationOptions = [
    "Khách hàng yêu cầu hủy",
    "Hết hàng",
    "Thông tin giao hàng không chính xác",
    "Lý do khác",
  ];

  // Lấy chi tiết sản phẩm, chi tiết thanh toán, lý do hủy đơn (nếu có)
  // - Gọi API lấy thông tin sản phẩm cho từng sản phẩm trong đơn
  // - Gọi API lấy thông tin thanh toán nếu có
  // - Gọi API lấy thông báo hủy đơn nếu trạng thái là Cancelled
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
              status: response?.status || "Không xác định", // Add product status
              unit: response?.unit || "N/A",
              price: item.totalAmount / item.quantity,
              totalAmount: item.totalAmount,
            };
          })
        );
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    const fetchPaymentDetails = async () => {
      try {
        const paymentDetails = await getPaymentByOrderId(order.orderID);
        if (paymentDetails) {
          setPaymentDetails(paymentDetails); // Set payment details state
          console.log("Payment details:", paymentDetails);
        } else {
          console.error(
            "Không tìm thấy thông tin thanh toán cho đơn hàng này."
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thanh toán:", error);
      }
    };
    const fetchCancelledNotifications = async () => {
      if (order.status === "Cancelled") {
        try {
          const notifications = await fetchCancelledOrderNotifications(
            order.orderID
          );
          console.log(
            "Thông báo hủy đơn hàng:",
            notifications || "Không có thông báo nào"
          );
          setReason(notifications || []);
        } catch (error) {
          console.error("Lỗi khi lấy thông báo hủy đơn hàng:", error);
        }
      }
    };
    fetchCancelledNotifications();
    fetchDetails();
    fetchPaymentDetails(); // Fetch payment details when order changes
  }, [order]);

  // Gửi thông báo đã duyệt đơn hàng thành công cho khách hàng
  // - Gửi notify với nội dung đơn hàng đã được duyệt
  const sendNotify = async (orderID) => {
    try {
      const formData = {
        senderType: "admin",
        senderUserID: userID,
        receiverID: customerID,
        title: "Thông báo đơn hàng",
        message: `Đơn hàng ${orderID} của bạn đã được duyệt thành công.`,
        type: "order",
        orderID: orderID,
      };
      const response = await createNotify(formData);
      if (response) {
        console.log("Thông báo đã được gửi thành công:", response);
      }
      // Thực hiện các hành động khác nếu cần
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      // Xử lý lỗi nếu cần
    }
  };

  // Gửi thông báo hủy đơn hàng cho khách hàng
  // - Gửi notify với nội dung đơn hàng đã bị hủy và lý do
  const sendCancelNotify = async (orderID, reason) => {
    try {
      const formData = {
        senderType: "admin",
        senderUserID: userID,
        receiverID: customerID,
        title: "Thông báo hủy đơn hàng",
        message: `Đơn hàng ${orderID} của bạn đã bị hủy.\nLý do: ${reason}`,
        type: "order",
        orderID: orderID,
      };
      const response = await createNotify(formData);
      if (response) {
        console.log("Thông báo đã được gửi thành công:", response);
      }
      // Thực hiện các hành động khác nếu cần
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      // Xử lý lỗi nếu cần
    }
  };

  // Kiểm tra tình trạng sản phẩm trong đơn hàng (còn bán hay đã ngưng bán)
  // - Trả về false nếu có sản phẩm đã ngưng bán
  const checkProductAvailability = async (orderDetails) => {
    try {
      for (const item of orderDetails) {
        const product = await getProductById(item.productID);
        if (!product || product.status === "unavailable") {
          return {
            isAvailable: false,
            productName: product?.name || "Không xác định",
          }; // Return product name if unavailable
        }
      }
      return { isAvailable: true }; // All products are available
    } catch (error) {
      console.error("Error checking product availability:", error);
      return { isAvailable: false, productName: "Không xác định" }; // Assume unavailable if there's an error
    }
  };
  // Xử lý duyệt đơn hàng (chuyển trạng thái sang "Shipped")
  // - Kiểm tra sản phẩm còn bán, cập nhật trạng thái, gửi notify, reload
  const handleApproveOrder = async () => {
    Modal.confirm({
      title: "Có chắc chắn duyệt đơn hàng này không?",
      content: "Đơn hàng sẽ được chuyển sang trạng thái đã duyệt.",
      okText: "Duyệt",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const { isAvailable, productName } = await checkProductAvailability(
            order.orderDetails
          );
          if (!isAvailable) {
            Modal.error({
              content: `Không thể duyệt đơn hàng vì sản phẩm "${productName}" đã ngưng bán.`,
            });
            return;
          }

          await updateStatus(order.orderID, "Shipped");
          Modal.success({
            content: "Đơn hàng đã được duyệt thành công.",
          });
          sendNotify(order.orderID); // Gửi thông báo sau khi duyệt đơn hàng
          setTimeout(() => {
            refreshOrders();
            onClose();
          }, 1000);
        } catch (error) {
          Modal.error({
            content: "Đã xảy ra lỗi khi duyệt đơn hàng.",
          });
          console.error("Error approving order:", error);
        }
      },
    });
  };

  // Xác nhận đã nhận tiền và duyệt đơn hàng (chỉ cho thanh toán chuyển khoản)
  // - Kiểm tra trạng thái thanh toán, nếu đã nhận tiền thì duyệt đơn
  const handleConfirmPaymentAndApprove = async () => {
    Modal.confirm({
      title: "Xác nhận đã nhận được tiền?",
      content: "Hệ thống sẽ kiểm tra trạng thái thanh toán và duyệt đơn hàng.",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const paymentStatus = await checkPaymentStatus({
            paymentID: paymentDetails?.paymentID,
            newStatus: "Completed",
          });
          console.log("Payment status:", paymentStatus);

          if (paymentStatus?.data.payment.paymentStatus === "Completed") {
            await updateStatus(order.orderID, "Shipped");
            Modal.success({
              content: "Đã nhận được tiền và đơn hàng đã được duyệt.",
            });
            sendNotify(order.orderID); // Gửi thông báo sau khi duyệt đơn hàng
            setTimeout(() => {
              refreshOrders();
              onClose();
            }, 1000);
          } else {
            Modal.error({
              content: "Thanh toán chưa hoàn tất. Không thể duyệt đơn hàng.",
            });
          }
        } catch (error) {
          Modal.error({
            content: "Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán.",
          });
          console.error("Error confirming payment and approving order:", error);
        }
      },
    });
  };

  // Xử lý hủy đơn hàng (cập nhật trạng thái, cập nhật số lượng sản phẩm, gửi thông báo)
  // - Cập nhật lại số lượng sản phẩm, trạng thái đơn, gửi notify, reload
  const handleCancelOrder = () => {
    let selectedReason = cancelReason;
    let enteredReason = customReason;

    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: (
        <div>
          <p>Vui lòng chọn hoặc nhập lý do hủy đơn hàng:</p>
          <Select
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Chọn lý do hủy (không bắt buộc)"
            defaultValue={selectedReason || undefined}
            onChange={(value) => {
              selectedReason = value;
            }}
          >
            {cancellationOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Hoặc nhập lý do hủy"
            defaultValue={enteredReason}
            onChange={(e) => {
              enteredReason = e.target.value;
            }}
          />
        </div>
      ),
      okText: "Hủy đơn",
      cancelText: "Đóng",
      onOk: async () => {
        const reason = [selectedReason, enteredReason]
          .filter(Boolean) // Loại bỏ giá trị null hoặc undefined
          .join("; "); // Kết hợp cả hai lý do bằng dấu chấm phẩy

        if (!reason) {
          Modal.error({
            content: "Vui lòng chọn hoặc nhập lý do hủy đơn hàng.",
          });
          return Promise.reject(); // Ngăn modal đóng
        }
        if (order.status === "Pending") {
          await updateStatus(order.orderID, "Cancelled", { reason });
          try {
            // Cập nhật lại số lượng sản phẩm
            if (order.orderDetails) {
              await Promise.all(
                order.orderDetails.map(async (item) => {
                  const product = await getProductById(item.productID);
                  const updatedQuantity = product.quantity + item.quantity;

                  await updateProductQuantity(item.productID, {
                    ...product,
                    quantity: updatedQuantity,
                    sold: product.sold - item.quantity,
                  });
                })
              );
            }

            Modal.success({
              content: "Đơn hàng đã được hủy thành công.",
            });

            // Kiểm tra đã có thông báo hủy chưa
            const existedNotifies = await fetchCancelledOrderNotifications(
              order.orderID
            );
            if (!existedNotifies || existedNotifies.length === 0) {
              await sendCancelNotify(order.orderID, reason);
            }
            setTimeout(() => {
              refreshOrders();
              onClose();
            }, 1000);
          } catch (error) {
            Modal.error({
              content: "Đã xảy ra lỗi khi hủy đơn hàng.",
            });
            console.error("Error cancelling order:", error);
          }
        } else {
          Modal.error({
            content: "Không thể hủy đơn hàng đã được duyệt hoặc giao hàng.",
          });
          return Promise.reject(); // Ngăn modal đóng
        }
      },
    });
  };

  // In hóa đơn ra file PDF với tên là mã hóa đơn
  // - Chụp nội dung hóa đơn, xuất ra file PDF tên là mã đơn hàng
  const handlePrintInvoice = async () => {
    const invoiceElement = document.getElementById("invoice-content");
    if (!invoiceElement) return;
    const canvas = await html2canvas(invoiceElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    const fileName = order?.orderID ? `${order.orderID}.pdf` : "invoice.pdf";
    pdf.save(fileName);
  };

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
    {
      title: "Tên sản phẩm",
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <span>
          {text}{" "}
          {order.status === "Pending" && record.status === "unavailable" && (
            <span style={{ color: "red" }}>
              ({record.status === "unavailable" ? "Ngưng bán" : ""})
            </span>
          )}
        </span>
      ),
    },
    { title: "SL", dataIndex: "quantity", key: "quantity", width: 50 },
    { title: "Đơn vị", dataIndex: "unit", key: "unit", width: 80 },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (text) => {
        const format = formattedPrice(text); // Sử dụng hàm formattedPrice để định dạng
        return <span>{format}</span>; // Trả về giá đã định dạng
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => {
        const format = formattedPrice(text); // Sử dụng hàm formattedPrice để định dạng
        return <span>{format}</span>; // Trả về giá đã định dạng
      },
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
          <Button
            className="bg-blue-500 text-white"
            key="export-invoice"
            type="default"
            onClick={() => setShowInvoice(true)}
          >
            Xuất hóa đơn
          </Button>,
          order.status === "Pending" && (
            <Button
              className="bg-red-500 text-white"
              key="cancel"
              type="default"
              onClick={handleCancelOrder}
            >
              Hủy đơn
            </Button>
          ),
          order.status === "Pending" &&
            (order.paymentMethod.toLowerCase() === "bank" ? (
              <Button
                className="bg-primary text-white"
                key="confirm-payment"
                type="primary"
                onClick={handleConfirmPaymentAndApprove}
              >
                Đã thanh toán
              </Button>
            ) : (
              <Button
                className="bg-primary text-white"
                key="approve"
                type="primary"
                onClick={handleApproveOrder}
              >
                Duyệt đơn
              </Button>
            )),

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
            {customerName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {customerPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{order.address}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {order.status === "Pending"
              ? "Đang chờ duyệt"
              : order.status === "Shipped"
              ? "Đang giao hàng"
              : order.status === "Delivered"
              ? "Đã giao thành công"
              : `Đã hủy đơn (${
                  reason.length > 0
                    ? reason[0]?.message // Lấy message từ thông báo đầu tiên
                    : "Không có lý do hủy"
                })`}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đặt">
            {formattedDate(order.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              order.status === "Pending"
                ? "Thời gian chờ duyệt"
                : order.status === "Shipped"
                ? "Thời gian duyệt"
                : order.status === "Delivered"
                ? "Thời gian nhận"
                : order.status === "Cancelled"
                ? "Thời gian hủy"
                : "Thời gian"
            }
          >
            {order.status === "Pending"
              ? "Chưa duyệt"
              : order.status === "Shipped"
              ? formattedDate(order.updatedAt)
              : order.status === "Delivered"
              ? formattedDate(order.updatedAt)
              : order.status === "Cancelled"
              ? formattedDate(order.updatedAt)
              : "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {order.paymentMethod.toLowerCase() === "cash"
              ? "Thanh toán khi nhận hàng"
              : order.paymentMethod === "MOMO"
              ? "Ví Momo"
              : `Chuyển khoản, nội dung: ${
                  paymentDetails?.content || "Không có nội dung"
                }`}
          </Descriptions.Item>
          {paymentDetails?.paymentID && (
            <Descriptions.Item label="Mã thanh toán">
              {paymentDetails.paymentID}
            </Descriptions.Item>
          )}
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
              {formattedPrice(totalProductPrice)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            <span className="font-bold text-deleteColor">{shippingNote}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền hóa đơn">
            <span className="font-bold">
              {formattedPrice(order.totalAmount)}
            </span>
          </Descriptions.Item>
        </Descriptions>

        {/* Popup xem trước hóa đơn */}
        <Modal
          open={showInvoice}
          onCancel={() => setShowInvoice(false)}
          footer={[
            <Button key="print" type="primary" onClick={handlePrintInvoice}>
              In hóa đơn
            </Button>,
            <Button key="close" onClick={() => setShowInvoice(false)}>
              Đóng
            </Button>,
          ]}
          width={820}
          title="Xem trước hóa đơn"
          bodyStyle={{ padding: 0, display: "flex", justifyContent: "center" }}
          centered // Thêm thuộc tính này để modal luôn ở giữa màn hình
        >
          <div className="flex justify-center items-center w-full">
            <ExportInvoice order={order} customerName={customerName} />
          </div>
        </Modal>
      </Modal>
    </ConfigProvider>
  );
};

OrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customerName: PropTypes.string.isRequired,
  customerPhone: PropTypes.string.isRequired,
  customerID: PropTypes.string.isRequired,
  orderDetails: PropTypes.arrayOf(
    PropTypes.shape({
      productID: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  refreshOrders: PropTypes.func.isRequired,
  // order: PropTypes.object.isRequired,
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
    updatedAt: PropTypes.string,

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
