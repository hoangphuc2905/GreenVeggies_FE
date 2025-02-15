import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FcCurrencyExchange, FcContacts, FcBullish, FcSynchronize, FcExport } from "react-icons/fc";
import { IoLocation } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";

const Profile = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(() => {
        return location.pathname.split('/').pop() || 'payment';
    });
    const dispatch = useDispatch();

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            dispatch(logout());
        }
        else {
            return false;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white p-4">
                <ul className="space-y-4">
                    <li className={`cursor-pointer ${activeMenu === "payment" ? "text-green-500" : ""}`} onClick={() => handleMenuClick("payment")}>
                        <Link to="payment" className="flex items-center space-x-2">
                            <FcCurrencyExchange className="text-xl" />
                            <span>Thanh toán</span>
                        </Link>
                    </li>
                    <li className={`cursor-pointer ${activeMenu === "account-info" ? "text-green-500" : ""}`} onClick={() => handleMenuClick("account-info")}>
                        <Link to="account-info" className="flex items-center space-x-2">
                            <FcContacts className="text-xl" />
                            <span>Thông tin cá nhân</span>
                        </Link>
                    </li>
                    <li className={`cursor-pointer ${activeMenu === "ticket-history" ? "text-green-500" : ""}`} onClick={() => handleMenuClick("ticket-history")}>
                        <Link to="ticket-history" className="flex items-center space-x-2">
                            <FcBullish className="text-xl" />
                            <span>Lịch sử mua vé</span>
                        </Link>
                    </li>
                    <li className={`cursor-pointer ${activeMenu === "address" ? "text-green-500" : ""}`} onClick={() => handleMenuClick("address")}>
                        <Link to="address" className="flex items-center space-x-2">
                            <IoLocation className="text-xl" />
                            <span>Địa chỉ của bạn</span>
                        </Link>
                    </li>
                    <li className={`cursor-pointer ${activeMenu === "reset-password" ? "text-green-500" : ""}`} onClick={() => handleMenuClick("reset-password")}>
                        <Link to="reset-password" className="flex items-center space-x-2">
                            <FcSynchronize className="text-xl" />
                            <span>Đặt lại mật khẩu</span>
                        </Link>
                    </li>
                    <li onClick={handleLogout} className="cursor-pointer mt-4 flex items-center space-x-2">
                        <FcExport className="text-xl" />
                        <span>Đăng xuất</span>
                    </li>
                </ul>
            </div>

            {/* Content Area */}
            <div className="w-3/4 p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default Profile;
