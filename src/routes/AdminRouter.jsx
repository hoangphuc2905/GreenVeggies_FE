import { Routes, Route } from "react-router-dom";
import { Layout, theme } from "antd";
import AdminHeader from "../pages/Admin/layout/header";
import DefaultPage from "../pages/Admin/defaultPage/defaultPage";
import AdminMenu from "../pages/Admin/layout/menu";
import Products from "../pages/Admin/product/page";
import Detail from "../pages/Admin/product/detail";
import ListUser from "../pages/Admin/listUser/page";

const AdminRouter = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminHeader />
      <Layout style={{ marginTop: "64px" }}>
        <AdminMenu colorBgContainer={colorBgContainer} />
        <Layout style={{ marginLeft: "200px", padding: "24px" }}>
          <Routes>
            <Route path="/" element={<DefaultPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Detail />} />
            <Route path="/user-list" element={<ListUser />} />
            {/* Điều hướng nếu admin vào đường dẫn không hợp lệ
            <Route path="*" element={<Navigate to="/admin" />} /> */}
          </Routes>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminRouter;
