import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const RoleRedirect = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate("/not-authorized"); // Redirect to error page if role is missing
      return;
    }

    console.log("User role:", role); // Log the user role for debugging
    switch (role.toLowerCase()) {
      case "admin":
        navigate("/admin"); // Redirect admin to admin dashboard
        break;
      case "user":
        navigate("/user/home"); // Redirect regular users to user home
        break;
      case "guest":
        navigate("/"); // Redirect guests to guest welcome page
        break;
      default:
        navigate("/not-authorized"); // Redirect to error page for unknown roles
        break;
    }
  }, [role, navigate]);

  return null; // No UI is rendered
};

RoleRedirect.propTypes = {
  role: PropTypes.string.isRequired,
};

export default RoleRedirect;
