import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrdersByUserId } from "../../../services/OrderService";

const OrderProfile = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userID = localStorage.getItem("userID");
        if (userID) {
          const response = await getOrdersByUserId(userID);
          console.log("API Response:", response);

          if (response && response.orders) {
            setOrders(response.orders);
          } else {
            console.error("Invalid API response structure:", response);
            setError("Không có dữ liệu đơn hàng.");
            setOrders([]);
          }
        } else {
          console.warn("No userID found in localStorage");
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

  const filteredOrders = filter === "Tất cả" 
    ? orders 
    : orders.filter(order => order.status === filter); // Filter orders based on status

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <div className="flex justify-around">
          {["Tất cả", "Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
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

      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {/* Scrollable container for orders */}
          <div className="max-h-96 overflow-y-auto">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-4 border-b border-gray-300">
                <h3 className="text-lg font-bold">Đơn hàng #{order.orderID}</h3>
                <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700">Tổng tiền: {order.totalAmount} VND</p>
                <p className="text-sm text-gray-700">Trạng thái: {order.status}</p>
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
                <Link to={`/user/order/${order.orderID}`} className="text-green-500 hover:text-green-600 mt-2 inline-block">
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderProfile;
