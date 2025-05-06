import React, { useEffect, useState } from "react";
import { List, Button, Spin, Modal, message } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import tiếng Việt
import {
  fetchNotifications,
  readNotify,
} from "../../../services/NotifyService";
import { getOrderById } from "../../../services/OrderService";
import OrderDetail from "../order/listOrder/orderDetail/OrderDetail";
import { getUserInfo } from "../../../services/UserService";

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
const NotificationScreen = ({ userID }) => {
  const [notifies, setNotifies] = useState([]);
  const [filteredNotifies, setFilteredNotifies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [showAll, setShowAll] = useState(false); // Toggle to show all notifications
  const [selectedOrder, setSelectedOrder] = useState(null); // For popup
  const [orderDetails, setOrderDetails] = useState(null); // Order details for popup
  const [modelVisible, setModalVisible] = useState(false); // For popup visibility
  const [customer, setCustomer] = useState(null); // Customer info for popup

  useEffect(() => {
    if (userID) {
      setLoading(true);
      fetchNotifications(userID, 1, (data) => {
        setNotifies(data);
        setFilteredNotifies(data);
        setLoading(false);
      });
    }
  }, [userID]);

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

  const handleFilterChange = (type) => {
    setFilter(type);
    if (type === "all") {
      setFilteredNotifies(notifies);
    } else if (type === "unread") {
      setFilteredNotifies(notifies.filter((item) => !item.isRead));
    } else if (type === "read") {
      setFilteredNotifies(notifies.filter((item) => item.isRead));
    }
  };
  const handleNotificationClick = async (notification) => {
    try {
      await readNotify(notification._id);

      // Update local state to mark this notification as read
      const updatedNotifies = notifies.map((n) =>
        n._id === notification._id ? { ...n, isRead: true } : n
      );
      setNotifies(updatedNotifies);

      // Áp dụng lại filter nếu có
      if (filter === "unread") {
        setFilteredNotifies(updatedNotifies.filter((item) => !item.isRead));
      } else if (filter === "read") {
        setFilteredNotifies(updatedNotifies.filter((item) => item.isRead));
      } else {
        setFilteredNotifies(updatedNotifies);
      }

      // Lấy chi tiết đơn hàng nếu có
      const orderID = notification.orderID;
      if (orderID) {
        const order = await getOrderById(orderID);
        setOrderDetails(order);
        setSelectedOrder(order);
        setModalVisible(true);
        console.log("Order details:", selectedOrder);
      } else {
        message.info("Thông báo không chứa thông tin đơn hàng.");
      }
    } catch (error) {
      message.error("Không thể xử lý thông báo!");
    }
  };

  const refreshNotifications = () => {
    fetchNotifications(userID, 1, (data) => {
      setNotifies(data);
      setFilteredNotifies(data);
    });
  };

  const displayedNotifies = showAll
    ? filteredNotifies
    : filteredNotifies.slice(0, 5);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Danh sách thông báo</h2>
      <div className="flex gap-4 mb-4">
        <Button
          type={filter === "all" ? "primary" : "default"}
          onClick={() => handleFilterChange("all")}
        >
          Tất cả
        </Button>
        <Button
          type={filter === "unread" ? "primary" : "default"}
          onClick={() => handleFilterChange("unread")}
        >
          Chưa xem
        </Button>
        <Button
          type={filter === "read" ? "primary" : "default"}
          onClick={() => handleFilterChange("read")}
        >
          Đã xem
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={displayedNotifies}
            renderItem={(item) => {
              const isUnread = item.isRead === false || item.isRead === "false";

              return (
                <List.Item
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    paddingLeft: "16px",
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
                  {/* Circular red dot for unread notifications */}
                  {isUnread && (
                    <span
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "10px",
                        height: "10px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                      }}
                    ></span>
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
          {filteredNotifies.length > 5 && (
            <div className="text-center mt-4">
              <Button type="link" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Thu gọn" : "Xem thêm"}
              </Button>
            </div>
          )}
        </>
      )}
      {/* Popup for order details */}

      <OrderDetail
        visible={modelVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
        customerName={customer?.username}
        customerPhone={customer?.phone}
        customerID={customer?.userID}
        orderDetails={selectedOrder?.orderDetails}
        refreshOrders={() => {
          refreshNotifications();
        }}
      />
    </div>
  );
};

export default NotificationScreen;
