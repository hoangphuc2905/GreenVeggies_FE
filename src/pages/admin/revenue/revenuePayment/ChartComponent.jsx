import { useState } from "react";
import { DatePicker, Select, Spin, Table, Button } from "antd";
import { Bar, Line } from "react-chartjs-2";
import moment from "moment";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [chartType, setChartType] = useState("bar");

  // Dữ liệu mẫu
  const paymentData = [
    { method: "Tiền mặt", revenue: 5000000 },
    { method: "ZaloPay", revenue: 7000000 },
    { method: "Bank", revenue: 9000000 },
    { method: "Momo", revenue: 8000000 },
  ];

  const data = {
    labels: paymentData.map((item) => item.method),
    datasets: [
      {
        data: paymentData.map((item) => item.revenue),
        backgroundColor: ["#1890ff", "#f5222d", "#faad14", "#52c41a"],
        borderColor: chartType === "line" ? "#000" : "transparent",
        borderWidth: chartType === "line" ? 1 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Doanh thu theo phương thức thanh toán" },
    },
  };

  const handleDateChange = (date) => {
    setLoading(true);
    setSelectedDate(date);
    setTimeout(() => setLoading(false), 800);
  };

  const handleChartTypeChange = (value) => {
    setLoading(true);
    setChartType(value);
    setTimeout(() => setLoading(false), 800);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(paymentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");
    XLSX.writeFile(wb, `Doanh_thu_${selectedDate.format("DD-MM-YYYY")} .xlsx`);
  };

  const columns = [
    { title: "Phương thức thanh toán", dataIndex: "method", key: "method" },
    { title: "Doanh thu (VND)", dataIndex: "revenue", key: "revenue" },
  ];

  return (
    <div className="w-full h-full bg-white mt-4 p-4 rounded-lg shadow-md">
      <div className="font-semibold text-base mb-2 text-gray-700">
        Tình trạng doanh thu ngày {selectedDate.format("DD/MM/YYYY")}
      </div>
      <div className="flex justify-between items-center my-4 gap-2">
        <div className="flex gap-2">
          <DatePicker
            defaultValue={dayjs()}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            disabledDate={(current) =>
              current && current > moment().endOf("day")
            }
          />
          <Select value={chartType} onChange={handleChartTypeChange}>
            <Select.Option value="bar">Biểu đồ cột</Select.Option>
            <Select.Option value="line">Biểu đồ đường</Select.Option>
            <Select.Option value="table">Bảng</Select.Option>
          </Select>
          <Button type="primary" onClick={exportToExcel}>
            Xuất Excel
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center">
        {loading ? (
          <Spin />
        ) : chartType === "bar" ? (
          <Bar data={data} options={options} />
        ) : chartType === "line" ? (
          <Line data={data} options={options} />
        ) : (
          <Table
            size="small"
            columns={columns}
            dataSource={paymentData}
            pagination={false}
            rowKey="method"
          />
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
