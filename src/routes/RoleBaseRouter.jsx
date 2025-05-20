import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { App } from "antd";
import UserRouter from "./UserRouter";
import AdminRouter from "./AdminRouter";
import ErrorRouter from "./ErrorRouter";
import { fetchUser } from "../redux/userSlice";
import { getUserInfo } from "../services/UserService";

const RoleBasedRouter = () => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userID = localStorage.getItem("userID");
      const role = localStorage.getItem("role");

      if (accessToken && refreshToken && userID) {
        try {
          const userInfo = await getUserInfo(userID, accessToken);
          console.log(
            "User info retrieved:",
            userInfo?.username || "Anonymous user"
          );

          const userRole = role || "guest";

          localStorage.setItem("role", userRole);
          setRole(userRole);

          dispatch(fetchUser({ userID, accessToken, refreshToken }));

          // Chỉ chuyển hướng nếu chưa ở đúng route
          if (
            userRole === "admin" &&
            !window.location.pathname.startsWith("/admin")
          ) {
            navigate("/admin/dashboard/revenue", { replace: true }); // Sử dụng replace để tránh vòng lặp
          } else if (
            userRole !== "admin" &&
            !window.location.pathname.startsWith("/user") &&
            !window.location.pathname.startsWith("/")
          ) {
            navigate("/not-authorized", { replace: true }); // Redirect to error page for invalid paths
          } else if (
            userRole !== "admin" &&
            window.location.pathname.startsWith("/admin")
          ) {
            navigate("/", { replace: true }); // Chuyển về trang chính nếu không phải admin
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          setRole("guest");
        }
      } else {
        setRole("guest");
        // Kiểm tra xem người dùng có đang cố truy cập vào trang admin không
        if (window.location.pathname.startsWith("/admin")) {
          navigate("/", { replace: true });
        }
      }
      setIsLoading(false);
    };

    checkUserRole();
  }, [dispatch, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <App>
      <Routes>
        {/* Shared routes for user and guest */}
        {(role === "user" || role === "guest") && (
          <Route path="/*" element={<UserRouter />} />
        )}

        {/* Admin routes */}
        {role === "admin" && (
          <Route path="/admin/*" element={<AdminRouter />} />
        )}

        {/* Fallback for undefined routes */}
        <Route path="/not-authorized" element={<ErrorRouter />} />
      </Routes>
    </App>
  );
};

export default RoleBasedRouter;
