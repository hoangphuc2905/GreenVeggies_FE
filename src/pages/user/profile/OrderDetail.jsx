import { useParams } from "react-router-dom";
import { getOrderById } from "../../../services/OrderService";
import { useEffect, useState } from "react";

const OrderDetail = () => {
  const { orderID } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderID); 
        setOrder(fetchedOrder);
        console.log("Đơn hàng:", fetchedOrder); // In ra thông tin đơn hàng
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };
    fetchOrder();
  }, [orderID]);

  if (!order) {
    return <p>Đơn hàng không tồn tại.</p>;
  }

  // Tính tổng tiền từ các sản phẩm
  const calculateTotal = () => {
    return (order.orderDetails || []).reduce((total, detail) => total + detail.totalAmount, 0);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Chi tiết đơn hàng #{order.orderID}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Thông tin thanh toán */}
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Thông tin thanh toán</h4>
          <p className="text-sm text-gray-500"><strong>Họ và tên:</strong> {order.customerName}</p>
          <p className="text-sm text-gray-500"><strong>Địa chỉ:</strong> {order.address}</p>
          <p className="text-sm text-gray-500"><strong>Tỉnh/Thành phố:</strong> {order.city}</p>
          <p className="text-sm text-gray-500"><strong>Số điện thoại:</strong> {order.phone}</p>
          <p className="text-sm text-gray-500"><strong>Email:</strong> {order.email}</p>

          <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Thông tin bổ sung</h4>
          <p className="text-sm text-gray-500"><strong>Ghi chú:</strong> {order.note || "Không có ghi chú"}</p>
        </div>

        <div>
          {/* Chi tiết đơn hàng */}
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Đơn hàng của bạn</h4>
          <div className="space-y-2">
            {(order.orderDetails || []).map((detail) => (
              <div key={detail._id} className="flex justify-between">
                <p className="text-sm text-gray-700">Sản phẩm ID: {detail.productID} - {detail.quantity} x {detail.totalAmount / detail.quantity} VND</p>
                <p className="text-sm text-gray-700">{detail.totalAmount} VND</p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-gray-700">
            <p><strong>Tổng tiền sản phẩm:</strong></p>
            <p>{calculateTotal()} VND</p>
          </div>
          <div className="flex justify-between text-gray-700">
            <p><strong>Phí vận chuyển:</strong></p>
            <p>50,000 VND</p>
          </div>
          <div className="flex justify-between text-gray-700 font-bold">
            <p><strong>Tổng tiền:</strong></p>
            <p>{calculateTotal() + 50000} VND</p>
          </div>

          <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Phương thức thanh toán</h4>
          <p className="text-sm text-gray-500">Phương thức thanh toán: {order.paymentMethod}</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          className="w-48 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
