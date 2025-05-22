import { Input, Modal, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createNotify } from "../../../services/NotifyService";
import {
  getOrderById,
  getOrdersByUserId,
  updateStatus,
} from "../../../services/OrderService";
import {
  getProductById,
  updateProductQuantity, // Add this import for updating product quantities
} from "../../../services/ProductService";
// Import the new function to fetch cancelled order notifications
import { fetchCancelledOrderNotifications } from "../../../services/NotifyService";
import ReviewModal from "./ReviewModal";

const OrderProfile = () => {
  // State cũ giữ nguyên...
  const [filter, setFilter] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Thêm state mới cho phần hủy đơn hàng
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderID, setCancelOrderID] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // Danh sách lý do hủy đơn hàng
  const cancelReasons = [
    "Đổi ý, không muốn mua nữa",
    "Tìm thấy sản phẩm rẻ hơn ở nơi khác",
    "Đặt nhầm sản phẩm",
    "Đặt trùng đơn hàng",
    "Thời gian giao hàng quá lâu",
    "Khác",
  ];

  const statusMapping = {
    Pending: "Chờ xử lý",
    Shipped: "Đang giao",
    Delivered: "Đã giao",
    Cancelled: "Đã hủy",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userID = localStorage.getItem("userID");
        if (userID) {
          const response = await getOrdersByUserId(userID);
          if (response && response.orders) {
            console.log("Full orders response:", response);

            // Process orders with async operations using Promise.all
            const processedOrders = await Promise.all(
              response.orders.map(async (order) => {
                // First check for existing cancel reason in order
                let cancelReason =
                  order.cancelReason ||
                  order.cancel_reason ||
                  order.reasonForCancellation ||
                  order.cancelDetails?.reason ||
                  order.cancelInfo;

                // If order is cancelled but no reason found, try to fetch from notifications
                if (order.status === "Cancelled" && !cancelReason) {
                  try {
                    const notifications =
                      await fetchCancelledOrderNotifications(order.orderID);
                    console.log(
                      `Notifications for cancelled order ${order.orderID}:`,
                      notifications
                    );

                    if (notifications && notifications.length > 0) {
                      // Find the cancellation notification
                      const cancelNotification = notifications.find(
                        (n) =>
                          n.type === "order" &&
                          n.title === "Thông báo hủy đơn hàng"
                      );

                      if (cancelNotification) {
                        // Extract reason from the message using regex
                        // Format: "Thông báo đơn hàng {orderID} đã bị hủy.\nLý do: {reason}"
                        const reasonMatch =
                          cancelNotification.message.match(
                            /Lý do: (.*?)(?:$|\n)/s
                          );
                        if (reasonMatch && reasonMatch[1]) {
                          cancelReason = reasonMatch[1].trim();
                          console.log(
                            `Extracted cancellation reason for order ${order.orderID}:`,
                            cancelReason
                          );
                        }
                      }
                    }
                  } catch (notifyError) {
                    console.error(
                      `Error fetching notifications for order ${order.orderID}:`,
                      notifyError
                    );
                  }
                }

                // Return order with enhanced cancellation reason
                return {
                  ...order,
                  cancelReason: cancelReason || null,
                };
              })
            );

            // Sort and set the processed orders
            const sortedOrders = processedOrders.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
          } else {
            setError("Không có dữ liệu đơn hàng.");
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Lỗi khi tải danh sách đơn hàng.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Cập nhật hàm handleUpdateStatus để thêm lý do hủy đơn
  const handleUpdateStatus = async (orderID, newStatus, cancelReason = "") => {
    try {
      // Chuẩn bị dữ liệu để gửi đến API
      let updateData;
      let statusToUpdate;

      if (typeof newStatus === "string") {
        statusToUpdate = newStatus;
        if (newStatus === "Cancelled" && cancelReason) {
          updateData = { status: newStatus, cancelReason };
        } else {
          updateData = { status: newStatus };
        }
      } else {
        updateData = newStatus; // Nếu newStatus đã là object
        statusToUpdate = newStatus.status;
      }

      const result = await updateStatus(orderID, statusToUpdate, true);

      if (result) {
        setMessage(
          statusToUpdate === "Cancelled"
            ? "Đơn hàng đã được hủy thành công!"
            : "Cập nhật trạng thái thành công!"
        );

        setOrders((prev) =>
          prev.map((order) =>
            order.orderID === orderID
              ? {
                  ...order,
                  status: statusToUpdate,
                  cancelReason:
                    cancelReason ||
                    (typeof newStatus === "object"
                      ? newStatus.cancelReason
                      : undefined),
                }
              : order
          )
        );
      } else {
        setMessage("Lỗi khi cập nhật trạng thái.");
      }
    } catch (error) {
      setMessage("Lỗi khi cập nhật trạng thái đơn hàng.");
      console.error("Error updating order status:", error);
    }

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setMessage(null), 3000);
  };
  //Thông báo hủy đơn
  const sendCancelNotify = async (orderID, reason) => {
    try {
      const formData = {
        senderType: "system",
        senderUserID: localStorage.getItem("userID"),
        receiverID: "admin",
        title: "Thông báo hủy đơn hàng",
        message: `Thông báo đơn hàng ${orderID} đã bị hủy.\nLý do: ${reason}`,
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
  // Thay đổi hàm handleCancelOrder
  const handleCancelOrder = (orderID) => {
    setCancelOrderID(orderID);
    setCancelReason("");
    setOtherReason("");
    setShowCancelModal(true);
  };

  // Hàm xử lý xác nhận hủy đơn hàng
  // Cập nhật trong hàm confirmCancelOrder
  // Hàm xử lý xác nhận hủy đơn hàng
  const confirmCancelOrder = async () => {
    // Xác định lý do cuối cùng dựa trên lựa chọn
    const finalReason =
      cancelReason === "Khác"
        ? `Khác: ${otherReason}` // Thêm tiền tố "Khác:" để biết đây là lý do tùy chỉnh
        : cancelReason;

    if (!finalReason || (cancelReason === "Khác" && !otherReason)) {
      setMessage("Vui lòng chọn hoặc nhập lý do hủy đơn hàng!");
      return;
    }

    console.log("Sending cancel reason to API:", finalReason); // Log để kiểm tra

    try {
      // Fetch the full order details to get product information
      const fullOrderDetails = await getOrderById(cancelOrderID);

      // Gửi đối tượng với status và cancelReason
      await handleUpdateStatus(cancelOrderID, {
        status: "Cancelled",
        cancelReason: finalReason,
      });

      // Restore product quantities if order details exist
      if (fullOrderDetails && fullOrderDetails.orderDetails) {
        await Promise.all(
          fullOrderDetails.orderDetails.map(async (item) => {
            const product = await getProductById(item.productID);
            const updatedQuantity = product.quantity + item.quantity;

            await updateProductQuantity(item.productID, {
              ...product,
              quantity: updatedQuantity,
              sold: product.sold - item.quantity,
            });

            console.log(
              `Restored quantity for product ${item.productID}: +${item.quantity}`
            );
          })
        );
      }

      // Gửi thông báo hủy đơn hàng cho admin.
      await sendCancelNotify(cancelOrderID, finalReason);

      setMessage("Đơn hàng đã được hủy !");
    } catch (error) {
      console.error("Error during order cancellation:", error);
      setMessage("Lỗi khi hủy đơn hàng. Vui lòng thử lại sau.");
    }

    setShowCancelModal(false);
  };

  const fetchProductDetails = async (productId) => {
    if (!productDetails[productId]) {
      const details = await getProductById(productId);
      setProductDetails((prev) => ({ ...prev, [productId]: details }));
    }
  };

  // Add this function to handle order receipt confirmation
  const handleConfirmReceived = async (orderID) => {
    Modal.confirm({
      title: "Xác nhận đã nhận hàng",
      content:
        "Bạn chắc chắn đã nhận được đơn hàng này? Hành động này không thể hoàn tác sau khi xác nhận.",
      okText: "Xác nhận đã nhận",
      cancelText: "Hủy bỏ",
      onOk: async () => {
        try {
          await handleUpdateStatus(orderID, "Delivered");
          setMessage("Xác nhận đã nhận hàng thành công!");
        } catch (error) {
          console.error("Error confirming order receipt:", error);
          setMessage("Lỗi khi xác nhận đã nhận hàng. Vui lòng thử lại sau.");
        }

        // Automatically hide the message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      },
    });
  };

  const handleReviewClick = async (order) => {
    if (order.orderDetails.length > 1) {
      for (const item of order.orderDetails) {
        await fetchProductDetails(item.productID);
      }
      setSelectedOrder(order);
      setShowReviewDialog(true);
    } else {
      const product = await getProductById(order.orderDetails[0].productID);
      handleOpenReviewModal(product);
    }
  };

  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (reviewData) => {
    console.log("Review submitted:", reviewData);
    // Add logic to send review data to the server
  };

  const closeReviewDialog = () => {
    setShowReviewDialog(false);
    setSelectedOrder(null);
  };

  const filteredOrders =
    filter === "Tất cả"
      ? orders
      : orders.filter((order) => statusMapping[order.status] === filter);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <div className="flex justify-around">
          {["Tất cả", "Chờ xử lý", "Đang giao", "Đã giao", "Đã hủy"].map(
            (status) => (
              <button
                key={status}
                className={`text-sm font-semibold px-4 py-2 rounded ${
                  filter === status
                    ? "bg-green-100 text-green-500"
                    : "bg-gray-100 text-gray-700"
                } hover:bg-green-200`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            )
          )}
        </div>
        <hr className="my-4" />
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        Đơn hàng của bạn
      </h2>

      {/* Hiển thị thông báo nếu có */}
      {message && (
        <p className="text-center text-blue-600 font-medium mb-4">{message}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 border-b border-gray-300"
            >
              <h3 className="text-lg font-bold">Đơn hàng #{order.orderID}</h3>
              <p className="text-sm text-gray-500">
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">
                Tổng tiền: {order.totalAmount} VND
              </p>
              <p className="text-sm text-gray-700">
                Trạng thái: {statusMapping[order.status]}
              </p>

              {/* Hiển thị lý do hủy đơn nếu đã hủy */}
              {order.status === "Cancelled" && (
                <p className="text-sm text-red-500">
                  Lý do hủy:{" "}
                  {order.cancelReason ? order.cancelReason : "Không có lý do"}
                </p>
              )}

              <div className="mt-2">
                <h4 className="text-md font-semibold">Sản phẩm:</h4>
                <ul className="list-disc list-inside">
                  {order.orderDetails.map((item) => (
                    <li key={item._id}>
                      {item.productID} - {item.quantity} x{" "}
                      {item.totalAmount / item.quantity} VND
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/user/order/${order.orderID}`}
                  className="text-green-500 hover:text-green-600"
                >
                  Xem chi tiết
                </Link>

                <div className="space-x-2">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.orderID)}
                      className="bg-red-100 text-red-500 px-4 py-2 rounded hover:bg-red-200"
                    >
                      Hủy đơn
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      onClick={() => handleConfirmReceived(order.orderID)}
                      className="bg-blue-100 text-blue-500 px-4 py-2 rounded hover:bg-blue-200"
                    >
                      Đã nhận hàng
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <button
                      onClick={() => handleReviewClick(order)}
                      className="bg-yellow-100 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-200"
                    >
                      Đánh giá
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
      )}

      {/* Dialog for selecting a product to review */}
      {showReviewDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              Chọn sản phẩm để đánh giá
            </h3>
            <ul className="space-y-4">
              {selectedOrder.orderDetails.map((item) => {
                const product = productDetails[item.productID];
                return (
                  <li key={item._id} className="flex items-center space-x-4">
                    <img
                      src={product?.imageUrl?.[0] || "/placeholder.png"} // Use the first image from imageUrl array
                      alt={product?.name || "Sản phẩm"}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <button
                      onClick={() => {
                        handleOpenReviewModal(product);
                        closeReviewDialog();
                      }}
                      className="flex-1 text-left bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                    >
                      {product?.name || "Đang tải..."}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={closeReviewDialog}
              className="mt-4 w-full bg-red-100 text-red-500 px-4 py-2 rounded hover:bg-red-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {showReviewModal && selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* Thêm Modal chọn lý do hủy đơn hàng */}
      {showCancelModal && (
        <Modal
          title="Lý do hủy đơn hàng"
          open={showCancelModal}
          onOk={confirmCancelOrder}
          onCancel={() => setShowCancelModal(false)}
          okText="Xác nhận hủy"
          cancelText="Đóng"
          okButtonProps={{
            disabled:
              !cancelReason || (cancelReason === "Khác" && !otherReason),
          }}
        >
          <p className="mb-4">Vui lòng chọn lý do hủy đơn hàng:</p>

          <Radio.Group
            onChange={(e) => setCancelReason(e.target.value)}
            value={cancelReason}
          >
            <Space direction="vertical">
              {cancelReasons.map((reason) => (
                <Radio key={reason} value={reason}>
                  {reason}
                </Radio>
              ))}
            </Space>
          </Radio.Group>

          {/* Hiển thị input text khi chọn lý do "Khác" */}
          {cancelReason === "Khác" && (
            <Input
              placeholder="Vui lòng nhập lý do của bạn"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="mt-3"
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default OrderProfile;
