import { useEffect, useState } from "react";
import { Select, Spin, Table, Button } from "antd";
import { Bar, Line } from "react-chartjs-2";
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
import { getPaymentStatusByDate } from "../../../../services/StatisticService";

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

const ChartComponent = ({ selectedDate }) => {
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [paymentData, setPaymentData] = useState([]);

  // Fetch payment data based on selectedDate
  const fetchPaymentData = async (date) => {
    setLoading(true);
    try {
      const response = await getPaymentStatusByDate(date.format("DD-MM-YYYY"));
      if (response && response.stats) {
        const data = Object.entries(response.stats).map(
          ([method, revenue]) => ({
            method,
            revenue,
          })
        );
        setPaymentData(data);
      } else {
        setPaymentData([]);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setPaymentData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      fetchPaymentData(selectedDate);
    }
  }, [selectedDate]);

  // Chart data configuration
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

  // Handle chart type change
  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  // Export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(paymentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");
    XLSX.writeFile(wb, `Doanh_thu_${selectedDate.format("DD-MM-YYYY")}.xlsx`);
  };

  // Table columns configuration
  const columns = [
    { title: "Phương thức thanh toán", dataIndex: "method", key: "method" },
    { title: "Doanh thu (VND)", dataIndex: "revenue", key: "revenue" },
  ];

  // Placeholder data for loading state
  const placeholderData = {
    labels: ["BANK", "CASH"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#1890ff", "#f5222d"],
        borderColor: chartType === "line" ? "#000" : "transparent",
        borderWidth: chartType === "line" ? 1 : 0,
      },
    ],
  };

  return (
    <div className="w-full h-full bg-white mt-4 p-4 rounded-lg shadow-md">
      <div className="font-semibold text-base mb-2 text-gray-700">
        Tình trạng doanh thu ngày {selectedDate.format("DD/MM/YYYY")}
      </div>
      <div className="flex justify-between items-center my-4 gap-2">
        <div className="flex gap-2">
          <Select value={chartType} onChange={handleChartTypeChange}>
            <Select.Option value="bar">Biểu đồ cột</Select.Option>
            <Select.Option value="line">Biểu đồ đường</Select.Option>
            <Select.Option value="table">Bảng</Select.Option>
          </Select>
          <Button type="primary" onClick={exportToExcel} disabled={loading}>
            Xuất Excel
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center">
        {loading ? (
          chartType === "bar" ? (
            <Bar data={placeholderData} options={options} />
          ) : chartType === "line" ? (
            <Line data={placeholderData} options={options} />
          ) : (
            <Table
              size="small"
              columns={columns}
              dataSource={[
                { method: "BANK", revenue: 0 },
                { method: "CASH", revenue: 0 },
              ]}
              pagination={false}
              rowKey="method"
            />
          )
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
