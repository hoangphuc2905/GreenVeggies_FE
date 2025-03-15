import { useState } from "react";
import { Button, Select, Spin, Table, ConfigProvider } from "antd";
import { Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import data from "../../../../assets/objects/RevenueTrend.json";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueTrendChart = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(false);

  const selectedData = data[selectedYear];

  const chartData = {
    labels: selectedData.map((item) => item.month),
    datasets: [
      {
        label: "ZaloPay",
        data: selectedData.map((item) => item.ZaloPay),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
      },
      {
        label: "Tiền mặt",
        data: selectedData.map((item) => item.Cash),
        borderColor: "#1E90FF",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
      },
      {
        label: "Bank",
        data: selectedData.map((item) => item.Bank),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
      },
      {
        label: "MoMo",
        data: selectedData.map((item) => item.MoMo),
        borderColor: "#FF1493",
        backgroundColor: "rgba(255, 20, 147, 0.2)",
      },
      {
        label: "Tổng doanh thu",
        data: selectedData.map(
          (item) => item.ZaloPay + item.Cash + item.Bank + item.MoMo
        ),
        borderColor: "#000000",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Doanh thu biến động theo tháng: năm ${selectedYear}`,
      },
    },
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Doanh thu ${selectedYear}`);
    XLSX.writeFile(wb, `Doanh_thu_${selectedYear}.xlsx`);
  };

  const columns = [
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      sorter: (a, b) => a.month - b.month,
    },
    {
      title: "ZaloPay",
      dataIndex: "ZaloPay",
      key: "ZaloPay",
      sorter: (a, b) => a.ZaloPay - b.ZaloPay,
    },
    {
      title: "Tiền mặt",
      dataIndex: "Cash",
      key: "Cash",
      sorter: (a, b) => a.Cash - b.Cash,
    },
    {
      title: "Bank",
      dataIndex: "Bank",
      key: "Bank",
      sorter: (a, b) => a.Bank - b.Bank,
    },
    {
      title: "MoMo",
      dataIndex: "MoMo",
      key: "MoMo",
      sorter: (a, b) => a.MoMo - b.MoMo,
    },
    {
      title: "Tổng doanh thu",
      key: "total",
      render: (_, record) =>
        record.ZaloPay + record.Cash + record.Bank + record.MoMo,
      sorter: (a, b) =>
        a.ZaloPay +
        a.Cash +
        a.Bank +
        a.MoMo -
        (b.ZaloPay + b.Cash + b.Bank + b.MoMo),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#f0f0f0",
            bodyBg: "#ffffff",
            borderColor: "#d9d9d9",
            rowHoverBg: "#f5f5f5",
          },
        },
      }}
    >
      <div className="bg-white p-4 mt-4 rounded-lg shadow-md w-full max-w-full h-full flex flex-col">
        <div className="flex justify-between mb-4 flex-col">
          <h2 className="font-semibold text-base">
            Doanh thu biến động theo tháng: năm {selectedYear}
          </h2>
          <div className="flex gap-2 mt-4">
            <Select value={selectedYear} onChange={setSelectedYear}>
              <Select.Option value="2023">2023</Select.Option>
              <Select.Option value="2024">2024</Select.Option>
              <Select.Option value="2025">2025</Select.Option>
            </Select>
            <Select value={chartType} onChange={setChartType}>
              <Select.Option value="line">Biểu đồ đường</Select.Option>
              <Select.Option value="table">Bảng</Select.Option>
            </Select>
            <Button type="primary" onClick={exportToExcel}>
              Xuất Excel
            </Button>
          </div>
        </div>
        <div className="w-full flex-1 overflow-hidden">
          {loading ? (
            <Spin size="small" />
          ) : chartType === "line" ? (
            <Line data={chartData} options={options} size="small" />
          ) : (
            <Table
              columns={columns}
              dataSource={selectedData}
              pagination={false}
              rowKey="month"
              scroll={{ x: "max-content", y: 150 }}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RevenueTrendChart;
