import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import Product from "../pages/user/Products/page";
import Detail from "../pages/user/Products/detail";
import Wishlist from "../pages/user/Wishlist/cart";
import { useState } from "react";

const UserRouter = () => {
  const [wishlist, setWishlist] = useState([]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route
        path="/product/:id"
        element={<Detail wishlist={wishlist} setWishlist={setWishlist} />}
      />
      <Route path="/wishlist" element={<Wishlist wishlist={wishlist} />} />
    </Routes>
  );
};

export default UserRouter;
