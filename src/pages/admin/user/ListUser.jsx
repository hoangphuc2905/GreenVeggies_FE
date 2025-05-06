import { Button, Flex, Input, Layout, Select, Space, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import DefaultAVT from "../../../assets/pictures/default.png";
import userRender from "../userRender/UserRender";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import UserDetailModal from "./UserDetailModal";
import { getListUsers } from "../../../services/UserService";
import { getOrdersByUserId } from "../../../services/OrderService"; // Import the function

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
  const [selectedOptions, setSelectedOptions] = useState(["Tất cả"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderCounts, setOrderCounts] = useState({}); // State to store order counts
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); // Add pagination state

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();

      // Sort users to place Admins at the top
      const sortedData = data.sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return 0;
      });

      setUsers(sortedData);
      setOriginalUsers(sortedData);
      console.log("Sorted Users: ", sortedData);

      // Fetch order counts for each user
      const counts = {};
      for (const user of sortedData) {
        try {
          console.log("User ID: ", user.userID); // Log the user ID
          const { orders } = await getOrdersByUserId(user.userID);
          counts[user.userID] = orders.length;
          console.log(
            `User ID: ${user.userID}, Order Count: ${counts[user.userID]}`
          ); // Log the order count for each user
        } catch (error) {
          console.error(
            `Failed to fetch orders for user ${user.userID}:`,
            error
          );
          counts[user.userID] = 0; // Default to 0 if there's an error
        }
      }
      setOrderCounts(counts);
      console.log("Order Counts: ", counts); // Log the final order counts
    };

    fetchUsers();
  }, []);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const hasSelected = selectedRowKeys.length > 0;
  const options = [
    {
      value: "Tất cả",
    },
    {
      value: "Admin",
    },
    {
      value: "User",
    },
  ];

  const handlerFilter = (value) => {
    if (selectedOptions.includes("Tất cả") && value.length > 1) {
      setSelectedOptions(value.filter((v) => v !== "Tất cả"));
    } else if (value.includes("Tất cả")) {
      setSelectedOptions(["Tất cả"]);
    } else {
      setSelectedOptions(value);
    }
    applyFilters(value, searchQuery);
  };

  const onSearch = (value) => {
    setSearchQuery(value);
    applyFilters(selectedOptions, value);
  };

  const applyFilters = (roles, query) => {
    let filteredUsers = originalUsers;

    if (!roles.includes("Tất cả")) {
      const upperCaseRoles = roles.map((item) => item.toUpperCase());
      filteredUsers = filteredUsers.filter((user) =>
        upperCaseRoles.includes(user.role.toUpperCase())
      );
    }
    if (query) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
    }

    setUsers(filteredUsers);
  };

  useEffect(() => {
    applyFilters(selectedOptions, searchQuery);
  }, [selectedOptions, searchQuery]);

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination); // Update pagination state when the page changes
  };

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
            <Select
              mode="multiple"
              tagRender={userRender}
              value={selectedOptions}
              className="w-72"
              options={options}
              onChange={handlerFilter}
            />
            <Search
              placeholder="Tìm kiếm"
              onSearch={onSearch}
              className="w-2/3"
            />
            <Button
              type="primary"
              className="bg-[#EAF3FE] text-[#689CF8] font-bold"
              icon={<PlusCircleOutlined />}
            >
              Thêm người dùng
            </Button>
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
              className="bg-[#82AE46] text-[#FFFFDF] font-bold"
            >
              Reload
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Flex>
          <Table
            size="small"
            dataSource={users || []} // Ensure dataSource is always an array
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            rowKey="_id"
            pagination={pagination} // Pass pagination state to the Table
            onChange={handleTableChange} // Handle page changes
            className="text-sm font-thin hover:cursor-pointer "
            onRow={(record) => ({
              onClick: () => showUserDetails(record),
            })}
          >
            <Column
              title="#"
              key="index"
              align="center"
              render={(_, __, index) =>
                index + 1 + (pagination.current - 1) * pagination.pageSize
              } // Adjust index based on current page
            />
            <Column
              title="Tên"
              dataIndex="username"
              key="username"
              align="center"
            />
            <Column
              title="Hình đại diện"
              dataIndex="avatar"
              key="avatar"
              align="center"
              render={(avatar) => (
                <div className="flex justify-center items-center">
                  <img
                    src={avatar || DefaultAVT}
                    alt="avatar"
                    className="rounded-full w-12 h-12 object-cover radius-full"
                  />
                </div>
              )}
            />
            <Column
              title="Vai trò"
              dataIndex="role"
              key="role"
              align="center"
            />
            <Column
              title="Email"
              dataIndex="email"
              key="email"
              align="center"
            />
            <Column
              title="Đơn hàng"
              dataIndex="userID" // Ensure this matches the key used in `orderCounts`
              key="orders"
              align="center"
              render={(userID) => {
                console.log("Rendering Order Count for User ID: ", userID); // Debug log
                return orderCounts[userID] || "--|--"; // Display order count or default value
              }}
            />
            <Column
              title="Trạng thái"
              dataIndex="accountStatus"
              key="accountStatus"
              align="center"
              render={(accountStatus) => {
                let color = "green";
                if (accountStatus === "Inactive") color = "yellow";
                if (accountStatus === "Suspended") color = "volcano";

                return <Tag color={color}>{accountStatus.toUpperCase()}</Tag>;
              }}
            />
            <Column
              title="Tác vụ"
              key="action"
              align="center"
              render={() => (
                <Space size="middle">
                  <Button
                    type="primary"
                    variant="solid"
                    icon={<EditFilled />}
                    className="bg-[#27A743] text-[#FFFDFF] font-bold hover:!bg-[#1E7D32]"
                  />
                  <Button
                    type="primary"
                    variant="solid"
                    icon={<DeleteFilled />}
                    className="bg-[#D63847] text-[#FFFDFF] font-bold hover:!bg-[#A02B35]"
                  />
                </Space>
              )}
            />
          </Table>

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
