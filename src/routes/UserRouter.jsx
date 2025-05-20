import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "../pages/user/Home";
import Product from "../pages/user/product/Page";
import Detail from "../pages/user/product/Detail";
import Wishlist from "../pages/user/Wishlist/Cart";
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
import { App, notification } from "antd";
import { fetchUser } from "../redux/userSlice";
import OrderPage from "../pages/user/order/OrderPage";
import ChangePassword from "../pages/user/profile/ChangePassword";
import PaymentPage from "../pages/user/payment/PaymentPage";
import LoginForm from "../components/login/login";

const UserRouter = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa
  const checkAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userID = localStorage.getItem("userID");
    return !!(accessToken && refreshToken && userID);
  };

  // Xử lý khi đăng nhập thành công
  const handleLoginSuccess = (data) => {
    setIsLoginModalVisible(false);

    if (data && data.accessToken && data.refreshToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      if (data.userID) {
        localStorage.setItem("userID", data.userID);
        dispatch(
          fetchUser({ userID: data.userID, accessToken: data.accessToken })
        );
      }
    }

    // Cập nhật trạng thái đăng nhập và chuyển hướng người dùng đến trang yêu cầu ban đầu
    window.location.reload();
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userID = localStorage.getItem("userID");
    const role = localStorage.getItem("role");

    if (accessToken && refreshToken && userID) {
      dispatch(fetchUser({ userID, accessToken, refreshToken }));

      if (role === "admin") {
        navigate("/admin/dashboard/revenue"); // Redirect to admin dashboard
      } else {
        setIsAdmin(false);
      }
    } else {
      // Kiểm tra xem người dùng có đang cố truy cập vào các route yêu cầu đăng nhập không
      const path = window.location.pathname;
      const publicRoutes = ["/", "/product", "/news", "/contact", "/category"];
      const isPublicRoute = publicRoutes.some((route) =>
        path.startsWith(route)
      );
      const isProductDetail = /^\/product\/[\w-]+$/.test(path);

      // Nếu đang cố truy cập các route yêu cầu đăng nhập, chuyển hướng về trang chủ
      if (!isPublicRoute && !isProductDetail) {
        navigate("/");
        // Hiển thị thông báo đăng nhập khi cố truy cập trang cần xác thực
        setIsLoginModalVisible(true);
        notification.info({
          message: "Vui lòng đăng nhập",
          description: "Bạn cần đăng nhập để truy cập trang này",
          placement: "topRight",
          duration: 3,
        });
      }
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
          element={
            checkAuthenticated() ? (
              <Wishlist wishlist={wishlist} setWishlist={setWishlist} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route
          path="/order"
          element={
            checkAuthenticated() ? <OrderPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/payment"
          element={
            checkAuthenticated() ? <PaymentPage /> : <Navigate to="/" replace />
          }
        />

        {/* Các route liên quan đến user */}
        <Route
          path="/user"
          element={
            checkAuthenticated() ? <ProfilePage /> : <Navigate to="/" replace />
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<OrderProFile />} />
          <Route path="order/:orderID" element={<OrderDetail />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/not-authorized" replace />} />
      </Routes>

      <UserFooter />

      {/* Hiển thị form đăng nhập trực tiếp khi cần */}
      {isLoginModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <LoginForm
            closeLoginForm={() => setIsLoginModalVisible(false)}
            openForgotPasswordForm={() => {}}
            switchToRegister={() => {}}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
    </App>
  );
};

export default UserRouter;
