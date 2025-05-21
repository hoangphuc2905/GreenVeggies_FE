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
  DatePicker,
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
import dayjs from "dayjs";
import * as XLSX from "xlsx";

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

  // State cho filter ngày ở cột "Thời gian"
  const [dateFilter, setDateFilter] = useState(null);

  // Thêm hàm reset toàn bộ bộ lọc, tìm kiếm, sắp xếp, phân trang về mặc định
  const handleResetAll = async () => {
    setSearchText("");
    setSearchedColumn("");
    setFilteredInfo({});
    setSortedInfo({});
    setVisibleColumns({
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
    setPagination({ current: 1, pageSize: 10 });
    setDateFilter(null);
    setSelectedRowKeys([]);
    setSelectedOrders([]);
    setLoading(true);
    const allOrders = await fetchOrders();
    setOrders(allOrders);
    setLoading(false);
  };

  // Hàm lấy danh sách đơn hàng theo trạng thái và ngày tháng năm
  // - Nếu không truyền trạng thái/ngày/tháng/năm sẽ lấy tất cả đơn hàng
  // - Nếu có truyền sẽ gọi API lấy theo bộ lọc
  const fetchOrders = async (status, day, month, year) => {
    console.log("Fetching orders with status:", status);
    // console.log("Fetching orders with date:", date);

    try {
      let orders;
      if (!status && !day && !month && !year) {
        // Lấy tất cả đơn hàng nếu không truyền trạng thái hoặc ngày
        orders = await getOrders();
      } else {
        // Lấy ngày, tháng, năm từ tham số truyền vào

        orders = await getListOrdersStatusByDate({ day, month, year, status });
        orders = orders.data || []; // Đảm bảo orders là một mảng
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

  // Hàm lấy thông tin user theo userID (dùng để lấy số điện thoại khách hàng)
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
    // Tự động tính số lượng phần tử trên mỗi trang dựa vào chiều cao màn hình
    // - Lắng nghe sự kiện resize để cập nhật lại pageSize
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

  // Hàm tự động cập nhật trạng thái đơn hàng sang "Đã giao thành công" nếu quá 3 ngày kể từ updatedAt
  const autoUpdateDeliveredStatus = async (orders) => {
    const now = dayjs();
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (
          order.status === "Shipped" &&
          order.updatedAt &&
          dayjs(order.updatedAt).isBefore(now.subtract(3, "day"))
        ) {
          try {
            await updateStatus(order.orderID, "Delivered");
            return { ...order, status: "Delivered" };
          } catch (err) {
            return order;
          }
        }
        return order;
      })
    );
    return updatedOrders;
  };

  useEffect(() => {
    // Hàm lấy dữ liệu danh sách đơn hàng, cập nhật trạng thái tự động, lấy nội dung thanh toán
    // - Gọi fetchOrders để lấy danh sách đơn hàng
    // - Gọi autoUpdateDeliveredStatus để cập nhật trạng thái nếu cần
    // - Lấy nội dung thanh toán cho các đơn chuyển khoản
    const fetchData = async () => {
      setLoading(true);
      let data = await fetchOrders(status, day, month, year);
      data = await autoUpdateDeliveredStatus(data); // Tự động cập nhật trạng thái nếu cần
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
                `Lỗi khi lấy nội dung thanh toán cho đơn hàng ${order.orderID}:`,
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
  }, [status, day, month, year]); // Thêm status và ngày vào dependencies

  // Hàm tìm kiếm theo cột trong bảng (search/filter)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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

  // Hàm tìm kiếm theo cột trong bảng (search/filter)
  const getColumnSearchProps = (dataIndex, sortable = false) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === "updatedAt" ? (
          // Nếu là cột thời gian thì dùng DatePicker
          <DatePicker
            format="DD/MM/YYYY"
            value={dateFilter}
            onChange={(date) => {
              setDateFilter(date);
              setSelectedKeys(date ? [date.format("YYYY-MM-DD")] : []);
            }}
            style={{ marginBottom: 8, display: "block", width: "100%" }}
            allowClear
            placeholder="Chọn ngày"
          />
        ) : (
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
        )}
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
            onClick={() => {
              if (dataIndex === "updatedAt") setDateFilter(null);
              clearFilters && handleReset(clearFilters);
            }}
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
      if (dataIndex === "updatedAt" && value) {
        // So sánh ngày (YYYY-MM-DD) với ngày trong updatedAt
        const recordDate = record.updatedAt
          ? dayjs(record.updatedAt).format("YYYY-MM-DD")
          : "";
        return recordDate === value;
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

  // Hàm filter dropdown cho các cột có nhiều lựa chọn (trạng thái, phương thức thanh toán)
  const getColumnDropdownProps = (dataIndex, options) => ({
    filters: options.map((option) => ({
      text: option.label, // Hiển thị nhãn tiếng Việt
      value: option.value, // Sử dụng giá trị tiếng Anh để lọc
    })),
    onFilter: (value, record) => record[dataIndex]?.toString() === value,
    render: (text) => {
      const matchedOption = options.find((option) => option.value === text);
      return <span>{matchedOption ? matchedOption.label : text}</span>; // Hiển thị nhãn nếu khớp
    },
  });

  // Gửi thông báo duyệt đơn hàng cho khách hàng
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

  // Gửi thông báo hủy đơn hàng cho khách hàng
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

  // Xử lý hủy đơn hàng từ bảng (cập nhật trạng thái, cập nhật số lượng sản phẩm, gửi notify)
  // - Gửi notify cho khách, cập nhật lại số lượng sản phẩm, cập nhật trạng thái đơn trên giao diện
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
        if (order.status === "Pending") {
          try {
            // Gửi thông báo hủy đơn hàng cho khách
            await sendCancelNotification(
              order.orderID,
              order.userID,
              finalReason
            );
            // Cập nhật trạng thái đơn hàng trên server
            await updateStatus(order.orderID, "Cancelled", {
              reason: finalReason,
            });

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

            // Cập nhật trạng thái đơn hàng trên giao diện (không cần reload toàn bộ)
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.orderID === order.orderID ? { ...o, status: "Cancelled" } : o
              )
            );

            Modal.success({
              content:
                "Đơn hàng đã được hủy thành công và số lượng sản phẩm đã được cập nhật.",
            });

            // Không cần gọi refreshOrders ở đây nữa vì đã cập nhật trực tiếp state
          } catch (error) {
            Modal.error({
              content: "Đã xảy ra lỗi khi hủy đơn hàng.",
            });
            console.error("Error cancelling order:", error);
          }
        } else {
          Modal.error({
            content: "Không thể hủy đơn hàng đã được duyệt hoặc giao hàng.",
          });
          return Promise.reject(); // Ngăn modal đóng
        }
      },
    });
  };

  // Kiểm tra tình trạng sản phẩm trong đơn hàng (còn bán hay đã ngưng bán)
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

  // Xử lý duyệt nhiều đơn hàng đã chọn (chỉ cho phép duyệt nếu sản phẩm còn bán)
  // - Nếu có đơn có sản phẩm ngưng bán hoặc không ở trạng thái chờ duyệt sẽ hỏi xác nhận bỏ qua các đơn đó
  const handleApproveSelectedOrders = async () => {
    try {
      const unavailableOrders = [];
      const invalidStatusOrders = [];
      const approvedOrders = [];

      // Kiểm tra trạng thái và sản phẩm ngưng bán trước khi hỏi xác nhận
      for (const orderID of selectedOrders) {
        const order = orders.find((o) => o.orderID === orderID);
        if (!order) continue;

        // Kiểm tra trạng thái đơn hàng
        if (!order.status || order.status !== "Pending") {
          invalidStatusOrders.push({
            orderID,
            status: order.status,
          });
          continue;
        }

        // Kiểm tra sản phẩm ngưng bán
        const { isAvailable, productName } = await checkProductAvailability(
          order.orderDetails
        );
        if (!isAvailable) {
          unavailableOrders.push({ orderID, productName });
          continue;
        }
      }

      // Nếu có đơn hàng không ở trạng thái chờ duyệt hoặc có sản phẩm ngưng bán, hỏi xác nhận
      if (invalidStatusOrders.length > 0 || unavailableOrders.length > 0) {
        Modal.confirm({
          title: "Một số đơn hàng không thể duyệt",
          content: (
            <div>
              {invalidStatusOrders.length > 0 && (
                <>
                  <p>
                    Các đơn hàng sau không ở trạng thái <b>Đang chờ duyệt</b>:
                  </p>
                  <ul>
                    {invalidStatusOrders.map((order) => (
                      <li key={order.orderID}>
                        Đơn hàng {order.orderID}: Trạng thái hiện tại{" "}
                        <b>
                          {order.status === "Shipped"
                            ? "Đang giao hàng"
                            : order.status === "Delivered"
                            ? "Đã giao thành công"
                            : order.status === "Cancelled"
                            ? "Đã hủy"
                            : order.status}
                        </b>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {unavailableOrders.length > 0 && (
                <>
                  <p>Các đơn hàng sau có sản phẩm ngưng bán:</p>
                  <ul>
                    {unavailableOrders.map((order) => (
                      <li key={order.orderID}>
                        Đơn hàng {order.orderID}: Sản phẩm `{order.productName}`
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p>
                Bạn có muốn bỏ qua các đơn này và tiếp tục duyệt các đơn còn lại
                không?
              </p>
            </div>
          ),
          okText: "Tiếp tục",
          cancelText: "Hủy",
          onOk: async () => {
            // Lọc ra các đơn hợp lệ để duyệt
            const validOrderIDs = selectedOrders.filter(
              (orderID) =>
                !invalidStatusOrders.some((u) => u.orderID === orderID) &&
                !unavailableOrders.some((u) => u.orderID === orderID)
            );
            if (validOrderIDs.length === 0) {
              Modal.info({
                content: "Không có đơn hàng nào hợp lệ để duyệt.",
              });
              setSelectedRowKeys([]);
              setSelectedOrders([]);
              return;
            }
            // Hỏi xác nhận duyệt các đơn hợp lệ
            Modal.confirm({
              title: `Bạn có chắc chắn muốn duyệt ${validOrderIDs.length} đơn hàng hợp lệ?`,
              okText: "Duyệt",
              cancelText: "Hủy",
              onOk: async () => {
                for (const orderID of validOrderIDs) {
                  const order = orders.find((o) => o.orderID === orderID);
                  if (!order) continue;
                  await updateStatus(orderID, "Shipped");
                  await handleSendNotification(orderID, order.userID);
                  approvedOrders.push(orderID);
                }
                Modal.success({
                  content: `Đã duyệt thành công ${approvedOrders.length} đơn hàng.`,
                });
                setSelectedRowKeys([]);
                setSelectedOrders([]);
                refreshOrders();
              },
            });
          },
        });
      } else {
        // Nếu không có đơn nào ngưng bán hoặc sai trạng thái, hỏi xác nhận duyệt tất cả
        Modal.confirm({
          title: `Bạn có chắc chắn muốn duyệt ${selectedOrders.length} đơn hàng đã chọn?`,
          okText: "Duyệt",
          cancelText: "Hủy",
          onOk: async () => {
            for (const orderID of selectedOrders) {
              const order = orders.find((o) => o.orderID === orderID);
              if (!order) continue;
              await updateStatus(orderID, "Shipped");
              await handleSendNotification(orderID, order.userID);
              approvedOrders.push(orderID);
            }
            Modal.success({
              content: `Đã duyệt thành công ${approvedOrders.length} đơn hàng.`,
            });
            setSelectedRowKeys([]);
            setSelectedOrders([]);
            refreshOrders();
          },
        });
      }
    } catch (error) {
      Modal.error({
        content: "Đã xảy ra lỗi khi duyệt các đơn hàng.",
      });
      console.error("Error approving selected orders:", error);
    }
  };

  const rowSelection = {
    selectedRowKeys, // Danh sách các dòng đã chọn (được kiểm soát)
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys); // Cập nhật danh sách dòng đã chọn
      setSelectedOrders(selectedRows.map((row) => row.orderID)); // Lưu các orderID đã chọn
    },
    getCheckboxProps: (record) => ({
      disabled: record.status !== "Pending", // Chỉ cho phép chọn các dòng có trạng thái "Pending"
      name: record.orderID,
    }),
  };

  // Cấu hình các cột cho bảng danh sách đơn hàng
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 50,
      // Không filter/sort nên không cần filteredValue/sortOrder
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      ellipsis: true,
      width: 220,
      fixed: "left",
      ...getColumnSearchProps("orderID", true),
      filteredValue: filteredInfo.orderID || null,
      sortOrder: sortedInfo.columnKey === "orderID" ? sortedInfo.order : null,
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
      width: 160,
      ...getColumnSearchProps("userID", true),
      fixed: "left",
      filteredValue: filteredInfo.userID || null,
      sortOrder: sortedInfo.columnKey === "userID" ? sortedInfo.order : null,
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
      width: 130,
      ellipsis: true,
      ...getColumnSearchProps("phone"),
      filteredValue: filteredInfo.phone || null,
      sortOrder: sortedInfo.columnKey === "phone" ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.totalAmount || null,
      sortOrder:
        sortedInfo.columnKey === "totalAmount" ? sortedInfo.order : null,
      sorter: (a, b) => {
        // Đảm bảo so sánh số, không phải chuỗi
        const aVal = Number(a.totalAmount) || 0;
        const bVal = Number(b.totalAmount) || 0;
        return aVal - bVal;
      },
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
      filteredValue: filteredInfo.address || null,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.status || null,
      sortOrder: sortedInfo.columnKey === "status" ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.updatedAt || null,
      sortOrder: sortedInfo.columnKey === "updatedAt" ? sortedInfo.order : null,
      render: (updatedAt) => formattedDate(updatedAt),
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
      filteredValue: filteredInfo.paymentMethod || null,
      sortOrder:
        sortedInfo.columnKey === "paymentMethod" ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.paymentContent || null,
      sortOrder:
        sortedInfo.columnKey === "paymentContent" ? sortedInfo.order : null,
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
      render: (text, record) =>
        record.status !== "Cancelled" && (
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

  // Hàm xuất Excel cho bảng hiện tại (không xuất cột STT và Tác vụ)
  const handleExportExcel = () => {
    // Lấy các cột đang hiển thị, loại bỏ 'key' (STT) và 'actions' (Tác vụ)
    const exportableColumns = columns.filter(
      (col) =>
        visibleColumns[col.key] && col.key !== "key" && col.key !== "actions"
    );

    // Tạo header cho file Excel
    const headers = exportableColumns.map((col) => col.title);

    // Lấy dữ liệu thực sự đang hiển thị trên bảng (sau khi lọc, tìm kiếm, sắp xếp, PHÂN TRANG)
    // => Lấy từ DOM bảng Ant Design (chỉ lấy các dòng đang render)
    const tableRows = document.querySelectorAll(".ant-table-tbody > tr");
    const displayedOrders = [];
    tableRows.forEach((row) => {
      const rowKey = row.getAttribute("data-row-key");
      if (rowKey) {
        const found = (orders || []).find((o) => o.orderID === rowKey);
        if (found) displayedOrders.push(found);
      }
    });

    // Nếu không lấy được từ DOM (SSR hoặc lỗi), fallback về phân trang hiện tại
    let dataToExport = displayedOrders;
    if (dataToExport.length === 0) {
      const startIdx = (pagination.current - 1) * pagination.pageSize;
      const endIdx = startIdx + pagination.pageSize;
      dataToExport = (orders || []).slice(startIdx, endIdx);
    }

    const data = dataToExport.map((order) =>
      exportableColumns.map((col) => {
        if (col.key === "paymentContent") {
          const content = paymentContents[order.orderID];
          return content || "Không áp dụng";
        }
        if (col.key === "updatedAt") {
          return formattedDate(order.updatedAt);
        }
        if (col.render) {
          if (col.dataIndex) {
            return order[col.dataIndex];
          }
        }
        return order[col.dataIndex] ?? order[col.key];
      })
    );

    // Tạo worksheet và workbook
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DANH SÁCH HÓA ĐƠN");
    const today = dayjs().format("DD-MM-YYYY");
    XLSX.writeFile(wb, `DanhSachHoaDon_ngay${today}.xlsx`);
  };

  // Render giao diện danh sách đơn hàng, filter, bảng, modal chi tiết
  // - Có nút duyệt nhiều đơn, nút hủy lọc, filter ẩn/hiện cột
  // - Bảng hiển thị danh sách đơn hàng với các cột đã cấu hình
  // - Khi click vào dòng sẽ mở modal chi tiết đơn hàng
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-4 flex justify-between">
        <span style={{ color: "#22c55e" }}>Danh sách hóa đơn</span>
        <Space>
          {/* Nút xuất Excel */}
          <Button
            onClick={handleExportExcel}
            type="primary"
            className="bg-blue-500 text-white"
          >
            Xuất Excel
          </Button>
          {/* Nút Reset toàn bộ lọc */}
          <Button onClick={handleResetAll} type="default">
            Reset
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              onClick={handleApproveSelectedOrders}
              className="bg-green-500 text-white"
            >
              Duyệt {selectedRowKeys.length} đơn đã chọn
            </Button>
          )}
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
          dataSource={orders || []} // Đảm bảo dataSource luôn là một mảng
          rowSelection={{
            ...rowSelection, // Sử dụng logic rowSelection đã cập nhật
          }}
          rowKey="orderID" // Sử dụng orderID làm key duy nhất cho mỗi dòng
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
            setFilteredInfo(filters);
            setSortedInfo(sorter);
            setPagination({
              current: pagination.current,
              pageSize: pagination.pageSize,
            }); // Cập nhật trạng thái phân trang
          }}
          onRow={(record) => ({
            onClick: () => showOrderDetail(record), // Hiển thị chi tiết đơn hàng khi click vào dòng
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
