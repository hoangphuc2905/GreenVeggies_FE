import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { App, Layout, theme } from "antd";
import BreadcrumbNav from "../pages/admin/layout/BreadcrumbNav";
import Revenue from "../pages/admin/revenue/Revenue";
import Detail from "../pages/admin/product/detail/Detail";
import ListUser from "../pages/admin/user/ListUser";
import AdminHeader from "../pages/admin/layout/AdminHeader";

import UpdateProduct from "../pages/admin/product/InsertAndUpdate/UpdateProduct";
import InsertProduct from "../pages/admin/product/insertAndUpdate/InsertProduct";
import Order from "../pages/admin/order/Order";
import Page from "../pages/admin/product/Page";
import AdminSidebar from "../pages/admin/layout/AdminSidebar";
import { useDispatch } from "react-redux";

import { useEffect, useState } from "react";
import { fetchUser } from "../redux/userSlice";
import { getUserInfo } from "../api/api";
import NotificationScreen from "../pages/admin/notification/NotificationScreen";

const AdminRouter = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    if (token && userID) {
      dispatch(fetchUser({ userID, token }));
      getUserInfo(userID, token).then((userInfo) => {
        setUserInfo(userInfo);
        if (userInfo.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/not-authorized");
        }
      });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  if (!isAdmin) {
    return null; // or a loading spinner
  }

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
            <Layout className="h-full mt-[4vh] flex-1 p-4 ml-[240px] mr-[3vh]">
              <BreadcrumbNav
                className="fixed top-16 w-full"
                style={{
                  background: colorBgContainer,
                }}
              />
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard/revenue" />}
                />
                <Route path="/products" element={<Page />} />
                <Route path="/products/:id" element={<Detail />} />
                <Route path="/user-list" element={<ListUser />} />
                <Route path="/add-product" element={<InsertProduct />} />
                <Route
                  path="/products/update-product/:id"
                  element={<UpdateProduct />}
                />
                <Route path="/dashboard/revenue" element={<Revenue />} />
                <Route path="/dashboard/orders" element={<Order />} />
                <Route
                  path="/notifications"
                  element={<NotificationScreen userID={userInfo.userID} />}
                />
              </Routes>
            </Layout>
          </Layout>
        </Layout>
      </Layout>
    </App>
  );
};

export default AdminRouter;
