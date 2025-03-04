import { useState } from "react";
import { Select } from "antd";
import { Line } from "@ant-design/plots";

const RevenueTrendChart = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  // Dữ liệu mẫu theo từng tháng trong năm
  const data = {
    2023: [
      {
        month: "Tháng 1",
        ZaloPay: 9000000,
        Cash: 11000000,
        Bank: 7000000,
        MoMo: 8500000,
      },
      {
        month: "Tháng 2",
        ZaloPay: 8500000,
        Cash: 10500000,
        Bank: 6500000,
        MoMo: 8000000,
      },
      {
        month: "Tháng 3",
        ZaloPay: 9500000,
        Cash: 12000000,
        Bank: 8000000,
        MoMo: 9500000,
      },
      {
        month: "Tháng 4",
        ZaloPay: 8700000,
        Cash: 11000000,
        Bank: 7000000,
        MoMo: 8800000,
      },
      {
        month: "Tháng 5",
        ZaloPay: 11000000,
        Cash: 13000000,
        Bank: 9500000,
        MoMo: 10000000,
      },
      {
        month: "Tháng 6",
        ZaloPay: 9700000,
        Cash: 11500000,
        Bank: 8000000,
        MoMo: 9000000,
      },
      {
        month: "Tháng 7",
        ZaloPay: 12000000,
        Cash: 14000000,
        Bank: 10500000,
        MoMo: 11500000,
      },
      {
        month: "Tháng 8",
        ZaloPay: 10500000,
        Cash: 12500000,
        Bank: 9000000,
        MoMo: 10000000,
      },
      {
        month: "Tháng 9",
        ZaloPay: 11500000,
        Cash: 13500000,
        Bank: 10000000,
        MoMo: 11000000,
      },
      {
        month: "Tháng 10",
        ZaloPay: 13000000,
        Cash: 15000000,
        Bank: 11500000,
        MoMo: 12500000,
      },
      {
        month: "Tháng 11",
        ZaloPay: 14000000,
        Cash: 16000000,
        Bank: 12500000,
        MoMo: 13500000,
      },
      {
        month: "Tháng 12",
        ZaloPay: 15000000,
        Cash: 17000000,
        Bank: 13500000,
        MoMo: 14500000,
      },
    ],
    2024: [
      {
        month: "Tháng 1",
        ZaloPay: 10000000,
        Cash: 12000000,
        Bank: 8000000,
        MoMo: 9000000,
      },
      {
        month: "Tháng 2",
        ZaloPay: 9000000,
        Cash: 11000000,
        Bank: 7000000,
        MoMo: 8500000,
      },
      {
        month: "Tháng 3",
        ZaloPay: 11000000,
        Cash: 13000000,
        Bank: 9000000,
        MoMo: 10000000,
      },
      {
        month: "Tháng 4",
        ZaloPay: 9500000,
        Cash: 11500000,
        Bank: 7500000,
        MoMo: 9200000,
      },
      {
        month: "Tháng 5",
        ZaloPay: 12000000,
        Cash: 14000000,
        Bank: 10000000,
        MoMo: 11000000,
      },
      {
        month: "Tháng 6",
        ZaloPay: 10500000,
        Cash: 12500000,
        Bank: 8500000,
        MoMo: 9800000,
      },
      {
        month: "Tháng 7",
        ZaloPay: 13000000,
        Cash: 15000000,
        Bank: 11000000,
        MoMo: 12000000,
      },
      {
        month: "Tháng 8",
        ZaloPay: 11500000,
        Cash: 13500000,
        Bank: 9500000,
        MoMo: 10500000,
      },
      {
        month: "Tháng 9",
        ZaloPay: 12500000,
        Cash: 14500000,
        Bank: 10500000,
        MoMo: 11500000,
      },
      {
        month: "Tháng 10",
        ZaloPay: 14000000,
        Cash: 16000000,
        Bank: 12000000,
        MoMo: 13000000,
      },
      {
        month: "Tháng 11",
        ZaloPay: 15000000,
        Cash: 17000000,
        Bank: 13000000,
        MoMo: 14000000,
      },
      {
        month: "Tháng 12",
        ZaloPay: 16000000,
        Cash: 18000000,
        Bank: 14000000,
        MoMo: 15000000,
      },
    ],
    2025: [
      {
        month: "Tháng 1",
        ZaloPay: 11000000,
        Cash: 13000000,
        Bank: 9000000,
        MoMo: 10000000,
      },
      {
        month: "Tháng 2",
        ZaloPay: 9500000,
        Cash: 11500000,
        Bank: 7500000,
        MoMo: 9200000,
      },
      {
        month: "Tháng 3",
        ZaloPay: 12000000,
        Cash: 14000000,
        Bank: 10000000,
        MoMo: 11000000,
      },
      {
        month: "Tháng 4",
        ZaloPay: 10000000,
        Cash: 12000000,
        Bank: 8000000,
        MoMo: 9500000,
      },
      {
        month: "Tháng 5",
        ZaloPay: 13000000,
        Cash: 15000000,
        Bank: 11000000,
        MoMo: 12000000,
      },
      {
        month: "Tháng 6",
        ZaloPay: 11500000,
        Cash: 13500000,
        Bank: 9500000,
        MoMo: 10500000,
      },
      {
        month: "Tháng 7",
        ZaloPay: 14000000,
        Cash: 16000000,
        Bank: 12000000,
        MoMo: 13000000,
      },
      {
        month: "Tháng 8",
        ZaloPay: 12500000,
        Cash: 14500000,
        Bank: 10500000,
        MoMo: 11500000,
      },
      {
        month: "Tháng 9",
        ZaloPay: 13500000,
        Cash: 15500000,
        Bank: 11500000,
        MoMo: 12500000,
      },
      {
        month: "Tháng 10",
        ZaloPay: 15000000,
        Cash: 17000000,
        Bank: 13000000,
        MoMo: 14000000,
      },
      {
        month: "Tháng 11",
        ZaloPay: 16000000,
        Cash: 18000000,
        Bank: 14000000,
        MoMo: 15000000,
      },
      {
        month: "Tháng 12",
        ZaloPay: 17000000,
        Cash: 19000000,
        Bank: 15000000,
        MoMo: 16000000,
      },
    ],
  };
  const formattedData = data[selectedYear].map((item) => ({
    ...item,
    TotalRevenue: item.ZaloPay + item.Cash + item.Bank + item.MoMo,
  }));

  const colorMap = {
    "Doanh thu": "#000000",
    ZaloPay: "#FF5733",
    "Tiền mặt": "#1E90FF",
    Bank: "#FFD700",
    MoMo: "#FF1493",
  };

  const config = {
    data: formattedData.flatMap((item) => [
      { month: item.month, type: "Doanh thu", value: item.TotalRevenue },
      { month: item.month, type: "ZaloPay", value: item.ZaloPay },
      { month: item.month, type: "Tiền mặt", value: item.Cash },
      { month: item.month, type: "Bank", value: item.Bank },
      { month: item.month, type: "MoMo", value: item.MoMo },
    ]),
    xField: "month",
    yField: "value",
    seriesField: "type",
    colorField: "type",
    color: ({ type }) =>
      colorMap[type] ?? [
        "#000000",
        "#FF5733",
        "#1E90FF",
        "#FFD700",
        "#32CD32",
        "#FF1493",
      ], // Màu sắc tương ứng
    height: 400,
    legend: { position: "top" },
    xAxis: { label: { rotate: -30 } },
  };

  return (
    <div className="bg-white p-4 mt-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          Doanh thu biến động theo tháng: năm {selectedYear}
        </h2>
        <Select value={selectedYear} onChange={setSelectedYear}>
          <Select.Option value="2023">2023</Select.Option>
          <Select.Option value="2024">2024</Select.Option>
          <Select.Option value="2025">2025</Select.Option>
        </Select>
      </div>
      <Line {...config} />
    </div>
  );
};

export default RevenueTrendChart;
