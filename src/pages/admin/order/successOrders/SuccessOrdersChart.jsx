import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { getMonthlyOrderStats } from "../../../../services/StatisticService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = { Line, Bar };

const months = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const SuccessOrdersChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartType, setChartType] = useState("Line");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMonthlyOrderStats(selectedMonth, selectedYear);
        console.log("Tháng:", selectedMonth);
        console.log("Năm:", selectedYear);
        // Kiểm tra xem dữ liệu có hợp lệ không
        console.log("Thống kê đơn hàng:", data);
        if (data?.stats && Array.isArray(data.stats)) {
          const labels = data.stats.map(
            (item) =>
              `${item.day.toString().padStart(2, "0")}/${selectedMonth
                .toString()
                .padStart(2, "0")}`
          );
          const values = data.stats.map((item) => item.totalOrders);

          // Check if all values are zero
          const hasData = values.some((value) => value > 0);

          setChartData(
            hasData
              ? {
                  labels,
                  datasets: [
                    {
                      label: "Số lượng đơn hàng thành công",
                      data: values,
                      borderColor: "#34C759", // Line color
                      backgroundColor: "rgba(52, 199, 89, 0.6)", // Fill color
                      pointBackgroundColor: "#34C759",
                      pointBorderColor: "#fff",
                      pointRadius: 4,
                      borderWidth: 2,
                    },
                  ],
                }
              : null
          );
        } else {
          console.error("API response is invalid or empty:", data);
          setChartData(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê đơn hàng:", error);
        setChartData(null);
      }
    };

    fetchStats();
  }, [selectedMonth, selectedYear]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => ` ${tooltipItem.raw} đơn`,
        },
      },
    },
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } } },
    },
  };

  const ChartComponent = chartTypes[chartType];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full w-full max-w-full">
      <h2 className="font-semibold text-lg mb-4">Thống kê đơn hàng</h2>
      <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
        <div className="flex gap-2">
          <select
            className="border p-1 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {`Tháng ${index + 1}`}
              </option>
            ))}
          </select>
          <select
            className="border p-1 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <select
          className="border p-1 rounded"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="Line">Biểu đồ đường</option>
          <option value="Bar">Biểu đồ cột</option>
        </select>
      </div>
      <div className="h-64">
        {chartData ? (
          <ChartComponent data={chartData} options={options} />
        ) : (
          <p>
            {chartData === null
              ? "Không có dữ liệu để hiển thị."
              : "Đang tải dữ liệu..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default SuccessOrdersChart;
