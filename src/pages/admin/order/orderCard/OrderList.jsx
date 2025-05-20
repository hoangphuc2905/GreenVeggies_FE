import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import OrderCard from "./OrderCard";
import { getOrderStatusByDate } from "../../../../services/StatisticService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const OrderList = ({ selectedDay, selectedMonth, selectedYear }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrderStats = async () => {
    setLoading(true);
    try {
      let dateString = null;
      if (selectedYear) {
        if (selectedMonth) {
          if (selectedDay) {
            dateString = dayjs(
              `${selectedYear}-${selectedMonth}-${selectedDay}`
            ).format("DD-MM-YYYY");
          } else {
            dateString = dayjs(`${selectedYear}-${selectedMonth}-01`).format(
              "MM-YYYY"
            );
          }
        } else {
          dateString = dayjs(`${selectedYear}-01-01`).format("YYYY");
        }
      }

      console.log("Fetching order stats for date:", dateString);
      const response = await getOrderStatusByDate(
        selectedDay,
        selectedMonth,
        selectedYear
      );
      console.log("Order stats response:", response);
      setOrderData(response.stats);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStats();
  }, [selectedDay, selectedMonth, selectedYear]);

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
      color: "#007BFF",
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
        option: "Pending",
        value: current.Pending,
        growth: null,
        unit: "đơn",
        color: "#000000",
      },
      {
        title: "Đã giao",
        option: "Delivered",
        value: current.Delivered,
        growth: change.Delivered,
        unit: "đơn",
        color: "#34C759",
      },
      {
        title: "Đã hủy",
        option: "Cancelled",
        value: current.Cancelled,
        growth: change.Cancelled,
        unit: "đơn",
        color: "#FF3B30",
      },
      {
        title: "Đang vận chuyển",
        option: "Shipped",
        value: current.Shipped,
        growth: change.Shipped,
        unit: "đơn",
        color: "#007BFF",
      },
    ];
  }

  const handleCardClick = (status) => {
    console.log("Clicked card with status:", status);
    navigate("/admin/dashboard/orders/list", {
      state: {
        status: status === "Đang xử lý" ? "Pending" : status,
        day: selectedDay,
        month: selectedMonth,
        year: selectedYear,
      },
    });
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((item, index) => (
        <OrderCard
          key={index}
          {...item}
          onClick={() => handleCardClick(item.option)}
        />
      ))}
    </div>
  );
};

OrderList.propTypes = {
  selectedDay: PropTypes.number,
  selectedMonth: PropTypes.number,
  selectedYear: PropTypes.number,
};

export default OrderList;
