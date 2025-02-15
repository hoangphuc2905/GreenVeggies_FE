import { Routes, Route } from "react-router-dom";
import { Layout, theme } from "antd";
import AdminHeader from "../pages/Admin/layout/header";
import DefaultPage from "../pages/Admin/defaultPage/defaultPage";
import AdminSidebar from "../pages/Admin/layout/menu";
import Products from "../pages/Admin/product/page";
import Detail from "../pages/Admin/product/detail";
import ListUser from "../pages/Admin/listUser/page";
import InsertForm from "../pages/Admin/product/insert";
import BreadcrumbNav from "../pages/Admin/layout/BreadcrumbNav";

const AdminRouter = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="h-full" style={{ minHeight: "100vh" }}>
      <AdminHeader style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }} />
      <Layout style={{ marginTop: "25px", position: "relative" }}>
        <Layout className="h-full" style={{ display: "flex"}}>
          <AdminSidebar style={{ position: "fixed", left: 0, top: "104px", height: "calc(100vh - 104px)", zIndex: 900, width: "200px" }} colorBgContainer={colorBgContainer} />
          <Layout className="h-full mt-[1%]" style={{ flex: 1, padding: "16px", marginLeft: "200px" }}>
            <BreadcrumbNav style={{ position: "relative", marginBottom: "16px", padding: "8px 16px", background: colorBgContainer }} />
            <Routes>
              <Route path="/" element={<DefaultPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Detail />} />
              <Route path="/user-list" element={<ListUser />} />
              <Route path="/add-product" element={<InsertForm />} />
            </Routes>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminRouter;
