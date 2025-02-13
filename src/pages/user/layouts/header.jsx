import {
  faCartShopping,
  faMagnifyingGlass,
  faPaperPlane,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Badge, Space } from "antd";

const Header = () => {
  return (
    <header className="bg-[#82AE46] w-screen flex items-center shadow-md p-2 fixed top-0 z-10 z-index-50">
      <div className="container mx-auto flex w-full justify-between items-center">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="text-white text-l" />
          <div className="text-white text-xl font-bold ml-2">
            +84 333 319 121
          </div>
        </div>

        <div className="flex items-center">
          <FontAwesomeIcon icon={faPaperPlane} className="text-white text-l" />
          <div className="text-white text-xl font-bold ml-2">
            khoinhokboddy@gmail.com
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white text-xl font-bold bg-[#82AE46] px-4 py-2 rounded">
            <FontAwesomeIcon icon={faUser} className="text-white text-l" /> Đăng
            nhập/ Đăng ký
          </button>
        </div>

        <div className="fixed top-[60px] bg-white w-screen left-0 shadow-md z-10">
          <div className="container flex justify-between items-center center mx-auto">
            <h1 className="text-[#82AE46] text-4xl py-2 font-bold">
              GreenVeggies
            </h1>

            <nav>
              <ul className="flex">
                <li className="mx-4 py-2">
                  <Link to="/" className="font-bold">
                    TRANG CHỦ
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/product" className="font-bold">
                    CỬA HÀNG
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/news" className="font-bold">
                    TIN TỨC
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/posts" className="font-bold">
                    BÀI VIẾT
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/contact" className="font-bold">
                    LIÊN HỆ
                  </Link>
                </li>
                <li className="mx-4 py-2">
                  <Link to="/cart" className="font-bold">
                    <Space size="middle">
                      <Badge count={0} showZero>
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className="text-xl"
                        />
                      </Badge>
                    </Space>
                  </Link>
                </li>
                <li className="mx-4 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="px-3 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-[200px] bg-[#D9D9D9]"
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-black-500"
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
