import React from "react";
import OrderList from "./orderCard/OrderList";
import SuccessOrdersChart from "./successOrders/SuccessOrdersChart";

const Order = () => {
  return (
    <div>
      <OrderList></OrderList>
      <SuccessOrdersChart></SuccessOrdersChart>
    </div>
  );
};

export default Order;
