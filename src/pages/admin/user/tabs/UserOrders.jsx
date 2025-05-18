import { Table, Tag, Spin, Tooltip } from "antd";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import OrderDetail from "../../order/listOrder/orderDetail/OrderDetail";
import { formattedPrice } from "../../../../components/calcSoldPrice/CalcPrice";

const UserOrders = ({ orders, loading }) => {
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); // Add pagination state

  useEffect(() => {
    // Reset pagination to the first page when orders change
    setPagination({ current: 1, pageSize: 5 });
  }, [orders]);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null); // Clear selected order
    setIsModalVisible(false); // Close modal
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const orderColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize, // Adjust index based on pagination
      width: 50,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      render: (orderID) => (
        <Tooltip placement="topLeft" title={orderID}>
          {orderID}
        </Tooltip>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formattedDate(createdAt), // Format date like ListOrder
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => {
        const format = formattedPrice(totalAmount); // Sử dụng hàm formattedPrice để định dạng
        return <span>{format}</span>; // Trả về giá đã định dạng
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "Pending"
            ? "gold"
            : status === "Delivered"
            ? "green"
            : status === "Shipped"
            ? "blue"
            : "red";
        let statusText =
          status === "Pending"
            ? "Đang chờ duyệt"
            : status === "Shipped"
            ? "Đang giao hàng"
            : status === "Delivered"
            ? "Đã giao thành công"
            : "Đã hủy";

        return <Tag color={color}>{statusText}</Tag>; // Format status like ListOrder
      },
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Đang tải đơn hàng...">
        <Table
          dataSource={orders || []} // Ensure dataSource is always an array
          columns={orderColumns}
          rowKey="orderID"
          pagination={{
            pageSize: pagination.pageSize,
            current: pagination.current,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize }); // Update pagination state
            },
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record), // Open modal on row click
          })}
        />
      </Spin>
      {selectedOrder && (
        <OrderDetail
          visible={isModalVisible}
          onClose={handleCloseModal} // Reset modal data on close
          order={selectedOrder}
          customerName={selectedOrder.customerName || "Không xác định"}
          customerPhone={selectedOrder.phone || "Không xác định"}
          customerID={selectedOrder.userID}
          orderDetails={selectedOrder.orderDetails || []}
          refreshOrders={() => {}} // No refresh needed for this context
        />
      )}
    </>
  );
};

UserOrders.propTypes = {
  orders: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UserOrders;
