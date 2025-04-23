import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrdersByUserId, updateStatus } from "../../../services/OrderService";

const OrderProfile = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Thêm state cho thông báo

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
            setOrders(response.orders);
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

  const filteredOrders = filter === "Tất cả"
    ? orders
    : orders.filter(order => statusMapping[order.status] === filter);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <div className="flex justify-around">
          {["Tất cả", "Chờ xử lý", "Đang giao", "Đã giao", "Đã hủy"].map((status) => (
            <button
              key={status}
              className={`text-sm font-semibold ${filter === status ? "text-green-500" : "text-gray-700"} hover:text-green-500`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <hr className="my-4" />
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Đơn hàng của bạn</h2>

      {/* Hiển thị thông báo nếu có */}
      {message && <p className="text-center text-blue-600 font-medium mb-4">{message}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-4 border-b border-gray-300">
              <h3 className="text-lg font-bold">Đơn hàng #{order.orderID}</h3>
              <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700">Tổng tiền: {order.totalAmount} VND</p>
              <p className="text-sm text-gray-700">Trạng thái: {statusMapping[order.status]}</p>
              <div className="mt-2">
                <h4 className="text-md font-semibold">Sản phẩm:</h4>
                <ul className="list-disc list-inside">
                  {order.orderDetails.map((item) => (
                    <li key={item._id}>
                      {item.productID} - {item.quantity} x {item.totalAmount / item.quantity} VND
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
                      onClick={() => handleUpdateStatus(order.orderID, "Cancelled")}
                      className="text-red-500 hover:underline"
                    >
                      Hủy đơn
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      onClick={() => handleUpdateStatus(order.orderID, "Delivered")}
                      className="text-blue-500 hover:underline"
                    >
                      Đã nhận hàng
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
    </div>
  );
};

export default OrderProfile;
