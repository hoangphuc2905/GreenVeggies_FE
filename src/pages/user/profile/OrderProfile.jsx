import { getProductById } from "../../../services/ProductService"; // Moved to the top
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getOrdersByUserId,
  updateStatus,
} from "../../../services/OrderService";
import ReviewModal from "./ReviewModal"; // Import the ReviewModal component
import { Modal } from "antd"; // Import Modal from Ant Design

const OrderProfile = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Thêm state cho thông báo
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const [showReviewDialog, setShowReviewDialog] = useState(false); // State for dialog visibility
  const [productDetails, setProductDetails] = useState({}); // Cache for product details
  const [showReviewModal, setShowReviewModal] = useState(false); // State for modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product

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
            // Sort orders by createdAt in descending order
            const sortedOrders = response.orders.sort(
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
        setError("Lỗi khi tải danh sách đơn hàng.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderID, newStatus) => {
    try {
      const result = await updateStatus(orderID, newStatus);
      if (result) {
        setMessage("Cập nhật trạng thái thành công!");
        setOrders((prev) =>
          prev.map((order) =>
            order.orderID === orderID ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setMessage("Lỗi khi cập nhật trạng thái.");
      }
    } catch (error) {
      setMessage("Lỗi khi cập nhật trạng thái đơn hàng.");
    }

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchProductDetails = async (productId) => {
    if (!productDetails[productId]) {
      const details = await getProductById(productId);
      setProductDetails((prev) => ({ ...prev, [productId]: details }));
    }
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

  const handleCancelOrder = (orderID) => {
    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => handleUpdateStatus(orderID, "Cancelled"),
    });
  };

  const handleConfirmReceived = (orderID) => {
    Modal.confirm({
      title: "Xác nhận nhận hàng",
      content: "Bạn có chắc chắn đã nhận được hàng?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => handleUpdateStatus(orderID, "Delivered"),
    });
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
    </div>
  );
};

export default OrderProfile;
