import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../../api/api"; // Giả sử bạn có hàm này để gọi API lấy thông tin danh mục

const Menu = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col ">
      <div>
        <h2
          className="text-white text-2xl font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-xl p-4 shadow-lg 
               hover:scale-105 transition duration-300 ease-in-out">
          Danh mục sản phẩm
        </h2>
      </div>
      {categories.map((category, index) => (
        <Link key={index} to={`/category/${category.categoryID}`}>
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
