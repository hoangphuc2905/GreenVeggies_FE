import {
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { ConfigProvider, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const { Sider } = Layout;

const AdminSidebar = ({ colorBgContainer }) => {
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
      children: [
        {
          key: "product-list",
          label: "Danh sách",
          onClick: () => navigate("/admin/products"),
        },
        { key: "add-product", label: "Thêm sản phẩm",
          onClick: () => navigate("/admin/add-product")
         },
      ],
    },
    {
      key: "user-management",
      icon: <UserOutlined />,
      label: "Quản lý User",
      children: [
        {
          key: "user-list",
          label: "Danh sách User",
          onClick: () => navigate("/admin/user-list"),
          icon: <FontAwesomeIcon icon={faClipboardList} />,
        },
        { key: "add-user", label: "Tạo User mới", icon: <UserAddOutlined /> },
      ],
    },
  ];

  return (
    <Sider
      className="fixed max-h-screen h-fit z-50"
      style={{ background: colorBgContainer }}
    >
      <div className="text-[#7A8699] size-5 font-thin mx-6 my-5">Menu</div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorText: "#808080", // Màu chữ mặc định
              colorTextHover: "#82AE47", // Màu chữ khi hover
              itemSelectedBg: "#CFE0B9", // Màu nền khi mục menu được chọn
              colorBgContainer: "#ffffff", // Màu nền tổng thể của menu
              borderRadius: 8, // Bo tròn góc menu
              itemSelectedColor: "#82AE47", // Màu chữ khi mục menu được chọn
              subMenuItemSelectedColor: "#82AE47", // Màu chữ khi mục menu được chọn (menu ngang)
              itemActiveBg: "#CFE0B9", // Màu nền khi hover
            },
          },
        }}
      >
        <Menu
          className="admin-menu h-screen"
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
            if (selectedItem?.onClick) {
              selectedItem.onClick();
            }
          }}
        />
      </ConfigProvider>
    </Sider>
  );
};

AdminSidebar.propTypes = {
  colorBgContainer: PropTypes.string.isRequired,
};

export default AdminSidebar;
