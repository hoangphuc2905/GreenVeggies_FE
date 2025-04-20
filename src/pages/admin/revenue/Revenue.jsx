import { useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import moment from "moment";

import RevenueList from "./revenueCard/RevenueList";
import DemoColumnChart from "./revenuePayment/ChartComponent";
import AnnualRevenueStats from "./annualRevenueStats/AnnualRevenueStats";

const Revenue = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date, dateString) => {
    if (dateString) {
      setSelectedDate(date);
    }
  };

  return (
    <div>
      <Space direction="vertical" size="middle" className="mb-4">
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="DD-MM-YYYY"
          disabledDate={(current) => current && current > moment().endOf("day")}
        />
      </Space>
      <RevenueList selectedDate={selectedDate} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemoColumnChart selectedDate={selectedDate} />
        <AnnualRevenueStats />
      </div>
    </div>
  );
};

export default Revenue;
