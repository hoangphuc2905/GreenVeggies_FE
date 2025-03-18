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
import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";

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

const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"];
const chartTypes = { Line, Bar };

const SuccessOrdersChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("Tháng 1");
  const [chartType, setChartType] = useState("Line");

  const successOrdersData = {
    labels: [
      "17/01",
      "18/01",
      "19/01",
      "20/01",
      "21/01",
      "22/01",
      "23/01",
      "24/01",
      "25/01",
      "26/01",
    ],
    datasets: [
      {
        label: "Số lượng đơn hàng thành công",
        data: [55, 60, 58, 62, 57, 59, 61, 56, 60, 59],
        borderColor: "#34C759",
        backgroundColor: "rgba(52, 199, 89, 0.6)",
        pointBackgroundColor: "#34C759",
        pointBorderColor: "#fff",
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  };

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
      y: { beginAtZero: true, ticks: { stepSize: 10, font: { size: 12 } } },
    },
  };

  const ChartComponent = chartTypes[chartType];

  return (
    <div className="bg-white mt-6 p-4 rounded-lg shadow-md w-full max-w-full">
      <h2 className="font-semibold text-lg mb-4">
        Thống kê đơn hàng
      </h2>
      <div className="flex justify-between items-center mb-3">
        <select
          className="border p-1 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
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
        <ChartComponent data={successOrdersData} options={options} />
      </div>
    </div>
  );
};

export default SuccessOrdersChart;
