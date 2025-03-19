import { useEffect, useRef, useState } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { Button, ConfigProvider, Input, Space, Table, Tag } from "antd";
import Highlighter from "react-highlight-words";
import { createStyles } from "antd-style";
import OrderDetail from "./orderDetail/OrderDetail";
import FilterButton from "../../../../components/filter/FilterButton";
import { getAllOrders, getUserInfo } from "../../../../api/api";
import { render } from "react-dom";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table-container {
        ${antCls}-table-body,
        ${antCls}-table-content {
          scrollbar-width: thin;
          scrollbar-color: #eaeaea transparent;
          scrollbar-gutter: stable;
        }
      }
    `,
  };
});

const fetchOrders = async () => {
  try {
    const orders = await getAllOrders();

    // Lấy thông tin người dùng (số điện thoại) cho từng đơn hàng
    const ordersWithPhone = await Promise.all(
      orders.map(async (order) => {
        const userInfo = await fetchUserInfo(order.userID);
        return {
          ...order,
          phone: userInfo?.phone || "Không có số điện thoại", // Thêm số điện thoại vào đơn hàng
        };
      })
    );

    return ordersWithPhone;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

const fetchUserInfo = async (userID) => {
  try {
    const response = await getUserInfo(userID);
    return response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null; // Return null in case of error
  }
};

const ListOrder = () => {
  const [visibleColumns, setVisibleColumns] = useState({
    orderID: true,
    userID: true,
    phone: true,
    totalAmount: true,
    address: true,
    status: true,
    createdAt: true,
    paymentMethod: true,
    actions: true,
  });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);
  const { styles } = useStyle();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleCancelFilters = () => {
    setSearchText("");
    setSearchedColumn("");
    setFilteredInfo({});
    setSortedInfo({});
    setVisibleColumns({
      orderID: true,
      userID: true,
      phone: true,
      totalAmount: true,
      address: true,
      status: true,
      createdAt: true,
      paymentMethod: true,
      actions: true,
    });
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleColumnVisibilityChange = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const refreshOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const getColumnSearchProps = (dataIndex, sortable = false) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Xóa
          </Button>
          <Button type="link" size="small" onClick={close}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    sorter: sortable
      ? (a, b) =>
          a[dataIndex].toString().localeCompare(b[dataIndex].toString(), "vi")
      : undefined,
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      width: 100,
    },
    {
      title: "Mã khách hàng",
      dataIndex: "userID",
      key: "userID",
      width: 200,
      ...getColumnSearchProps("userID", true),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Giá tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      ...getColumnSearchProps("totalAmount", true),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 120,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      ...getColumnSearchProps("status", true),
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

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      ...getColumnSearchProps("createdAt", true),
      render: (createdAt) => formattedDate(createdAt), // Sử dụng hàm formattedDate để định dạng
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
      ...getColumnSearchProps("paymentMethod", true),
      render: (paymentMethod) => {
        let paymentText =
          paymentMethod === "COD" || paymentMethod === "CASH"
            ? "Thanh toán khi nhận hàng"
            : "Chuyển khoản";
        return <Tag>{paymentText}</Tag>;
      },
    },
    {
      title: "Tác vụ",
      key: "actions",
      width: 120,
      fixed: "right",
      render: () => (
        <div>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "#1e8736", // Darker green for download button
                  defaultHoverColor: "white",
                  defaultHoverBorderColor: "none",
                },
              },
            }}
          >
            <Button
              type="default"
              size="small"
              shape="default"
              icon={<DownloadOutlined />}
              className="mr-1 text-white bg-[#27A743] border-none"
            />
          </ConfigProvider>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "#d9363e", // Darker red for delete button
                  defaultHoverColor: "white",
                  defaultHoverBorderColor: "none",
                },
              },
            }}
          >
            <Button
              type="default"
              size="small"
              shape="default"
              className="bg-deleteColor text-white border-none"
              icon={<DeleteFilled />}
            />
          </ConfigProvider>
        </div>
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (column) => visibleColumns[column.key]
  );

  return (
    <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-4 flex justify-between">
        <span>Danh sách đơn hàng</span>
        <Space>
          <Button onClick={handleCancelFilters}>Hủy lọc</Button>
          <FilterButton
            columnsVisibility={visibleColumns}
            handleColumnVisibilityChange={handleColumnVisibilityChange}
            columnNames={columns}
            title="Ẩn"
            typeFilter="column"
          />
        </Space>
      </div>
      <Table
        bordered
        className={styles.customTable + " hover:cursor-pointer"}
        size="small"
        columns={filteredColumns}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        onChange={(pagination, filters, sorter) => {
          setFilteredInfo(filters);
          setSortedInfo(sorter);
        }}
        onRow={(record) => ({
          onClick: () => showOrderDetail(record),
        })}
        filteredInfo={filteredInfo}
        sortedInfo={sortedInfo}
      />
      <OrderDetail
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        order={selectedOrder}
        userName={selectedOrder?.userID}
        orderDetails={selectedOrder?.orderDetails}
        refreshOrders={refreshOrders}
      />
    </div>
  );
};

export default ListOrder;
