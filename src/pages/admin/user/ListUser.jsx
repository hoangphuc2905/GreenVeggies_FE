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

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
      setOriginalUsers(data);
      console.log("User: " + data);
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
            dataSource={users}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            className="text-sm font-thin hover:cursor-pointer "
            onRow={(record) => ({
              onClick: () => showUserDetails(record),
            })}
          >
            <Column
              title="#"
              key="index"
              align="center"
              render={(_, __, index) => index + 1}
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
              dataIndex="orders"
              key="quality"
              align="center"
              render={(text) => text || "--|--"} // Provide a default value if data is missing
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
