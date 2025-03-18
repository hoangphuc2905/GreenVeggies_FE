import { useRef, useState } from "react";
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
  const [visibleColumns, setVisibleColumns] = useState({
    orderId: true,
    customerId: true,
    phone: true,
    price: true,
    address: true,
    status: true,
    time: true,
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
      orderId: true,
      customerId: true,
      phone: true,
      price: true,
      address: true,
      status: true,
      time: true,
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
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      width: 150,
      ...getColumnSearchProps("customerId", true),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      width: 120,
      ...getColumnSearchProps("price", true),
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
          status === "Đang chờ duyệt"
            ? "gold"
            : status === "Đã duyệt"
            ? "green"
            : status === "Đã giao"
            ? "blue"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      width: 200,
      ...getColumnSearchProps("time", true),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
      ...getColumnSearchProps("paymentMethod", true),
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

  const data = [
    {
      key: "1",
      index: 1,
      orderId: "001",
      customerId: "001",
      phone: "033319121",
      price: "120000 đ",
      address: "Gò Vấp",
      status: "Đang chờ duyệt",
      time: "2025-01-25 08:09:23",
      paymentMethod: "Credit Card",
      orderDetails: [
        { item: "Rau cải", quantity: 2, price: "20000 đ" },
        { item: "Cà chua", quantity: 1, price: "10000 đ" },
      ],
    },
    {
      key: "2",
      index: 2,
      orderId: "002",
      customerId: "002",
      phone: "093654214",
      price: "150000 đ",
      address: "Quận 9",
      status: "Đã giao",
      time: "2025-01-25 10:10:31",
      paymentMethod: "Cash",
      orderDetails: [
        { item: "Rau muống", quantity: 3, price: "30000 đ" },
        { item: "Bí đỏ", quantity: 2, price: "40000 đ" },
      ],
    },
    {
      key: "3",
      index: 3,
      orderId: "003",
      customerId: "003",
      phone: "037978941",
      price: "90000 đ",
      address: "Gò Vấp",
      status: "Đã duyệt",
      time: "2025-01-24 07:30:50",
      paymentMethod: "Credit Card",
      orderDetails: [
        { item: "Rau cải", quantity: 1, price: "10000 đ" },
        { item: "Cà rốt", quantity: 2, price: "20000 đ" },
      ],
    },
    {
      key: "4",
      index: 4,
      orderId: "004",
      customerId: "003",
      phone: "0123456789",
      price: "180000 đ",
      address: "Bình Thạnh",
      status: "Đã hủy",
      time: "2025-01-23 15:19:59",
      paymentMethod: "Cash",
      orderDetails: [
        { item: "Rau cải", quantity: 4, price: "40000 đ" },
        { item: "Cà chua", quantity: 3, price: "30000 đ" },
      ],
    },
  ];

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
        dataSource={data}
        pagination={{ pageSize: 5 }}
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
      />
    </div>
  );
};

export default ListOrder;
