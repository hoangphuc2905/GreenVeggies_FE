import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import RevenueCard from "./RevenueCard";
import { getRevenueByDate } from "../../../../services/StatisticService";

const RevenueList = ({ selectedDate }) => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRevenueData = async (date) => {
    setLoading(true);
    try {
      const data = await getRevenueByDate(date.format("DD-MM-YYYY"));
      setRevenueData(data.stats);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchRevenueData(selectedDate);
    }
  }, [selectedDate]);

  if (!revenueData?.currentStats || !revenueData?.percentageDifference)
    return null;

  const placeholderCards = [
    {
      title: "Doanh số",
      value: 0,
      previousValue: 0,
      growth: 0,
      unit: "VNĐ",
      color: "#FFCC00",
    },
    {
      title: "Lợi nhuận",
      value: 0,
      previousValue: 0,
      growth: 0,
      unit: "VNĐ",
      color: "#34C759",
    },
    {
      title: "Đã đặt",
      value: 0,
      previousValue: 0,
      growth: 0,
      unit: "đơn",
      color: "#FF9500",
    },
    {
      title: "Chi tiêu",
      value: 0,
      previousValue: 0,
      growth: 0,
      unit: "VNĐ",
      color: "#FF3B30",
    },
  ];

  // Cards to display (either placeholder or real data)
  let cards = placeholderCards;
  if (
    !loading &&
    revenueData?.currentStats &&
    revenueData?.percentageDifference
  ) {
    const current = revenueData.currentStats;
    const change = revenueData.percentageDifference;
    cards = [
      {
        title: "Doanh số",
        value: current.totalRevenue,
        previousValue:
          current.totalRevenue / (1 + change.revenueChangePercentage / 100),
        growth: change.revenueChangePercentage,
        unit: "VNĐ",
        color: "#FFCC00",
      },
      {
        title: "Lợi nhuận",
        value: current.totalProfit,
        previousValue:
          current.totalProfit / (1 + change.profitChangePercentage / 100),
        growth: change.profitChangePercentage,
        unit: "VNĐ",
        color: "#34C759",
      },
      {
        title: "Đã đặt",
        value: current.totalOrders,
        previousValue:
          current.totalOrders / (1 + change.orderChangePercentage / 100),
        growth: change.orderChangePercentage,
        unit: "đơn",
        color: "#FF9500",
      },
      {
        title: "Chi tiêu",
        value: current.totalCost,
        previousValue:
          current.totalCost / (1 + (change.costChangePercentage / 100 || 1)),
        growth: change.costChangePercentage,
        unit: "VNĐ",
        color: "#FF3B30",
      },
    ];
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((item, index) => (
        <RevenueCard key={index} {...item} />
      ))}
    </div>
  );
};

RevenueList.propTypes = {
  selectedDate: PropTypes.object.isRequired,
};

export default RevenueList;
