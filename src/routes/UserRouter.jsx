import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "../pages/user/Home";
import Product from "../pages/user/Products/page";
import Detail from "../pages/user/Products/detail";
import Wishlist from "../pages/user/Wishlist/cart";
import ProfilePage from "../pages/user/Profile/page";
import Profile from "../pages/user/Profile/proflie";
import ChangePassword from "../pages/user/Profile/changepassword";
import Address from "../pages/user/Profile/address"; // Import Address
import Order from "../pages/user/Profile/Order"; // Import Order
import Contact from "../pages/user/Contact/Contact";
import OrderPage from "../pages/user/Order/OrderPage"; // Import OrderPage
import News from "../pages/user/news/News"; // Import News

import { useEffect, useState } from "react";
import CategoryPage from "../pages/user/Category/CategoryPage";
import Header from "../pages/user/layouts/header";
import UserFooter from "../pages/user/layouts/UserFooter";
import { App } from "antd";
import { fetchUser } from "../redux/userSlice";
import { getUserInfo } from "../api/api";

const UserRouter = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    if (token && userID) {
      dispatch(fetchUser({ userID, token }));
      getUserInfo(userID, token).then((userInfo) => {
        setUserInfo(userInfo);
        if (userInfo.role === "admin") {
          navigate("/not-authorized");
        } else {
          setIsAdmin(false);
        }
      });
    } else {
      navigate("/");
    }
  }, [dispatch, navigate]);

  if (isAdmin) {
    return null; // or a loading spinner
  }

  return (
    <App>
      <Header />

      <Routes>
        {/* Các route chính của user */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route
          path="/product/:id"
          element={<Detail wishlist={wishlist} setWishlist={setWishlist} />}
        />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />{" "}
        {/* Thêm route cho News */}
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/order" element={<OrderPage />} />{" "}
        {/* Thêm route cho OrderPage */}
        {/* Nhóm route có Sidebar của User */}
        <Route path="/user" element={<ProfilePage />}>
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} />{" "}
          <Route path="orders" element={<Order />} />
          {/* Thêm route cho Address */}
        </Route>
      </Routes>
      <UserFooter />
    </App>
  );
};

export default UserRouter;
