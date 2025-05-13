import { useState } from "react";
import { Select, Space } from "antd";
import moment from "moment";
import OrderList from "./orderCard/OrderList";
import SuccessOrdersChart from "./successOrders/SuccessOrdersChart";
import ListOrder from "./listOrder/ListOrder";
import dayjs from "dayjs";

const Order = () => {
  const currentDate = dayjs();
  const [selectedDay, setSelectedDay] = useState(currentDate.date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month() + 1); // Month is 0-indexed
  const [selectedYear, setSelectedYear] = useState(currentDate.year());

  const handleDayChange = (value) => setSelectedDay(value);
  const handleMonthChange = (value) => setSelectedMonth(value);
  const handleYearChange = (value) => setSelectedYear(value);

  return (
    <div>
      <Space direction="horizontal" size="middle" className="mb-4">
        <Select
          placeholder="Ngày"
          value={selectedDay}
          onChange={handleDayChange}
          style={{ width: 80 }}
          allowClear
          onClear={() => setSelectedDay(null)}
        >
          {[...Array(31).keys()].map((day) => (
            <Select.Option key={day + 1} value={day + 1}>
              {day + 1}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Tháng"
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{ width: 100 }}
          allowClear
          onClear={() => setSelectedMonth(null)}
        >
          {[...Array(12).keys()].map((month) => (
            <Select.Option key={month + 1} value={month + 1}>
              Tháng {month + 1}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Năm"
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: 100 }}
          allowClear
          onClear={() => setSelectedYear(null)}
        >
          {[...Array(10).keys()].map((offset) => {
            const year = dayjs().year() - offset;
            return (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            );
          })}
        </Select>
      </Space>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-3">
          <SuccessOrdersChart />
        </div>
        <div className="col-span-1">
          <OrderList
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      {/* <ListOrder /> */}
    </div>
  );
};

export default Order;
