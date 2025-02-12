import {
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./menu.css";

const { Sider } = Layout;

const AdminMenu = ({ colorBgContainer }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "dashboard",
      icon: <BarChartOutlined />,
      label: "Bảng thống kê",
      children: [
        { key: "dashboard-revenue", label: "Thống kê doanh thu" },
        { key: "dashboard-orders", label: "Thống kê đơn hàng" },
      ],
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Sản phẩm",
      onClick: () => navigate("/products"),
    },
    {
      key: "user-management",
      icon: <UserOutlined />,
      label: "Quản lý User",
      children: [
        {
          key: "user-list",
          label: "Danh sách User",
          onClick: () => navigate("/user-list"),
          icon: <FontAwesomeIcon icon={faClipboardList} />,
        },
        { key: "add-user", label: "Tạo User mới", icon: <UserAddOutlined /> },
      ],
    },
  ];

  return (
    <Sider
      className="fixed max-h-screen"
      style={{ background: colorBgContainer }}
    >
      <div className="text-[#7A8699] size-5 font-thin mx-6 my-5">Menu</div>
      <Menu
      className="h-screen"
        theme="light"
        mode="inline"
        defaultOpenKeys={["default-page"]}
        items={menuItems}
        onClick={({ key }) => {
          const selectedItem = menuItems.find(
            (item) =>
              item.key === key ||
              (item.children &&
                item.children.some((child) => child.key === key))
          );
          selectedItem?.onClick && selectedItem.onClick();
        }}
      />
    </Sider>
  );
};

AdminMenu.propTypes = {
  colorBgContainer: PropTypes.string.isRequired,
};

export default AdminMenu;
