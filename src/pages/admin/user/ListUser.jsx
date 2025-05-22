import {
  Button,
  Flex,
  Input,
  Layout,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { useEffect, useRef, useState } from "react";
import DefaultAVT from "../../../assets/pictures/default.png";

import {
  EyeInvisibleOutlined,
  EyeOutlined,
  ReloadOutlined, // Thêm icon mở khóa
  SearchOutlined,
} from "@ant-design/icons";
import UserDetailModal from "./UserDetailModal";
import { getListUsers, updateUserStatus } from "../../../services/UserService";
import { getOrdersByUserId } from "../../../services/OrderService"; // Import the function
import Highlighter from "react-highlight-words"; // Thêm thư viện highlight nếu chưa có

const { Search } = Input;

const getUsers = async () => {
  try {
    const response = await getListUsers();
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderCounts, setOrderCounts] = useState({}); // State to store order counts
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); // Add pagination state
  // State cho tìm kiếm và sắp xếp
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);
  const [lockHistory, setLockHistory] = useState([]); // [{userID, timestamp}]
  const [times, setTimes] = useState(0); // Số lần khóa tài khoản trong 1 phút

  /**
   * Lấy danh sách người dùng từ API.
   * Sắp xếp admin lên đầu, lưu vào state.
   * Đồng thời lấy số lượng đơn hàng cho từng user.
   */
  const fetchUsers = async () => {
    const apiUsers = await getListUsers();
    const sortedData = apiUsers.sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });

    // Lấy số lượng đơn hàng cho từng user
    const counts = {};
    for (const user of sortedData) {
      try {
        const { orders } = await getOrdersByUserId(user.userID);
        counts[user.userID] = orders.length;
      } catch (error) {
        counts[user.userID] = 0;
      }
    }
    setOrderCounts(counts);

    // Đặt users sau khi đã có orderCounts để Table luôn cập nhật lại
    setUsers([...sortedData]);
    setOriginalUsers([...sortedData]);
  };
  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Có lỗi xảy ra khi tải danh sách người dùng!");
      });
  }, []);

  /**
   * Hàm xử lý cập nhật trạng thái tài khoản người dùng.
   * Nếu thành công sẽ cập nhật lại danh sách users trong state.
   * @param {string} userID - ID người dùng cần cập nhật.
   * @param {string} status - Trạng thái mới ("Suspended" để khóa, "Active" để mở khóa).
   */
  const handleStatusUser = async (userID, status) => {
    try {
      const response = await updateUserStatus(userID, status);
      if (response) {
        // Cập nhật lại danh sách users sau khi thay đổi trạng thái
        const updatedUsers = users.map((user) =>
          user.userID === userID ? { ...user, accountStatus: status } : user
        );
        setUsers(updatedUsers);
        setOriginalUsers(updatedUsers);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái tài khoản!");
    }
  };

  const hasSelected = selectedRowKeys.length > 0;

  /**
   * Hiển thị modal chi tiết người dùng khi click vào dòng.
   */
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  /**
   * Hàm xử lý tìm kiếm theo cột cho bảng.
   * @param {string} dataIndex - Tên trường dữ liệu.
   * @param {boolean} sortable - Có cho phép sắp xếp không.
   */
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
          placeholder={`Tìm kiếm ${dataIndex}`}
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
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    sorter: sortable
      ? (a, b) =>
          a[dataIndex]?.toString().localeCompare(b[dataIndex]?.toString(), "vi")
      : undefined,
    sortDirections: ["ascend", "descend"],
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

  /**
   * Hàm xử lý khi nhấn nút "Tìm" trong filterDropdown của từng cột.
   * @param {Array} selectedKeys - Giá trị nhập vào ô tìm kiếm.
   * @param {Function} confirm - Hàm xác nhận filter.
   * @param {string} dataIndex - Tên trường dữ liệu của cột.
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  /**
   * Hàm reset bộ lọc/tìm kiếm cho filterDropdown.
   * @param {Function} clearFilters - Hàm xóa filter.
   */
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  /**
   * Đưa trang về trạng thái ban đầu: xóa filter, sắp xếp, phân trang, reload danh sách user.
   * Lưu ý: setUsers phải lấy đúng dữ liệu đã phân trang/filter/sort nếu muốn đồng bộ với Table.
   * Tuy nhiên, ở đây setUsers luôn là toàn bộ danh sách từ API (không bị filter ngoài bảng).
   */
  const handleResetAll = async () => {
    setSearchText("");
    setSearchedColumn("");
    setFilteredInfo({});
    setSortedInfo({});
    setPagination({ current: 1, pageSize: 5 });
    setSelectedRowKeys([]);
    setLoading(true);
    await fetchUsers();
    // setUsers(allUsers);
    setLoading(false);
  };

  /**
   * Kiểm tra rate limit: chỉ cho phép khóa 1 tài khoản tối đa 5 lần hoặc 5 tài khoản khác nhau trong 1 phút.
   * @param {string} userID
   * @returns {boolean} true nếu được phép khóa, false nếu vượt giới hạn
   */
  const canLockAccount = (userID) => {
    const now = Date.now();
    // Lọc các thao tác trong 1 phút gần nhất
    const recent = lockHistory.filter(
      (item) => now - item.timestamp < 60 * 1000
    );
    // Số lần khóa tài khoản này trong 1 phút
    const lockCountForUser = recent.filter(
      (item) => item.userID === userID
    ).length;
    // Số tài khoản khác nhau đã bị khóa trong 1 phút
    const uniqueUsers = new Set(recent.map((item) => item.userID));
    if (
      lockCountForUser >= 5 ||
      (uniqueUsers.size >= 5 && !uniqueUsers.has(userID))
    ) {
      return false;
    }
    return true;
  };

  /**
   * Ghi nhận thao tác khóa vào lịch sử
   * @param {string} userID
   */
  const recordLockAction = (userID) => {
    setLockHistory((prev) => [
      ...prev.filter((item) => Date.now() - item.timestamp < 60 * 1000),
      { userID, timestamp: Date.now() },
    ]);
    setTimes((prev) => prev + 1);
  };

  // Định nghĩa các cột cho bảng người dùng
  const columns = [
    {
      title: "#",
      key: "index",
      align: "center",
      // Tìm kiếm số thứ tự: so sánh với index thực tế trên trang hiện tại
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
            placeholder="Tìm số thứ tự"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              confirm();
              setSearchText(selectedKeys[0]);
              setSearchedColumn("index");
            }}
            style={{ marginBottom: 8, display: "block" }}
            type="number"
            min={1}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                setSearchText(selectedKeys[0]);
                setSearchedColumn("index");
              }}
              icon={<SearchOutlined />}
              size="small"
            >
              Tìm
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setSearchText("");
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
      onFilter: (value, record, index) => {
        // index là thứ tự dòng trên trang hiện tại
        const rowIndex =
          (pagination.current - 1) * pagination.pageSize + index + 1;
        return rowIndex === Number(value);
      },
      render: (_, __, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
      filteredValue: filteredInfo.index || null,
      sortOrder: sortedInfo.columnKey === "index" ? sortedInfo.order : null,
    },
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
      align: "center",
      ...getColumnSearchProps("username", true),
      filteredValue: filteredInfo.username || null,
      sortOrder: sortedInfo.columnKey === "username" ? sortedInfo.order : null,
    },
    {
      title: "Hình đại diện",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (avatar) => (
        <div className="flex justify-center items-center">
          <img
            src={avatar || DefaultAVT}
            alt="avatar"
            className="rounded-full w-12 h-12 object-cover radius-full"
          />
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Người dùng", value: "user" },
      ],
      filteredValue: filteredInfo.role || null,
      sortOrder: sortedInfo.columnKey === "role" ? sortedInfo.order : null,
      onFilter: (value, record) =>
        record.role === value || (value === "user" && record.role === "user"),
      sorter: (a, b) => a.role.localeCompare(b.role, "vi"),
      render: (role) => {
        const roleVN = role === "admin" ? "Admin" : "Người dùng";
        return searchedColumn === "role" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={roleVN}
          />
        ) : (
          roleVN
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      ...getColumnSearchProps("email", true),
      filteredValue: filteredInfo.email || null,
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
    },
    {
      title: "Đơn hàng",
      dataIndex: "userID",
      key: "orders",
      align: "center",
      ...getColumnSearchProps("orders", true),
      filteredValue: filteredInfo.orders || null,
      sortOrder: sortedInfo.columnKey === "orders" ? sortedInfo.order : null,
      sorter: (a, b) =>
        (orderCounts[a.userID] || 0) - (orderCounts[b.userID] || 0),
      render: (userID) => orderCounts[userID] || "--|--",
    },
    {
      title: "Trạng thái",
      dataIndex: "accountStatus",
      key: "accountStatus",
      align: "center",
      filters: [
        { text: "Hoạt động", value: "Active" },
        { text: "Ngưng hoạt động", value: "Inactive" },
        { text: "Đã khóa", value: "Suspended" },
      ],
      filteredValue: filteredInfo.accountStatus || null,
      sortOrder:
        sortedInfo.columnKey === "accountStatus" ? sortedInfo.order : null,
      onFilter: (value, record) => record.accountStatus === value,
      sorter: (a, b) =>
        (a.accountStatus || "").localeCompare(b.accountStatus || "", "vi"),
      render: (accountStatus) => {
        let color = "green";
        let statusVN = "Hoạt động";
        if (accountStatus === "Inactive") {
          color = "yellow";
          statusVN = "Ngưng hoạt động";
        }
        if (accountStatus === "Suspended") {
          color = "volcano";
          statusVN = "Đã khóa";
        }
        return <Tag color={color}>{statusVN}</Tag>;
      },
    },
    {
      title: "Tác vụ",
      key: "action",
      align: "center",
      render: (_, record) => {
        // Không hiển thị nút tác vụ cho tài khoản admin
        if (record.role === "admin") {
          return null;
        }
        // Nếu tài khoản đã bị khóa, hiển thị nút mở khóa
        if (record.accountStatus === "Suspended") {
          return (
            <Space size="middle">
              <Button
                size="medium"
                type="primary"
                icon={<EyeInvisibleOutlined />}
                className="bg-[#D63847] text-[#FFFDFF] font-bold hover:!bg-[#A02B35]"
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: "Xác nhận mở khóa tài khoản",
                    content:
                      "Bạn có chắc chắn muốn mở khóa tài khoản này không?",
                    okText: "Mở khóa",
                    cancelText: "Hủy",
                    onOk: async () => {
                      await handleStatusUser(record.userID, "Active");
                      message.success("Đã mở khóa tài khoản thành công!");
                    },
                  });
                }}
                title="Mở khóa tài khoản"
              />
            </Space>
          );
        }
        // Nếu tài khoản đang hoạt động, hiển thị nút khóa (có kiểm tra rate limit)
        return (
          <Space size="middle">
            <Button
              size="medium"
              type="primary"
              icon={<EyeOutlined style={{ color: "#52c41a" }} />}
              className="bg-[#E6FFFB] text-[#52c41a] font-bold border-[#52c41a]"
              onClick={(e) => {
                e.stopPropagation();
                if (!canLockAccount(record.userID)) {
                  message.warning(
                    `Tối đa 5 lần, 5 tài khoản Không thể khóa tài khoản này do đã vượt quá giới hạn trong 1 phút!\nTối đa 5 lần, 5 tài khoản`
                  );
                  return;
                }
                Modal.confirm({
                  title: "Xác nhận khóa tài khoản",
                  content: "Bạn có chắc chắn muốn khóa tài khoản này không?",
                  okText: "Khóa",
                  cancelText: "Hủy",
                  onOk: async () => {
                    await handleStatusUser(record.userID, "Suspended");
                    recordLockAction(record.userID);
                    console.log("Lịch sử", times);
                    message.success("Đã khóa tài khoản thành công!");
                  },
                });
              }}
              title="Khóa tài khoản"
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Layout className="overflow-hidden">
      <div className="bg-[#ffff] h-fit px-6 overflow-hidden rounded-[20px]">
        <Flex gap="middle" vertical>
          <Flex gap="middle">
            <div className="text-2xl text-primary font-bold mt-3">
              Danh sách người dùng
            </div>
          </Flex>
          <Flex gap="middle">
            <Button
              onClick={handleResetAll}
              type="default"
              className="font-bold"
              icon={<ReloadOutlined />}
            >
              Tải lại
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Flex>
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <Table
              size="small"
              dataSource={users || []}
              rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
              rowKey="_id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                onChange: (page, pageSize) => {
                  setPagination({
                    current: page,
                    pageSize: pageSize,
                  });
                },
              }}
              onChange={(pagination, filters, sorter) => {
                setPagination({
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                });
                setFilteredInfo(filters || {});
                setSortedInfo(sorter || {});
              }}
              filteredInfo={filteredInfo}
              sortedInfo={sortedInfo}
              className="text-sm font-thin hover:cursor-pointer "
              onRow={(record) => ({
                onClick: () => showUserDetails(record),
              })}
              columns={columns}
            />
          </Spin>
          <UserDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={selectedUser}
          />
        </Flex>
      </div>
    </Layout>
  );
};

export default ListUser;
