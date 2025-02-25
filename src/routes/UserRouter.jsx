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
import Lienhe from "../pages/user/LienHe"; // Import Lienhe
import Address from "../pages/user/Profile/address"; // Import Address

const UserRouter = () => {
  return (
    <Provider store={store}>
      <Routes>
        {/* Các route chính của user */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<Detail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Lienhe />} /> {/* Thêm route cho Lienhe */}

        {/* Nhóm route có Sidebar của User */}
        <Route path="/user" element={<ProfilePage />}>
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} /> {/* Thêm route cho Address */}
        </Route>
      </Routes>
    </Provider>
  );
};

export default UserRouter;