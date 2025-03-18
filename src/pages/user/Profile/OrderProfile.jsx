import { useState, useEffect } from "react";
import axios from "axios";

const OrderProfile = () => {
  const [orders, setOrders] = useState([]);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8004/api/orders?userID=${userID}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };

    fetchOrders();
  }, [userID]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  // Tính chỉ số bắt đầu và kết thúc để phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      {/* Menu ngang */}
      <div className="mb-4">
        <div className="flex justify-around">
          <button className="text-sm font-semibold text-gray-700 hover:text-green-500">Tất cả</button>
          <button className="text-sm font-semibold text-gray-700 hover:text-green-500">Chờ thanh toán</button>
          <button className="text-sm font-semibold text-gray-700 hover:text-green-500">Vận chuyển</button>
          <button className="text-sm font-semibold text-gray-700 hover:text-green-500">Hoàn thành</button>
          <button className="text-sm font-semibold text-gray-700 hover:text-green-500">Đã hủy</button>
        </div>
        <hr className="my-4" />
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Đơn hàng của bạn</h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-bold">Đơn hàng #{order.id}</h3>
              <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700">Tổng tiền: {order.total} VND</p>
              <div className="mt-2">
                <h4 className="text-md font-semibold">Sản phẩm:</h4>
                <ul className="list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} - {item.quantity} x {item.price} VND
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
      )}

      {/* Phân trang */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        >
          Trang trước
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * ordersPerPage >= orders.length}
          className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        >
          Trang tiếp
        </button>
      </div>
    </div>
  );
};

export default OrderProfile;
