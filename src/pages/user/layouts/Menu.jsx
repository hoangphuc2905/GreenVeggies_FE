import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const categories = [
  { name: "Rau Xanh", path: "/category/rau-xanh" },
  { name: "Củ Quả", path: "/category/cu-qua" },
  { name: "Nấm", path: "/category/nam" },
  { name: "Rau Gia Vị", path: "/category/rau-gia-vi" },
  { name: "Sản Phẩm Đặc Biệt", path: "/category/dac-biet" },
  { name: "Rau Đặc Sản", path: "/category/rau-dac-san" },
  { name: "Trái Cây", path: "/category/trai-cay" },
  { name: "Các Sản Phẩm Liên Quan", path: "/category/lien-quan" },
];

const Menu = () => {
  return (
    <div className="flex flex-col ">
      <div>
        <h2 className="text-white text-2xl bg-[#82AE46] rounded-[15px] p-4 text-center ">
          Danh mục sản phẩm
        </h2>
      </div>
      {categories.map((category, index) => (
        <Link key={index} to={category.path}>
          <div className="p-4 border rounded-lg shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
            <h3 className="text-xl font-semibold">
              <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" />{" "}
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Menu;
