import OrderList from "./orderCard/OrderList";
import SuccessOrdersChart from "./successOrders/SuccessOrdersChart";
import ListOrder from "./listOrder/ListOrder";

const Order = () => {
  return (
    <div>
      <OrderList></OrderList>
      <SuccessOrdersChart></SuccessOrdersChart>
      <ListOrder></ListOrder>
    </div>
  );
};

export default Order;
