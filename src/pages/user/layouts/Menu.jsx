import { Menu as AntMenu } from 'antd';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../../api/api";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const handleMenuClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const menuItems = categories.map((category) => ({
    key: category._id,
    label: (
      <span>
        <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
        {category.name}
      </span>
    ),
  }));

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md">
      <div className="mb-2">
        <h2 className="text-white text-lg font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-t-lg p-4
               transition duration-300 ease-in-out">
          Danh mục sản phẩm
        </h2>
      </div>
      <AntMenu
        mode="vertical"
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        style={{
          border: 'none',
          padding: '8px',
          '--menu-item-hover-bg': '#82AE46',
          '--menu-item-hover-color': 'white',
        }}
        className="[&_.ant-menu-item:hover]:!bg-[#82AE46] [&_.ant-menu-item:hover]:!text-white [&_.ant-menu-item-selected]:!bg-[#82AE46] [&_.ant-menu-item-selected]:!text-white"
        theme="light"
      />
    </div>
  );
};

export default Menu;
