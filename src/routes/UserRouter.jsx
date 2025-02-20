import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import Product from "../pages/user/Products/page";
import Detail from "../pages/user/Products/detail";
import Profile from "../pages/user/Profile/page";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/:id" element={<Detail />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default UserRouter;
