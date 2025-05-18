import { Tabs } from "antd";
import PropTypes from "prop-types";
import UserDetails from "./UserDetails";
import UserOrders from "./UserOrders";

const UserTabs = ({ user, orders, loading }) => {
  const tabItems = [
    {
      key: "1",
      label: "Thông tin người dùng",
      children: <UserDetails user={user} />,
    },
    {
      key: "2",
      label: "Danh sách đơn hàng",
      children: <UserOrders orders={orders} loading={loading} />,
    },
  ];

  return <Tabs items={tabItems} />;
};

UserTabs.propTypes = {
  user: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UserTabs;
