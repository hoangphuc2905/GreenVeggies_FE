import { Routes, Route } from "react-router-dom";
import { App, Layout, theme } from "antd";
import AdminHeader from "../pages/Admin/layout/header";
import DefaultPage from "../pages/Admin/defaultPage/defaultPage";
import AdminSidebar from "../pages/Admin/layout/menu";
import Products from "../pages/Admin/product/page";
import Detail from "../pages/Admin/product/detail/detail";
import ListUser from "../pages/Admin/user/page";
import BreadcrumbNav from "../pages/Admin/layout/BreadcrumbNav";
import InsertProduct from "../pages/Admin/product/InsertAndUpdate/insert";
import UpdateForm from "../pages/Admin/product/InsertAndUpdate/update";

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
                <Route path="/" element={<DefaultPage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<Detail />} />
                <Route path="/user-list" element={<ListUser />} />
                <Route path="/add-product" element={<InsertProduct />} />
                <Route path="/products/update-product/:id" element={<UpdateForm />} />
              </Routes>
            </Layout>
          </Layout>
        </Layout>
      </Layout>
    </App>
  );
};

export default AdminRouter;
