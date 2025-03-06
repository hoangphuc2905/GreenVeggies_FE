import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../redux/store"; // Import Redux Store
import Home from "../pages/user/Home";
import Product from "../pages/user/Products/page";
import Detail from "../pages/user/Products/detail";
import Wishlist from "../pages/user/Wishlist/cart";
import ProfilePage from "../pages/user/Profile/page";
import Profile from "../pages/user/Profile/proflie";
import ChangePassword from "../pages/user/Profile/changepassword";
import Address from "../pages/user/Profile/address"; // Import Address
import Contact from "../pages/user/Contact/Contact";
import OrderPage from "../pages/user/Order/OrderPage"; // Import OrderPage

import { useState } from "react";
import CategoryPage from "../pages/user/Category/CategoryPage";
import Header from "../pages/user/layouts/header";
import UserFooter from "../pages/user/layouts/UserFooter";

const UserRouter = () => {
  const [wishlist, setWishlist] = useState([]);

  return (
    <Provider store={store}>
      <Header></Header>

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
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/order" element={<OrderPage />} />{" "}
        {/* Thêm route cho OrderPage */}
        {/* Nhóm route có Sidebar của User */}
        <Route path="/user" element={<ProfilePage />}>
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} />{" "}
          {/* Thêm route cho Address */}
        </Route>
      </Routes>
      <UserFooter></UserFooter>
    </Provider>
  );
};

export default UserRouter;
