import { Routes, Route } from "react-router-dom";
import { App, Layout, theme } from "antd";
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
    <App>
      <Layout className="h-full min-h-screen m-0">
        <AdminHeader className="fixed top-0" />
        <AdminSidebar
          className="fixed left-0 top-16 h-full z-[900] w-48"
          colorBgContainer={colorBgContainer}
        />
        <Layout className="mt-6 relative">
          <Layout className="h-full flex">
            <Layout className="h-full mt-[4vh] flex-1 p-4 ml-52 mr-[3vh]">
              <BreadcrumbNav
                className="fixed top-16 w-full"
                style={{
                  background: colorBgContainer,
                }}
              />
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
    </App>
  );
};

export default AdminRouter;
