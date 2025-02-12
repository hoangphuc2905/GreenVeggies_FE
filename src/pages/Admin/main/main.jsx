import { Layout, theme } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminHeader from "../layout/header";
import AdminMenu from "../layout/menu";
import ListUser from "../listUser/page";
import Products from "../product/page";

const Main = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout className="" style={{ minHeight: "100vh" }}>
        <AdminHeader />
        
        <Layout style={{ marginTop: "64px" }}>
          <AdminMenu colorBgContainer={colorBgContainer} />
          <Layout style={{ marginLeft: "200px", padding: "24px" }}>
            <Routes>
              <Route path="/" element={<Navigate to="/default-page" />} />
              <Route path="/products" element={<Products />} />
              <Route path="/user-list" element={<ListUser />} />
            </Routes>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Main;
