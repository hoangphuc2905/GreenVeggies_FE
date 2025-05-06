import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "../pages/user/Home";
import Product from "../pages/user/product/Page";
import Detail from "../pages/user/product/Detail";
import Wishlist from "../pages/user/Wishlist/Cart/";
import ProfilePage from "../pages/user/Profile/ProfilePage";
import Profile from "../pages/user/Profile/Profile";
import Address from "../pages/user/Profile/AddressForm";
import Contact from "../pages/user/Contact/Contact";
import News from "../pages/user/news/News";
import NewsDetail from "../pages/user/news/NewsDetail";
import OrderDetail from "../pages/user/profile/OrderDetail";
import OrderProFile from "../pages/user/profile/OrderProfile";

import { useEffect, useState } from "react";
import CategoryPage from "../pages/user/Category/CategoryPage";
import Header from "../pages/user/layouts/Header";
import UserFooter from "../pages/user/layouts/UserFooter";
import { App } from "antd";
import { fetchUser } from "../redux/userSlice";
import { getUserInfo } from "../services/UserService";
import OrderPage from "../pages/user/Order/OrderPage";
import ChangePassword from "../pages/user/profile/ChangePassword";
import PaymentPage from "../pages/user/payment/PaymentPage";

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
    return <div>Loading...</div>; // Hoặc spinner
  }

  return (
    <App>
      <Header />

      <Routes>
        {/* Các route chính */}
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
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Các route liên quan đến user */}
        <Route path="/user" element={<ProfilePage />}>
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<OrderProFile />} />
          <Route path="order/:orderID" element={<OrderDetail />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>
      </Routes>

      <UserFooter />
    </App>
  );
};

export default UserRouter;
