import { Avatar, Badge, Dropdown, message, Modal, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/Green.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../redux/userSlice";
import { getUserInfo } from "../../../api/api";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Profile from "../../user/Profile/Profile";
import Notification from "../notification/Notification";
import ChangePassword from "../../user/profile/ChangePassword";

const AdminHeader = () => {
  const [userInfo, setUserInfo] = useState({});
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    if (token && userID) {
      dispatch(fetchUser({ userID, token }));
      getUserInfo(userID, token).then((userInfo) => {
        setUserInfo(userInfo);
      });
    } else {
      navigate("/");
    }
  }, [dispatch]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk() {
        // Xóa thông tin người dùng và token khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        setUserInfo({});
        message.success("Bạn đã đăng xuất thành công!");
        navigate("/"); // Chuyển hướng về trang Home
      },
    });
  };

  const items = [
    {
      key: "1",
      label: "Chào! Ngày mới vui vẻ",
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => setProfileModalVisible(true),
    },
    {
      key: "3",
      label: "Cập nhật mật khẩu",
      icon: <SettingOutlined />,
      onClick: () => setPasswordModalVisible(true),
    },
    {
      key: "4",
      label: <div>Đăng xuất</div>,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

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
          <Popover
            content={<Notification />}
            trigger="hover"
            placement="bottomRight"
          >
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
          </Popover>

          <Dropdown
            className="flex items-center gap-2 hover:cursor-pointer"
            menu={{ items }}
            placement="bottomLeft"
            arrow
          >
            <div>
              <span className="text-[#ffffff] font-semibold text-base">
                {userInfo && userInfo.username ? `${userInfo.username}` : ""}
              </span>
              <Avatar
                className="hover:cursor-pointer"
                size="large"
                src={userInfo.avatar}
              />
            </div>
          </Dropdown>
        </div>
      </div>

      <Modal
        title="Thông tin cá nhân"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
      >
        <Profile></Profile>
      </Modal>

      <Modal
        title="Cập nhật mật khẩu"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <ChangePassword></ChangePassword>
      </Modal>
    </div>
  );
};

export default AdminHeader;
