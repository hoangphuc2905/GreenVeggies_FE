import { Avatar, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBell } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/Green.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../redux/userSlice";
import { getUserInfo } from "../../../api/api";

const AdminHeader = () => {
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    if (token && userID) {
      dispatch(fetchUser({ userID, token }));
      getUserInfo(userID, token).then((userInfo) => {
        // console.log("fetch user", res);
        setUserInfo(userInfo);
      });
    } else {
      navigate("/login");
    }
  }, [dispatch]);

  return (
    <div className="flex justify-between items-center px-[1%] h-[65px] bg-primary fixed z-[1000] w-full shadow-md">
      <div className="flex w-full justify-between">
        <a href="/" className="flex items-center">
          <img src={logo} alt="logo" className="h-10" />
          <span className="text-lg font-bold text-[#ffffff]">
            GreenVeggies
          </span>{" "}
        </a>
        <div>
          <div className="text-[#ffffff] font-bold text-l">
            Chào mừng quay trở lại
            {userInfo && userInfo.username ? `, ${userInfo.username}` : ""}
          </div>
          <div>
            <span className="text-[#ffffff] text-base">
              <>Chào mừng bạn đến với trang quản trị</>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Badge size="small" count={100} className="hover:cursor-pointer">
            <Avatar
              className="hover:cursor-pointer bg-transparent"
              shape="square"
              size="default"
            >
              <FontAwesomeIcon
                className="h-full w-full text-[#ffffff]"
                icon={faEnvelope}
              />
            </Avatar>
          </Badge>
          <Badge size="small" count={100} className="hover:cursor-pointer">
            <Avatar
              className="hover:cursor-pointer bg-transparent"
              shape="square"
              size="default"
            >
              <FontAwesomeIcon
                className="h-full w-full text-[#ffffff]"
                icon={faBell}
              />
            </Avatar>
          </Badge>
          <div className="flex items-center gap-2 px-6">
            <div>
              <span className="text-[#ffffff] font-semibold text-base">
                {userInfo && userInfo.username ? `${userInfo.username}` : ""}
              </span>
            </div>
            <Avatar
              className="hover:cursor-pointer"
              size="default"
              src={userInfo.avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
