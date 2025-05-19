import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../services/OrderService";
// Import the fetchCancelledOrderNotifications function
import { fetchCancelledOrderNotifications } from "../../../services/NotifyService";

const OrderDetail = () => {
  const { orderID } = useParams();
  const [order, setOrder] = useState(null);
  const userProfile = useSelector((state) => state.user.user);

  const statusMapping = {
    Pending: "Chờ xử lý",
    Shipped: "Đang giao",
    Delivered: "Đã giao",
    Cancelled: "Đã hủy",
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderID);

        // Check if order is cancelled and has no cancellation reason
        if (
          fetchedOrder.status === "Cancelled" &&
          !fetchedOrder.cancelReason &&
          !fetchedOrder.cancel_reason &&
          !fetchedOrder.reasonForCancellation &&
          !fetchedOrder.cancelDetails?.reason &&
          !fetchedOrder.cancelInfo
        ) {
          try {
            // Fetch cancellation notifications
            const notifications = await fetchCancelledOrderNotifications(
              orderID
            );
            console.log(
              `Notifications for cancelled order ${orderID}:`,
              notifications
            );

            if (notifications && notifications.length > 0) {
              // Find the cancellation notification
              const cancelNotification = notifications.find(
                (n) =>
                  n.type === "order" && n.title === "Thông báo hủy đơn hàng"
              );

              if (cancelNotification) {
                // Extract reason from the message using regex
                const reasonMatch =
                  cancelNotification.message.match(/Lý do: (.*?)(?:$|\n)/s);
                if (reasonMatch && reasonMatch[1]) {
                  const cancelReason = reasonMatch[1].trim();
                  console.log(
                    `Extracted cancellation reason for order ${orderID}:`,
                    cancelReason
                  );

                  // Add the cancellation reason to the order object
                  fetchedOrder.cancelReason = cancelReason;
                }
              }
            }
          } catch (notifyError) {
            console.error(
              `Error fetching notifications for order ${orderID}:`,
              notifyError
            );
          }
        }

        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };
    fetchOrder();
  }, [orderID]);

  if (!order) {
    return (
      <div className="text-center text-lg text-gray-500 mt-10">
        Đơn hàng không tồn tại.
      </div>
    );
  }

  const calculateTotalAmount = () => {
    return (order.orderDetails || []).reduce(
      (total, detail) => total + detail.totalAmount,
      0
    );
  };

  const shippingFee = 50000;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 mt-10 font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Chi tiết đơn hàng #{order.orderID}
      </h2>

      <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-start flex-col md:flex-row">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Ngày đặt hàng:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Trạng thái:</strong>{" "}
              {statusMapping[order.status] || order.status}
            </p>
          </div>
          <div
            className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-medium
              ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Shipped"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {statusMapping[order.status] || order.status}
          </div>
        </div>

        {order.status === "Cancelled" && (
          <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-red-600 font-medium">
              Lý do hủy đơn:{" "}
              {order.cancelReason ||
                order.cancel_reason ||
                order.reasonForCancellation ||
                order.cancelDetails?.reason ||
                order.cancelInfo ||
                "Không có lý do"}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thông tin thanh toán */}
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin thanh toán
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Họ và tên:</strong>{" "}
              {userProfile?.username ||
                order.customerName ||
                "Không có thông tin"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.address || "Không có thông tin"}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {userProfile?.phone || order.phone || "Không có thông tin"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {userProfile?.email || order.email || "Không có thông tin"}
            </p>
          </div>

          <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            Thông tin bổ sung
          </h4>
          <p className="text-sm text-gray-600">
            <strong>Ghi chú:</strong> {order.note || "Không có ghi chú"}
          </p>
        </div>

        {/* Chi tiết đơn hàng */}
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Đơn hàng của bạn
          </h4>
          <div className="space-y-4 text-sm text-gray-700">
            {(order.orderDetails || []).map((detail, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Sản phẩm ID: {detail.productID}</p>
                  <p>
                    Số lượng: {detail.quantity} x{" "}
                    {(detail.totalAmount / detail.quantity).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </p>
                </div>
                <p className="font-semibold text-right">
                  {detail.totalAmount.toLocaleString("vi-VN")} VND
                </p>
              </div>
            ))}
          </div>

          <hr className="my-5" />

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <p>
                <strong>Tổng tiền sản phẩm:</strong>
              </p>
              <p>{calculateTotalAmount().toLocaleString("vi-VN")} VND</p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Phí vận chuyển:</strong>
              </p>
              <p>{shippingFee.toLocaleString("vi-VN")} VND</p>
            </div>
            <div className="flex justify-between font-bold text-base text-green-700">
              <p>Tổng tiền</p>
              <p>
                {(calculateTotalAmount() + shippingFee).toLocaleString("vi-VN")}{" "}
                VND
              </p>
            </div>
          </div>

          <h4 className="text-base font-semibold text-gray-800 mt-6 mb-2">
            Phương thức thanh toán
          </h4>
          <p className="text-sm text-gray-600">
            {order.paymentMethod || "Không rõ"}
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          className="w-48 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
