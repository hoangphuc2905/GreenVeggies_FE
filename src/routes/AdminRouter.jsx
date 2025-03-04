import { Routes, Route } from "react-router-dom";
import { App, Layout, theme } from "antd";
import AdminHeader from "../pages/Admin/layout/header";
import AdminSidebar from "../pages/Admin/layout/menu";
import BreadcrumbNav from "../pages/Admin/layout/BreadcrumbNav";
import Revenue from "../pages/Admin/revenue/Index";
import Detail from "../pages/Admin/product/detail/detail";
import ListUser from "../pages/admin/user/ListUser";

import Page from "../pages/Admin/product/page";
import InsertProduct from "../pages/admin/product/InsertAndUpdate/InsertProduct";
import UpdateProduct from "../pages/admin/product/InsertAndUpdate/UpdateProduct";

const AdminRouter = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <App>
      <Layout className="h-full min-h-screen m-0">
        <AdminHeader className="fixed top-0" />

        <Layout className="mt-6 relative">
          <AdminSidebar
            className="fixed left-0 h-full z-[900]"
            colorBgContainer={colorBgContainer}
          />
          <Layout className="h-full flex">
            <Layout className="h-full mt-[4vh] flex-1 p-4 ml-[270px] mr-[3vh]">
              <BreadcrumbNav
                className="fixed top-16 w-full"
                style={{
                  background: colorBgContainer,
                }}
              />
              <Routes>
                <Route path="/" element={<Revenue />} />
                <Route path="/products" element={<Page />} />
                <Route path="/products/:id" element={<Detail />} />
                <Route path="/user-list" element={<ListUser />} />
                <Route path="/add-product" element={<InsertProduct />} />
                <Route
                  path="/products/update-product/:id"
                  element={<UpdateProduct />}
                />
                <Route path="/dashboard/revenue" element={<Revenue />} />
              </Routes>
            </Layout>
          </Layout>
        </Layout>
      </Layout>
    </App>
  );
};

export default AdminRouter;
