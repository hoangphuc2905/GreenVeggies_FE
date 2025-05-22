import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserInfo } from "../../../services/UserService";

const breadcrumbItems = {
  "/admin/products": [
    {
      href: "/admin/products",
      title: (
        <>
          <span>Quản lý sản phẩm</span>
        </>
      ),
    },
    { href: "/admin/products", title: "Danh sách sản phẩm" },
  ],
  "/admin/add-product": [
    {
      href: "/admin/products",
      title: (
        <>
          <span>Quản lý sản phẩm</span>
        </>
      ),
    },
    { href: "/admin/add-product", title: "Thêm sản phẩm" },
  ],
  "/admin/user-list": [
    { href: "/admin/user-management", title: "Quản lý User" },
    { href: "/admin/user-list", title: "Danh sách User" },
  ],
  "/admin/add-user": [
    { href: "/admin/user-management", title: "Quản lý User" },
    { href: "/admin/add-user", title: "Tạo User mới" },
  ],
  "/admin/dashboard/revenue": [
    { href: "/admin/dashboard", title: "Bảng thống kê" },
    { href: "/admin/dashboard/revenue", title: "Thống kê doanh thu" },
  ],
  "/admin/dashboard/orders": [
    { href: "/admin/dashboard", title: "Bảng thống kê" },
    { href: "/admin/dashboard/orders", title: "Thống kê đơn hàng" },
  ],
  "/admin/dashboard/orders/list": [
    { href: "/admin/dashboard/orders/list", title: "Danh sách đơn hàng" },
  ],
  "/admin/notifications": [
    { href: "/admin/notifications", title: "Danh sách thông báo" },
  ],
  "/admin/stock-entries": [
    {
      href: "/admin/products",
      title: (
        <>
          <span>Quản lý sản phẩm</span>
        </>
      ),
    },
    { href: "/admin/stock-entries", title: "Danh sách phiếu nhập" },
  ],
};

const BreadcrumbNav = () => {
  const location = useLocation();
  const { id } = useParams();
  const [productName, setProductName] = useState("Chi tiết sản phẩm");

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (id) {
        try {
          const response = await getUserInfo(id);
          console.log(response);
          setProductName(response?.name || "Chi tiết sản phẩm");
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      }
    };
    fetchProductDetail();
  }, [id]);

  let breadcrumbList = [{ href: "/admin/dashboard", title: <HomeOutlined /> }];

  if (location.pathname.startsWith("/admin/products/")) {
    breadcrumbList = [
      ...breadcrumbList,
      ...breadcrumbItems["/admin/products"],
      { title: productName },
    ];
  } else {
    breadcrumbList = [
      ...breadcrumbList,
      ...(breadcrumbItems[location.pathname] || []),
    ];
  }

  return <Breadcrumb items={breadcrumbList} className="py-5" />;
};

export default BreadcrumbNav;
