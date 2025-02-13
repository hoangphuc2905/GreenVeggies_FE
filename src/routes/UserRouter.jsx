import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import Product from "../pages/user/Products/page";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
    </Routes>
  );
};

export default UserRouter;
