import OrderList from "./orderCard/OrderList";
import SuccessOrdersChart from "./successOrders/SuccessOrdersChart";
import ListOrder from "./listOrder/ListOrder";

const Order = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-3">
          <SuccessOrdersChart></SuccessOrdersChart>
        </div>
        <div className="col-span-1">
          <OrderList></OrderList>
        </div>
      </div>

      <ListOrder></ListOrder>
    </div>
  );
};

export default Order;
