import { useState } from "react";
import { DatePicker, Space } from "antd";
import moment from "moment";
import OrderList from "./orderCard/OrderList";
import SuccessOrdersChart from "./successOrders/SuccessOrdersChart";
import ListOrder from "./listOrder/ListOrder";
import dayjs from "dayjs";

const Order = () => {
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
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-3">
          <SuccessOrdersChart />
        </div>
        <div className="col-span-1">
          <OrderList selectedDate={selectedDate} />
        </div>
      </div>
      <ListOrder />
    </div>
  );
};

export default Order;
