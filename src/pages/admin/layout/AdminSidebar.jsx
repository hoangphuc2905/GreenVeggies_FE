import {
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  ProductOutlined,
  AppstoreAddOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { ConfigProvider, Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const { Sider } = Layout;

const AdminSidebar = ({ colorBgContainer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <BarChartOutlined />,
      label: "Bảng thống kê",
      children: [
        {
          key: "/admin/dashboard/revenue",
          label: "Thống kê doanh thu",
          icon: <DollarOutlined />,
          onClick: () => navigate("/admin/dashboard/revenue"),
        },
        {
          key: "/admin/dashboard/orders",
          label: "Thống kê đơn hàng",
          icon: <ShoppingCartOutlined />,
          onClick: () => navigate("/admin/dashboard/orders"),
        },
        {
          key: "/admin/dashboard/orders/list",
          label: "Danh sách đơn hàng",
          icon: <FileTextOutlined />,

          onClick: () => navigate("/admin/dashboard/orders/list"),
        },
      ],
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: "Sản phẩm",
      children: [
        {
          key: "/admin/products",
          label: "Danh sách",
          icon: <ProductOutlined />,
          onClick: () => navigate("/admin/products"),
        },
        {
          key: "/admin/add-product",
          label: "Thêm sản phẩm",
          icon: <AppstoreAddOutlined />,
          onClick: () => navigate("/admin/add-product"),
        },
      ],
    },
    {
      key: "/admin/user-management",
      icon: <UserOutlined />,
      label: "Quản lý User",
      children: [
        {
          key: "/admin/user-list",
          label: "Danh sách User",
          onClick: () => navigate("/admin/user-list"),
          icon: <FontAwesomeIcon icon={faClipboardList} />,
        },
      ],
    },
    {
      key: "/admin/notifications",
      icon: <BellOutlined />,
      label: "Thông báo",
      onClick: () => navigate("/admin/notifications"),
    },
  ];

  let activeParentKey = menuItems.find((item) =>
    item.children?.some((child) => location.pathname === child.key)
  )?.key;

  if (location.pathname.startsWith("/admin/products/")) {
    activeParentKey = "/admin/products";
  }

  return (
    <Sider
      className="fixed max-h-screen h-fit z-50 pt-[2vh] mt-[3vh]"
      style={{ background: colorBgContainer }}
      width={220}
    >
      <div className="text-[#7A8699] text-sm font-thin mx-6 my-5">Menu</div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorText: "#808080",
              colorTextHover: "#82AE47",
              itemSelectedBg: "#CFE0B9",
              colorBgContainer: "#ffffff",
              borderRadius: 8,
              itemSelectedColor: "#82AE47",
              subMenuItemSelectedColor: "#82AE47",
              itemActiveBg: "#CFE0B9",
            },
          },
        }}
      >
        <Menu
          className="admin-menu h-screen text-xs"
          mode="inline"
          selectedKeys={[
            location.pathname.startsWith("/admin/products/")
              ? "/admin/products"
              : location.pathname,
          ]}
          defaultOpenKeys={activeParentKey ? [activeParentKey] : []}
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
