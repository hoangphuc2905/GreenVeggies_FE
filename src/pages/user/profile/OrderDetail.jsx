import { useParams } from "react-router-dom"; // Import useParams để lấy ID từ URL

const OrderDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const order = getOrderById(id); // Lấy dữ liệu đơn hàng từ ID (sử dụng phương thức getOrderById để mô phỏng)

  if (!order) {
    return <p>Đơn hàng không tồn tại.</p>;
  }

  // Tính tổng tiền từ các sản phẩm
  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Chi tiết đơn hàng #{order.id}</h2>

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
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <p className="text-sm text-gray-700">{item.name} - {item.quantity} x {item.price} VND</p>
                <p className="text-sm text-gray-700">{item.quantity * item.price} VND</p>
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

// Hàm giả lấy đơn hàng theo ID (thực tế bạn có thể lấy từ API)
const getOrderById = (id) => {
    const orders = [
      {
        id: "1",
        customerName: "Nguyễn Minh Thuận",
        address: "số 15, 4, Nam Cần",
        city: "Cà Mau",
        phone: "0977041860",
        email: "nguyenminhthuan250718@gmail.com",
        note: "Không có ghi chú",
        items: [
          { id: 1, name: "Táo đỏ", quantity: 2, price: 100000 },
          { id: 2, name: "Chuối", quantity: 3, price: 50000 },
        ],
        total: 500000,
        paymentMethod: "Trả tiền mặt khi nhận hàng",
      },
    ];
    return orders.find(order => order.id === id);
  };

export default OrderDetail;
