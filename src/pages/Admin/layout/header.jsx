import { Avatar, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBell } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/Green.png";

const AdminHeader = () => {
  return (
    <div className="flex justify-between items-center h-[80px] px-11 bg-[#82AE46] fixed z-[1000] w-screen shadow-md">
      <div className="flex w-full justify-between">
        <a href="/" className="flex items-center py-2">
          <img src={logo} alt="logo" className="h-10 mx-4" />
          <span className="text-lg font-bold text-[#ffffff]">
            GreenVeggies
          </span>{" "}
        </a>
        <div>
          <div className="text-[#ffffff] font-bold text-xl">
            Chào mừng quay trở lại, Admin
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
          <div className="flex items-center gap-2 pl-6">
            <div>
              <span className="text-[#ffffff] font-bold text-lg">Admin</span>
            </div>
            <Avatar
              className="hover:cursor-pointer"
              size="large"
              src="https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
