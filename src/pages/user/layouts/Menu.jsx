import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Menu = () => {
  return (
    <div className="flex flex-col ">
      <div>
        <h2 className="text-white text-2xl bg-[#82AE46] rounded-[15px] p-4 text-center ">
          Danh mục sản phẩm
        </h2>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Rau Xanh
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Củ Quả
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Nấm
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Rau Gia Vị
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Sản Phẩm
          Đặc Biệt
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Rau Đặc
          Sản
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Trái Cây
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l " /> Các Sản
          Phẩm Liên Quan
        </h3>
      </div>
    </div>
  );
};

export default Menu;
