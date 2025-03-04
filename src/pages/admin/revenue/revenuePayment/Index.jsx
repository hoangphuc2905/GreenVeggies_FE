import { useState } from "react";
import { DatePicker, Select, Spin } from "antd";
import { Column, Line } from "@ant-design/plots";
import moment from "moment";
import dayjs from "dayjs";

const ChartComponent = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [chartType, setChartType] = useState("column");

  // Dữ liệu mẫu
  const data = [
    { type: "Tiền mặt", value: 5000000 },
    { type: "ZaloPay", value: 7000000 },
    { type: "Bank", value: 9000000 },
    { type: "Momo", value: 8000000 },
  ];

  // Cấu hình chung cho biểu đồ
  const config = {
    data,
    xField: "type",
    yField: "value",
    label: {
      position: "top",
      style: { fill: "#FFFFFF", opacity: 0.8 },
    },
    height: 320,
    autoFit: true,
    ...(chartType === "column" && {
      colorField: "type",
      color: ["#1890ff", "#f5222d", "#faad14", "#52c41a"],
    }),
  };

  const handleDateChange = (date) => {
    setLoading(true);
    setSelectedDate(date); // Chấp nhận giá trị null khi xóa ngày
    setTimeout(() => setLoading(false), 800);
  };

  // Xử lý thay đổi loại biểu đồ
  const handleChartTypeChange = (value) => {
    setLoading(true);
    setChartType(value);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-full bg-white mt-6 p-4 rounded-lg shadow-md">

      <div className="font-semibold text-lg mb-2 text-gray-700">
        Tình trạng doanh thu ngày {selectedDate.format("DD/MM/YYYY")}
      </div>
      <div className="flex justify-end items-center mb-4 gap-2 absolute right-16">
        <div>
          <DatePicker
            defaultValue={dayjs()}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            disabledDate={(current) =>
              current && current > moment().endOf("day")
            }
          />
        </div>
        <div>
          <Select value={chartType} onChange={handleChartTypeChange}>
            <Select.Option value="column">Biểu đồ cột</Select.Option>
            <Select.Option value="line">Biểu đồ đường</Select.Option>
          </Select>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4"></div>

      {/* Hiển thị biểu đồ */}
      <div className="w-full overflow-x-auto flex justify-center">
        {loading ? (
          <Spin size="large" />
        ) : chartType === "column" ? (
          <Column {...config} />
        ) : (
          <Line {...config} />
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
