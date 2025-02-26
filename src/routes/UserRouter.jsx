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
import { useState } from "react";

const UserRouter = () => {
  const [wishlist, setWishlist] = useState([]);
  return (
    <Provider store={store}>
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

        {/* Nhóm route có Sidebar của User */}
        <Route path="/user" element={<ProfilePage />}>
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} />{" "}
          {/* Thêm route cho Address */}
        </Route>
      </Routes>
    </Provider>
  );
};

export default UserRouter;
