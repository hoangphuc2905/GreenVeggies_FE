import { useState, useEffect } from "react";
import { Button, Select, Spin, Table, ConfigProvider, Typography } from "antd";
import { Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import moment from "moment";
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
import { getYearlyRevenue } from "../../../../services/StatisticService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntdTitle } = Typography;

const RevenueTrendChart = () => {
  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY")); // Mặc định là năm hiện tại (2025)
  const [chartType, setChartType] = useState("line");
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchYearlyRevenue = async (year) => {
    setLoading(true);
    try {
      const response = await getYearlyRevenue(year);
      if (
        response &&
        response.stats &&
        typeof response.totalRevenue === "number"
      ) {
        setRevenueData(response);
      } else {
        setRevenueData(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thống kê doanh thu:", error);
      setRevenueData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyRevenue(selectedYear);
  }, [selectedYear]);

  const chartData = {
    labels: revenueData?.stats?.map((item) => `Tháng ${item.month}`) || [],
    datasets: [
      {
        label: "Tổng doanh thu",
        data: revenueData?.stats?.map((item) => item.revenue || 0) || [],
        borderColor: "#1890ff", // Updated line color to blue
        backgroundColor: "rgba(24, 144, 255, 0.2)", // Updated fill color to light blue
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
    if (!revenueData?.stats) return;
    const ws = XLSX.utils.json_to_sheet(
      revenueData.stats.map((item) => ({
        month: item.month,
        revenue: item.revenue || 0,
      }))
    );
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
      render: (month) => `Tháng ${month}`,
    },
    {
      title: "Doanh thu (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => (a.revenue || 0) - (b.revenue || 0),
      render: (value) => (value || 0).toLocaleString("vi-VN"),
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
          <div className="mt-2">
            {loading ? (
              <Spin />
            ) : revenueData && revenueData.totalRevenue !== null ? (
              <AntdTitle
                level={4}
                className="text-sm font-semibold"
                style={{ color: "#34C759" }}
              >
                Tổng: {revenueData.totalRevenue.toLocaleString("vi-VN")} VNĐ
              </AntdTitle>
            ) : (
              <AntdTitle level={3} style={{ color: "#FF3B30" }}>
                Không có dữ liệu
              </AntdTitle>
            )}
          </div>
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
            <Button
              type="primary"
              onClick={exportToExcel}
              disabled={!revenueData?.stats}
            >
              Xuất Excel
            </Button>
          </div>
        </div>
        <div className="w-full flex-1 overflow-hidden">
          {loading ? (
            <Spin size="small" />
          ) : revenueData?.stats ? (
            chartType === "line" ? (
              <Line data={chartData} options={options} size="small" />
            ) : (
              <Table
                columns={columns}
                dataSource={revenueData.stats}
                pagination={false}
                rowKey="month"
                scroll={{ x: "max-content", y: 350 }}
                size="small"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              />
            )
          ) : (
            <p>Không có dữ liệu để hiển thị</p>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RevenueTrendChart;
