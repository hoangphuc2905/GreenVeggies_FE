import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  Spin,
  Modal,
  Select,
} from "antd";
import Highlighter from "react-highlight-words";
import { createStyles } from "antd-style";
import OrderDetail from "./orderDetail/OrderDetail";
import FilterButton from "../../../../components/filter/FilterButton";
import { getPaymentByOrderId } from "../../../../services/PaymentService";
import { formattedPrice } from "../../../../components/calcSoldPrice/CalcPrice";
import { createNotify } from "../../../../services/NotifyService";
import { getUserInfo } from "../../../../services/UserService";
import { getOrders, updateStatus } from "../../../../services/OrderService";
import {
  getProductById,
  updateProductQuantity,
} from "../../../../services/ProductService";
import { useLocation } from "react-router-dom";
import { getListOrdersStatusByDate } from "../../../../services/StatisticService";

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

const ListOrder = () => {
  const location = useLocation();
  const { status, day, month, year } = location.state || {}; // Retrieve state parameters

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    key: true,
    orderID: true,
    userID: true,
    phone: true,
    totalAmount: true,
    address: true,
    status: true,
    updatedAt: true,
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
  const [paymentContents, setPaymentContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrders = async (status, day, month, year) => {
    console.log("Fetching orders with status:", status);
    // console.log("Fetching orders with date:", date);

    try {
      let orders;
      if (!status && !day && !month && !year) {
        // Fetch all orders if no status or date is provided
        orders = await getOrders();
      } else {
        // Extract day, month, and year from the date

        orders = await getListOrdersStatusByDate({ day, month, year, status });
        orders = orders.data || []; // Ensure orders is an array
        console.log("Fetched orders:", orders);
      }

      const ordersWithPhone = await Promise.all(
        orders.map(async (order) => {
          const userInfo = await fetchUserInfo(order.userID);
          return {
            ...order,
            phone: userInfo?.phone || "Không có số điện thoại",
          };
        })
      );

      return ordersWithPhone;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  const fetchUserInfo = async (userID) => {
    try {
      const response = await getUserInfo(userID);
      return response;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  useEffect(() => {
    const calculatePageSize = () => {
      const screenHeight = window.innerHeight;
      if (screenHeight > 1200) return 20;
      if (screenHeight > 800) return 10;
      return 8;
    };
    const updatePageSize = () => {
      setPagination((prev) => ({
        ...prev,
        pageSize: calculatePageSize(),
      }));
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchOrders(status, day, month, year); // Pass status and date to fetchOrders
      setOrders(data);
      const paymentData = await Promise.all(
        data
          .filter(
            (order) => order.paymentMethod?.toLowerCase() === "bank" || "string"
          )
          .map(async (order) => {
            try {
              const paymentDetails = await getPaymentByOrderId(order.orderID);
              return {
                orderID: order.orderID,
                content: paymentDetails?.content || "Không có nội dung",
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
      const paymentContentMap = paymentData.reduce((acc, item) => {
        acc[item.orderID] = item.content;
        return acc;
      }, {});
      setPaymentContents(paymentContentMap);
      setLoading(false);
    };
    fetchData();
  }, [status, day, month, year]); // Add status and date as dependencies

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
      updatedAt: true,
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
      return null;
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
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

  const getColumnDropdownProps = (dataIndex, options) => ({
    filters: options.map((option) => ({
      text: option.label, // Display Vietnamese label
      value: option.value, // Use English value for filtering
    })),
    onFilter: (value, record) => record[dataIndex]?.toString() === value,
    render: (text) => {
      const matchedOption = options.find((option) => option.value === text);
      return <span>{matchedOption ? matchedOption.label : text}</span>; // Display label if matched
    },
  });

  const handleSendNotification = async (orderID, customerID) => {
    try {
      const formData = {
        senderType: "admin",
        senderUserID: localStorage.getItem("userID"),
        receiverID: customerID,
        title: "Thông báo đơn hàng",
        message: `Đơn hàng ${orderID} đã được duyệt.`,
        type: "order",
        orderID: orderID,
      };
      const response = await createNotify(formData);
      if (response) {
        console.log("Thông báo đã được gửi thành công:", response);
      }
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
    }
  };

  const sendCancelNotification = async (orderID, customerID, reason) => {
    try {
      const formData = {
        senderType: "admin",
        senderUserID: localStorage.getItem("userID"),
        receiverID: customerID,
        title: "Thông báo hủy đơn hàng",
        message: `Đơn hàng ${orderID} của bạn đã bị hủy. Lý do: ${reason}`,
        type: "order",
        orderID: orderID,
      };
      const response = await createNotify(formData);
      if (response) {
        console.log("Thông báo hủy đơn hàng đã được gửi thành công:", response);
      }
    } catch (error) {
      console.error("Lỗi khi gửi thông báo hủy đơn hàng:", error);
    }
  };

  const handleCancelOrder = async (order) => {
    let selectedReason = "";
    let enteredReason = "";

    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: (
        <div>
          <p>Vui lòng chọn hoặc nhập lý do hủy đơn hàng:</p>
          <Select
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Chọn lý do hủy (không bắt buộc)"
            onChange={(value) => {
              selectedReason = value;
            }}
          >
            {[
              "Khách hàng yêu cầu hủy",
              "Hết hàng",
              "Thông tin giao hàng không chính xác",
              "Lý do khác",
            ].map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Hoặc nhập lý do hủy"
            onChange={(e) => {
              enteredReason = e.target.value;
            }}
          />
        </div>
      ),
      okText: "Hủy đơn",
      cancelText: "Đóng",
      onOk: async () => {
        const finalReason = [selectedReason, enteredReason]
          .filter(Boolean) // Loại bỏ giá trị null hoặc undefined
          .join("; "); // Kết hợp cả hai lý do bằng dấu chấm phẩy

        if (!finalReason) {
          Modal.error({
            content: "Vui lòng chọn hoặc nhập lý do hủy đơn hàng.",
          });
          return Promise.reject(); // Ngăn modal đóng
        }

        try {
          // Gửi thông báo hủy đơn hàng
          await sendCancelNotification(
            order.orderID,
            order.userID,
            finalReason
          );

          // Cập nhật lại số lượng sản phẩm
          if (order.orderDetails) {
            await Promise.all(
              order.orderDetails.map(async (item) => {
                const product = await getProductById(item.productID);
                const updatedQuantity = product.quantity + item.quantity;

                await updateProductQuantity(item.productID, {
                  ...product,
                  quantity: updatedQuantity,
                  sold: product.sold - item.quantity,
                });
              })
            );
          }

          await updateStatus(order.orderID, "Cancelled", {
            reason: finalReason,
          });

          Modal.success({
            content:
              "Đơn hàng đã được hủy thành công và số lượng sản phẩm đã được cập nhật.",
          });

          // Làm mới danh sách đơn hàng
          refreshOrders();
        } catch (error) {
          Modal.error({
            content: "Đã xảy ra lỗi khi hủy đơn hàng.",
          });
          console.error("Error cancelling order:", error);
        }
      },
    });
  };

  const checkProductAvailability = async (orderDetails) => {
    try {
      for (const item of orderDetails) {
        const product = await getProductById(item.productID);
        if (!product || product.status === "unavailable") {
          return {
            isAvailable: false,
            productName: product?.name || "Không xác định",
          };
        }
      }
      return { isAvailable: true };
    } catch (error) {
      console.error("Error checking product availability:", error);
      return { isAvailable: false, productName: "Không xác định" };
    }
  };

  const handleApproveSelectedOrders = async () => {
    try {
      const unavailableOrders = [];
      const approvedOrders = [];

      for (const orderID of selectedOrders) {
        const order = orders.find((o) => o.orderID === orderID);
        if (!order) continue;

        const { isAvailable, productName } = await checkProductAvailability(
          order.orderDetails
        );
        if (!isAvailable) {
          unavailableOrders.push({ orderID, productName });
          continue;
        }

        // Approve the order
        await updateStatus(orderID, "Shipped");
        await handleSendNotification(orderID, order.userID);
        approvedOrders.push(orderID);
      }

      if (unavailableOrders.length > 0) {
        Modal.confirm({
          title: "Một số sản phẩm đã ngưng bán",
          content: (
            <div>
              <p>Các đơn hàng sau có sản phẩm ngưng bán:</p>
              <ul>
                {unavailableOrders.map((order) => (
                  <li key={order.orderID}>
                    Đơn hàng {order.orderID}: Sản phẩm `{order.productName}`
                  </li>
                ))}
              </ul>
              <p>
                Bạn có muốn bỏ qua các đơn này và tiếp tục duyệt các đơn khác
                không?
              </p>
            </div>
          ),
          okText: "Tiếp tục",
          cancelText: "Hủy",
          onOk: async () => {
            Modal.success({
              content: `Đã duyệt thành công ${approvedOrders.length} đơn hàng.`,
            });
            setSelectedRowKeys([]);
            setSelectedOrders([]);
            refreshOrders();
          },
        });
      } else {
        Modal.success({
          content: `Đã duyệt thành công ${approvedOrders.length} đơn hàng.`,
        });
        setSelectedRowKeys([]);
        setSelectedOrders([]);
        refreshOrders();
      }
    } catch (error) {
      Modal.error({
        content: "Đã xảy ra lỗi khi duyệt các đơn hàng.",
      });
      console.error("Error approving selected orders:", error);
    }
  };

  const rowSelection = {
    selectedRowKeys, // Controlled selected row keys
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys); // Update selected row keys
      setSelectedOrders(selectedRows.map((row) => row.orderID)); // Store selected order IDs
    },
    getCheckboxProps: (record) => ({
      disabled: record.status !== "Pending", // Allow selection only for "Pending" rows
      name: record.orderID,
    }),
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 50,
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      ellipsis: true,
      fixed: "left",
      ...getColumnSearchProps("orderID", true),
      render: (orderID) => (
        <Tooltip placement="topLeft" title={orderID}>
          {orderID}
        </Tooltip>
      ),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "userID",
      key: "userID",
      ellipsis: true,
      ...getColumnSearchProps("userID", true),
      fixed: "left",
      render: (userID) => (
        <Tooltip placement="topLeft" title={userID}>
          {userID}
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true,
      ...getColumnSearchProps("phone"),
      render: (phone) => (
        <Tooltip placement="topLeft" title={phone}>
          {phone}
        </Tooltip>
      ),
    },
    {
      title: "Giá tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ellipsis: true,
      ...getColumnSearchProps("totalAmount", true),
      render: (totalAmount) => {
        const format = formattedPrice(totalAmount);
        return <span>{format}</span>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
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
      ellipsis: true,
      ...getColumnDropdownProps("status", [
        { value: "Pending", label: "Đang chờ duyệt" },
        { value: "Shipped", label: "Đang giao hàng" },
        { value: "Delivered", label: "Đã giao thành công" },
        { value: "Cancelled", label: "Đã hủy" },
      ]),
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
      dataIndex: "updatedAt",
      key: "updatedAt",
      ellipsis: true,
      ...getColumnSearchProps("updatedAt", true),
      renderWELL: (updatedAt) => formattedDate(updatedAt),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      ellipsis: true,
      ...getColumnDropdownProps("paymentMethod", [
        { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
        { value: "CASH", label: "Thanh toán tiền mặt" },
        { value: "BANK", label: "Chuyển khoản" },
      ]),
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
      width: 180,
      ellipsis: true,
      ...getColumnSearchProps("paymentContent"),
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
      ellipsis: true,
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Button
          type="default"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            handleCancelOrder(record, cancelReason);
            setCancelReason("");
          }}
        >
          Hủy đơn
        </Button>
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
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              onClick={handleApproveSelectedOrders}
              className="bg-green-500 text-white"
            >
              Duyệt {selectedRowKeys.length} đơn đã chọn
            </Button>
          )}
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
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          className={styles.customTable + " hover:cursor-pointer"}
          size="small"
          dataSource={orders || []} // Ensure dataSource is always an array
          rowSelection={{
            ...rowSelection, // Use the updated rowSelection logic
          }}
          rowKey="orderID" // Use orderID as the unique key for rows
          pagination={{
            ...pagination,
            showSizeChanger: true, // Hiển thị bộ chọn số lượng phần tử trên mỗi trang
            pageSizeOptions: ["5", "10", "20", "50"], // Các tùy chọn số lượng phần tử
            onShowSizeChange: (current, size) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: size, // Cập nhật số lượng phần tử trên mỗi trang
              }));
            },
          }}
          onChange={(pagination, filters, sorter) => {
            setPagination({
              current: pagination.current,
              pageSize: pagination.pageSize,
            }); // Update pagination state
            setFilteredInfo(filters || {}); // Ensure filters are handled properly
            setSortedInfo(sorter || {}); // Ensure sorter is handled properly
          }}
          onRow={(record) => ({
            onClick: () => showOrderDetail(record), // Show order details on row click
          })}
          columns={filteredColumns}
          scroll={{ x: filteredColumns.length * 150 }}
          filteredInfo={filteredInfo}
          sortedInfo={sortedInfo}
        />
      </Spin>
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
