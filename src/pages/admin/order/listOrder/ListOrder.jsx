import { useEffect, useRef, useState } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";
import { createStyles } from "antd-style";
import OrderDetail from "./orderDetail/OrderDetail";
import FilterButton from "../../../../components/filter/FilterButton";
import { getAllOrders, getUserInfo } from "../../../../api/api";
import { getPaymentByOrderId } from "../../../../services/PaymentService";
import { render } from "react-dom";
import { formattedPrice } from "../../../../components/calcSoldPrice/CalcPrice";
import { AlignCenter } from "lucide-react";

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

    // Sắp xếp đơn hàng: Ưu tiên trạng thái "Pending", sau đó theo thời gian đặt (trễ nhất -> sớm nhất)
    ordersWithPhone.sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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
    key: true,
    orderID: true,
    userID: true,
    phone: true,
    totalAmount: true,
    address: true,
    status: true,
    createdAt: true,
    paymentMethod: true,
    paymentContent: true,
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
  const [customer, setCustomer] = useState("");
  const [paymentContents, setPaymentContents] = useState({}); // Store payment content by order ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);

      // Fetch payment content for orders with "Chuyển khoản"
      const paymentData = await Promise.all(
        data
          .filter(
            (order) =>
              (order.paymentMethod &&
                order.paymentMethod.toLowerCase() === "bank") ||
              "string" // Normalize to lowercase
          )
          .map(async (order) => {
            try {
              const paymentDetails = await getPaymentByOrderId(order.orderID);
              return {
                orderID: order.orderID,
                content:
                  paymentDetails?.payment?.content || "Không có nội dung",
              };
            } catch (error) {
              console.error(
                `Error fetching payment content for order ${order.orderID}:`,
                error
              );
              return { orderID: order.orderID, content: "Không có nội dung" };
            }
          })
      );

      // Map payment content to order IDs
      const paymentContentMap = paymentData.reduce((acc, item) => {
        acc[item.orderID] = item.content;
        return acc;
      }, {});
      setPaymentContents(paymentContentMap);

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
      paymentContent: true,
      actions: true,
    });
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const getUserInfoById = async (userID) => {
    try {
      const response = await fetchUserInfo(userID);
      return setCustomer(response || "Không có tên");
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null; // Return null in case of error
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      getUserInfoById(selectedOrder.userID);
    }
  }, [selectedOrder]);

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
    onFilter: (value, record) => {
      if (dataIndex === "paymentContent") {
        const content = paymentContents[record.orderID];
        return content?.toLowerCase().includes(value.toLowerCase());
      }
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    sorter: sortable
      ? (a, b) =>
          a[dataIndex]?.toString().localeCompare(b[dataIndex]?.toString(), "vi")
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
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      ellipsis: true, // Hiển thị chữ dạng ... nếu nội dung quá dài
      fixed: "left",
      ...getColumnSearchProps("orderID", true),
      render: (orderID) => {
        return (
          <Tooltip placement="topLeft" title={orderID}>
            {orderID}
          </Tooltip>
        );
      },
    },
    {
      title: "Mã khách hàng",
      dataIndex: "userID",
      key: "userID",
      ellipsis: true, // Hiển thị chữ dạng ...
      ...getColumnSearchProps("userID", true),
      fixed: "left",
      render: (userID) => {
        return (
          <Tooltip placement="topLeft" title={userID}>
            {userID}
          </Tooltip>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true, // Hiển thị chữ dạng ...
      ...getColumnSearchProps("phone"),
      render: (phone) => {
        return (
          <Tooltip placement="topLeft" title={phone}>
            {phone}
          </Tooltip>
        );
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ellipsis: true, // Hiển thị chữ dạng ...
      ...getColumnSearchProps("totalAmount", true),
      render: (totalAmount) => {
        const format = formattedPrice(totalAmount); // Sử dụng hàm formattedPrice để định dạng
        return <span>{format}</span>; // Trả về giá đã định dạng
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true, // Hiển thị chữ dạng ...
      ...getColumnSearchProps("address"),
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      ellipsis: true, // Hiển thị chữ dạng ...
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
      ellipsis: true, // Hiển thị chữ dạng ...
      ...getColumnSearchProps("createdAt", true),
      render: (createdAt) => formattedDate(createdAt), // Sử dụng hàm formattedDate để định dạng
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      ellipsis: true, // Hiển thị chữ dạng ...
      ...getColumnSearchProps("paymentMethod", true),
      render: (paymentMethod) => {
        let paymentText =
          paymentMethod === "COD" || paymentMethod === "CASH"
            ? "Thanh toán khi nhận hàng"
            : "Chuyển khoản";

        let color =
          paymentMethod === "COD" || paymentMethod === "CASH"
            ? "green"
            : "blue";

        return (
          <Tag color={color} className="text-white">
            {paymentText}
          </Tag>
        );
      },
    },
    {
      title: "Nội dung thanh toán",
      dataIndex: "orderID",
      key: "paymentContent",
      ellipsis: true,
      ...getColumnSearchProps("paymentContent"), // Enable search for payment content
      render: (orderID) => {
        const content = paymentContents[orderID];
        return content ? (
          <Tooltip placement="topLeft" title={content}>
            {content}
          </Tooltip>
        ) : (
          "Không áp dụng"
        );
      },
    },
    {
      title: "Tác vụ",
      key: "actions",
      ellipsis: true, // Hiển thị chữ dạng ...
      fixed: "right",
      width: 80,

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
          {/* <ConfigProvider
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
          </ConfigProvider> */}
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
        className={styles.customTable + " hover:cursor-pointer"}
        size="small"
        columns={filteredColumns}
        dataSource={orders}
        pagination={{ pageSize: 10 }}
        // tableLayout="auto"
        scroll={{ x: filteredColumns.length * 150 }}
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
        customerName={customer?.username}
        customerPhone={customer?.phone}
        customerID={selectedOrder?.userID}
        orderDetails={selectedOrder?.orderDetails}
        refreshOrders={refreshOrders}
      />
    </div>
  );
};

export default ListOrder;
