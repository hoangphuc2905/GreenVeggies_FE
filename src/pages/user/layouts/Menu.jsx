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
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2 " /> Rau
          Xanh
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2 " /> Củ
          Quả
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" /> Nấm
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" /> Rau
          Gia Vị
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" /> Sản
          Phẩm Đặc Biệt
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" /> Rau
          Đặc Sản
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" /> Trái
          Cây
        </h3>
      </div>
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">
          <FontAwesomeIcon icon={faArrowRight} className="text-l mr-2" /> Các
          Sản Phẩm Liên Quan
        </h3>
      </div>
    </div>
  );
};

export default Menu;
