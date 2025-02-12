import {
  Breadcrumb,
  Button,
  Flex,
  Input,
  Layout,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import DefaultAVT from "../../../assets/default.png";
import axios from "axios";
import userRender from "../userRender/userRender";
import {
  DeleteFilled,
  EditFilled,
  HomeOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserDetailModal from "./profileDetail";

const { Search } = Input;

const getUsers = async (key) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/${key}`);
    return response.data;
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

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers("user");
      setUsers(data);
      setOriginalUsers(data);
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
    if (value.includes("Admin") || value.includes("User")) {
      value = value.filter((item) => item !== "Tất cả");
    }
    if (value.length === 0 || value.includes("Tất cả")) {
      value = ["Tất cả"];
    }

    setSelectedOptions(value);
    applyFilters(value, searchQuery); // Áp dụng lọc dựa trên vai trò và tìm kiếm
  };

  const onSearch = (value) => {
    setSearchQuery(value);
    applyFilters(selectedOptions, value); // Áp dụng lọc dựa trên vai trò và tìm kiếm
  };

  // Hàm áp dụng cả bộ lọc vai trò và tìm kiếm
  const applyFilters = (roles, query) => {
    let filteredUsers = originalUsers;

    // Lọc theo vai trò (nếu không chọn "Tất cả")
    if (!roles.includes("Tất cả")) {
      const upperCaseRoles = roles.map((item) => item.toUpperCase());
      filteredUsers = filteredUsers.filter((user) =>
        upperCaseRoles.includes(user.role.toUpperCase())
      );
    }

    // Lọc theo tìm kiếm
    if (query) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
    }

    setUsers(filteredUsers);
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // State lưu giá trị tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout className="-mt-9">
      <Breadcrumb
        items={[
          {
            href: "",
            title: <HomeOutlined />,
          },
          {
            href: "/default-page",
            title: (
              <>
                <UserOutlined />
                <span>Quản lý user</span>
              </>
            ),
          },
          {
            title: "Danh sách user",
          },
        ]}
        className="py-5"
      />
      <div className="bg-[#ffff] ms min-h-screen p-6 overflow-auto">
        <Flex gap="middle" vertical>
          <Flex gap="middle">
            <div className="text-2xl text-[#82AE46] font-bold">
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
              // loading={loadings[3]}
              // onClick={() => enterLoading(3)}
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
            dataSource={users}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
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
              title="Hình minh họa"
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
