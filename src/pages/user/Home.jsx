import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons'; // import icon tại đây

const Home = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#82AE46] h-[55px] flex items-center shadow-md">
        <div className="container mx-auto flex w-full justify-between items-center px-10">
          <div className="flex items-center">
            {/* Sử dụng icon ở đây */}
            <FontAwesomeIcon icon={faPhone} className="text-white text-l" />
            <div className="text-white text-xl font-bold"> +84 333 319 121</div>
          </div>
          <div className="flex items-center">
            {/* Sử dụng icon ở đây */}
            <FontAwesomeIcon icon="fa-regular fa-paper-plane "className="text-white text-l "  />
            <div className="text-white text-xl font-bold">khoinhokboddy@gmail.com</div>
          </div>
          
          <div className="text-white text-xl font-bold">3-5 NGÀY LÀM VIỆC GIAO HÀNG & TRẢ LẠI MIỄN PHÍ</div>
        </div>
      </header>

      {/* H1 - Căn trái */}
      <div className="container mx-auto px-10">
        <div className="flex justify-start">
          <h1 className="text-[#82AE46] text-4xl py-2 font-bold">GreenVeggies</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
