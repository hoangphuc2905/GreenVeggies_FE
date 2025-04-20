import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import OrderCard from "./OrderCard";
import { getOrderStatusByDate } from "../../../../services/StatisticService";

const OrderList = ({ selectedDate }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderStats = async (date) => {
    console.log("Fetching order stats for date:", selectedDate);
    setLoading(true);
    try {
      const response = await getOrderStatusByDate(date.format("DD-MM-YYYY"));
      setOrderData(response.stats);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchOrderStats(selectedDate);
    }
  }, [selectedDate]);

  // Placeholder khi chưa có dữ liệu
  const placeholderCards = [
    {
      title: "Đang xử lý",
      value: 0,
      growth: null,
      unit: "đơn",
      color: "#000000",
    },
    {
      title: "Đã giao",
      value: 0,
      growth: 0,
      unit: "đơn",
      color: "#34C759",
    },
    {
      title: "Đã hủy",
      value: 0,
      growth: 0,
      unit: "đơn",
      color: "#FF3B30",
    },
    {
      title: "Đang vận chuyển",
      value: 0,
      growth: 0,
      unit: "đơn",
      color: "#FF9500",
    },
  ];

  // Dữ liệu để hiển thị (placeholder hoặc dữ liệu thật)
  let cards = placeholderCards;
  if (!loading && orderData?.currentStats && orderData?.percentageDifference) {
    const current = orderData.currentStats;
    const change = orderData.percentageDifference;
    cards = [
      {
        title: "Đang xử lý",
        value: current.Pending,
        growth: null,
        unit: "đơn",
        color: "#000000",
      },
      {
        title: "Đã giao",
        value: current.Delivered,
        growth: change.Delivered,
        unit: "đơn",
        color: "#34C759",
      },
      {
        title: "Đã hủy",
        value: current.Cancelled,
        growth: change.Cancelled,
        unit: "đơn",
        color: "#FF3B30",
      },
      {
        title: "Đang vận chuyển",
        value: current.Shipped,
        growth: change.Shipped,
        unit: "đơn",
        color: "#FF9500",
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((item, index) => (
        <OrderCard key={index} {...item} />
      ))}
    </div>
  );
};

OrderList.propTypes = {
  selectedDate: PropTypes.object.isRequired,
};

export default OrderList;
