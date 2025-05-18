import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logoImage from "../../../assets/pictures/Green.png";
import { Badge, Space, notification } from "antd";
import { useNavigate } from "react-router-dom";
import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { getShoppingCartByUserId } from "../../../services/ShoppingCartService";
import LoginForm from "../../../components/login/login";

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isHomeActive = location.pathname === "/";
  const isProductActive = location.pathname.startsWith("/product");
  const isNewsActive = location.pathname.startsWith("/news");
  const isCartActive = location.pathname.startsWith("/wishlist");
  const isContactActive = location.pathname.startsWith("/contact");
  const isBlogActive = location.pathname.startsWith("/posts");
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const [cartItemCount, setCartItemCount] = useState(0);

  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
  };

  const fetchAndUpdateCartCount = async () => {
    const userID = localStorage.getItem("userID");
    if (userID) {
      try {
        const shoppingCart = await getShoppingCartByUserId(userID);
        if (shoppingCart && shoppingCart.shoppingCartDetails) {
          const itemCount = shoppingCart.shoppingCartDetails.length;
          setCartItemCount(itemCount);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch shopping cart:", error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchAndUpdateCartCount();
    }

    // Listen for cart updates
    const handleCartUpdated = () => {
      if (isLoggedIn()) {
        fetchAndUpdateCartCount();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const handleCartClick = (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      displayLoginForm();
    } else {
      scrollToTop();
    }
  };

  const displayLoginForm = () => {
    setIsLoginModalVisible(true);
    notification.info({
      message: "Vui lòng đăng nhập",
      description: "Bạn cần đăng nhập để xem giỏ hàng",
      placement: "topRight",
      duration: 3,
    });
  };

  // Xử lý khi đăng nhập thành công
  const handleLoginSuccess = (data) => {
    setIsLoginModalVisible(false);

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      if (data.userID) {
        localStorage.setItem("userID", data.userID);
      }
    }

    // Cập nhật số lượng giỏ hàng và chuyển hướng đến trang giỏ hàng
    fetchAndUpdateCartCount();
    navigate("/wishlist");
  };

  return (
    <div className="fixed top-[50px] bg-[#f1f1f1] w-screen left-0 shadow-md z-10 px-[10%]">
      <div className="container flex justify-between items-center center mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl py-4 font-bold bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] bg-clip-text text-transparent cursor-pointer">
          <img
            src={logoImage}
            alt="Mô tả hình ảnh"
            className="w-[40px] h-[40px]"
          />
          GreenVeggies
        </Link>

        <nav>
          <ul className="flex">
            {/* Trang chủ */}
            <li
              className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                isHomeActive
                  ? "text-[#82AE46] underline font-bold"
                  : "hover:text-[#82AE46] hover:underline active:scale-95"
              }`}>
              <Link to="/" className="font-bold" onClick={scrollToTop}>
                TRANG CHỦ
              </Link>
            </li>

            {/* Cửa hàng */}
            <li
              className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                isProductActive
                  ? "text-[#82AE46] underline font-bold"
                  : "hover:text-[#82AE46] hover:underline active:scale-95"
              }`}>
              <Link to="/product" className="font-bold" onClick={scrollToTop}>
                CỬA HÀNG
              </Link>
            </li>
            <li
              className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                isNewsActive
                  ? "text-[#82AE46] underline font-bold"
                  : "hover:text-[#82AE46] hover:underline active:scale-95"
              }`}>
              <Link to="/news" className="font-bold" onClick={scrollToTop}>
                TIN TỨC
              </Link>
            </li>
            <li
              className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                isBlogActive
                  ? "text-[#82AE46] underline font-bold"
                  : "hover:text-[#82AE46] hover:underline active:scale-95"
              }`}>
              <Link to="/posts" className="font-bold" onClick={scrollToTop}>
                BÀI VIẾT
              </Link>
            </li>
            <li
              className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                isContactActive
                  ? "text-[#82AE46] underline font-bold"
                  : "hover:text-[#82AE46] hover:underline active:scale-95"
              }`}>
              <Link to="/contact" className="font-bold" onClick={scrollToTop}>
                LIÊN HỆ
              </Link>
            </li>
            <li
              className={`mx-4 py-2 text-sm mt-1 transition-all duration-200 ${
                isCartActive
                  ? "text-[#82AE46] underline font-bold"
                  : "hover:text-[#82AE46] hover:underline active:scale-95"
              }`}>
              <Link
                to={isLoggedIn() ? "/wishlist" : "#"}
                className="font-bold"
                onClick={handleCartClick}>
                <Space size="middle">
                  <Badge count={isLoggedIn() ? cartItemCount : 0} showZero>
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className={`text-xl ${
                        isCartActive ? "text-[#82AE46]" : ""
                      }`}
                    />
                  </Badge>
                </Space>
              </Link>
            </li>
            <li className="mx-4 relative hover:text-[#82AE46] hover:underline active:scale-95 transition-all duration-200">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="px-3 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-[300px] bg-[#D9D9D9]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black-500"
              />
            </li>
          </ul>
        </nav>
      </div>

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
    </div>
  );
};

export default Navbar;
