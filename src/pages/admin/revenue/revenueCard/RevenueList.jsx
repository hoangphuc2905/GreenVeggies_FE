import RevenueCard from "./RevenueCard";

const revenueData = [
  {
    title: "Doanh số",
    value: 10000000,
    previousValue: 9500000,
    growth: 5,
    unit: "VNĐ",
    color: "#FFCC00",
  },
  {
    title: "Đã đặt",
    value: 120,
    previousValue: 100,
    growth: 20,
    unit: "đơn",
    color: "#FF9500",
  },
  {
    title: "Lợi nhuận",
    value: 3000000,
    previousValue: 2800000,
    growth: 7,
    unit: "VNĐ",
    color: "#34C759",
  },
  {
    title: "Chi tiêu",
    value: 5000000,
    previousValue: 5500000,
    growth: -9,
    unit: "VNĐ",
    color: "#FF3B30",
  },
];

const RevenueList = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {revenueData.map((item, index) => (
        <RevenueCard key={index} {...item} />
      ))}
    </div>
  );
};

export default RevenueList;
