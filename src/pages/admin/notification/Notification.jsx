import { Button, Divider, List, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import tiếng Việt
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  readNotify,
} from "../../../services/NotifyService";
import { getOrderById } from "../../../services/OrderService";
import { getUserInfo } from "../../../services/UserService";
import OrderDetail from "../order/listOrder/orderDetail/OrderDetail";

dayjs.extend(relativeTime);
dayjs.locale("vi"); // Đặt ngôn ngữ mặc định là tiếng Việt

const fetchUserInfo = async (userID) => {
  try {
    const response = await getUserInfo(userID);
    return response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null; // Return null in case of error
  }
};

const Notification = ({ userID }) => {
  const [notifies, setNotifies] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For popup
  const [modalVisible, setModalVisible] = useState(false); // For popup visibility
  const [customer, setCustomer] = useState(null); // Customer info for popup

  useEffect(() => {
    if (userID) {
      fetchNotifications(userID, 1, (data) => {
        setNotifies(data.slice(0, 5)); // Lấy 5 thông báo mới nhất
      });
    }
  }, [userID]);

  const handleNotificationClick = async (notification) => {
    try {
      await readNotify(notification._id);

      // Update local state to mark this notification as read
      const updatedNotifies = notifies.map((n) =>
        n._id === notification._id ? { ...n, isRead: true } : n
      );
      setNotifies(updatedNotifies);

      // Fetch order details if applicable
      const orderID = notification.orderID;
      if (orderID) {
        const order = await getOrderById(orderID);
        setSelectedOrder(order);
        setModalVisible(true);
      } else {
        message.info("Thông báo không chứa thông tin đơn hàng.");
      }
    } catch (error) {
      message.error("Không thể xử lý thông báo!");
    }
  };

  const getUserInfoById = async (userID) => {
    try {
      const response = await fetchUserInfo(userID);
      console.log("User info:", response);
      return setCustomer(response);
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null; // Return null in case of error
    }
  };
  useEffect(() => {
    if (selectedOrder) {
      getUserInfoById(selectedOrder?.userID);
    }
  }, [selectedOrder]);

  return (
    <div className="w-[300px] h-[400px] overflow-auto">
      <List
        itemLayout="horizontal"
        dataSource={notifies}
        renderItem={(item) => {
          const isUnread = item.isRead === false || item.isRead === "false";

          return (
            <List.Item
              style={{
                position: "relative",
                paddingRight: "24px",
                cursor: "pointer",
              }}
              onClick={() => handleNotificationClick(item)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = isUnread
                  ? "#fff"
                  : "transparent")
              }
            >
              {/* Bóng đỏ nếu chưa đọc */}
              {isUnread && (
                <span className="absolute top-4 right-3 w-3 h-3 bg-red-500 rounded-full" />
              )}

              <List.Item.Meta
                title={
                  <strong
                    style={{
                      color: isUnread ? "#000000" : "#888888", // Chữ đậm hơn nếu chưa đọc
                    }}
                  >
                    {item.title}
                  </strong>
                }
                description={
                  <div
                    style={{
                      color: isUnread ? "#000000" : "#888888", // Chữ lợt hơn nếu đã đọc
                    }}
                  >
                    <div>{item.message}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {dayjs(item.createdAt).fromNow()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <Divider plain />
      <div className="text-center">
        <Button
          type="link"
          onClick={() => (window.location.href = "/admin/notifications")}
        >
          Xem thêm
        </Button>
      </div>

      {/* Popup for order details */}
      <OrderDetail
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
        customerName={customer?.username}
        customerPhone={customer?.phone}
        customerID={customer?.userID}
        orderDetails={selectedOrder?.orderDetails}
      />
    </div>
  );
};

export default Notification;
