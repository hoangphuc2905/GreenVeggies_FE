import OrderCard from "./OrderCard";

const orderData = [
  {
    title: "Đã đặt",
    value: 79,
    growth: 5,
    unit: "đơn",
    color: "#FF9500",
  },
  {
    title: "Thành công",
    value: 60,
    growth: 5,
    unit: "đơn",
    color: "#34C759",
  },
  {
    title: "Đã hủy",
    value: 19,
    growth: -20,
    unit: "đơn",
    color: "#FF3B30",
  },
  {
    title: "Đang xử lý",
    value: 2,
    growth: null,
    unit: "đơn",
    color: "#000000",
  },
];

const OrderList = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {orderData.map((item, index) => (
        <OrderCard key={index} {...item} />
      ))}
    </div>
  );
};

export default OrderList;
