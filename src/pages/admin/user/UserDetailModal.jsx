import { Modal, Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getOrdersByUserId } from "../../../services/OrderService";
import UserTabs from "./tabs/UserTabs";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  const [orders, setOrders] = useState([]); // State to store user orders
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.userID) {
      fetchUserOrders(user.userID);
    }
  }, [user]);

  const fetchUserOrders = async (userID) => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrdersByUserId(userID);
      console.log("Fetched Orders: ", fetchedOrders.orders); // Log the fetched orders
      setOrders(
        Array.isArray(fetchedOrders.orders) ? fetchedOrders.orders : []
      ); // Ensure orders is an array
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setOrders([]); // Default to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thông tin người dùng"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      <UserTabs user={user} orders={orders} loading={loading} />
    </Modal>
  );
};

UserDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userID: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    dateOfBirth: PropTypes.string,
    role: PropTypes.string,
    accountStatus: PropTypes.string,
    avatar: PropTypes.string,
    address: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        street: PropTypes.string,
        ward: PropTypes.string,
        district: PropTypes.string,
        city: PropTypes.string,
        default: PropTypes.bool,
      })
    ),
  }),
};

export default UserDetailModal;
