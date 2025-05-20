import { useEffect, useState } from "react";
import { Button, Divider, List, message } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import tiếng Việt
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  fetchNotifications,
  readNotify,
} from "../../../services/NotifyService";
// import { getOrderById } from "../../../services/OrderService";
// import OrderDetail from "../order/listOrder/orderDetail/OrderDetail";

dayjs.extend(relativeTime);
dayjs.locale("vi"); // Đặt ngôn ngữ mặc định là tiếng Việt

const Notification = ({ userID, onNotificationRead }) => {
  const [notifies, setNotifies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadNotifications = async (pageNum) => {
    if (!userID || loading) return;

    setLoading(true);
    try {
      await fetchNotifications(userID, pageNum, (data) => {
        if (data.length > 0) {
          if (pageNum === 1) {
            setNotifies(data);
          } else {
            setNotifies((prev) => [...prev, ...data]);
          }
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      });
    } catch {
      message.error("Không thể tải thông báo!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(1);
  }, [userID]);

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      if (!notification.isRead) {
        await readNotify(notification._id);

        // Update local state to mark this notification as read
        const updatedNotifies = notifies.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        );
        setNotifies(updatedNotifies);

        // Notify parent component to update notification count
        if (onNotificationRead) {
          onNotificationRead();
        }
      }

      // Navigate to order details if the notification has an orderID
      if (notification.orderID) {
        navigate(`/user/order/${notification.orderID}`);
      } else {
        message.info("Thông báo không chứa thông tin đơn hàng.");
      }
    } catch {
      message.error("Không thể xử lý thông báo!");
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage);
    }
  };

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
              }>
              {/* Bóng đỏ nếu chưa đọc */}
              {isUnread && (
                <span className="absolute top-4 right-3 w-3 h-3 bg-red-500 rounded-full" />
              )}

              <List.Item.Meta
                title={
                  <strong
                    style={{
                      color: isUnread ? "#000000" : "#888888", // Chữ đậm hơn nếu chưa đọc
                    }}>
                    {item.title}
                  </strong>
                }
                description={
                  <div
                    style={{
                      color: isUnread ? "#000000" : "#888888", // Chữ lợt hơn nếu đã đọc
                    }}>
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
        {hasMore && (
          <Button type="link" onClick={handleLoadMore} loading={loading}>
            Xem thêm
          </Button>
        )}
      </div>

      {/* Popup for order details */}
      {/* <OrderDetail
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
        userName={selectedOrder?.userID}
        orderDetails={selectedOrder?.orderDetails}
      /> */}
    </div>
  );
};

Notification.propTypes = {
  userID: PropTypes.string.isRequired,
  onNotificationRead: PropTypes.func.isRequired,
};

export default Notification;
