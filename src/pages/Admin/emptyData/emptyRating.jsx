import emptyRating from "../../../assets/emptyRating.png";
import React from "react";

const EmptyRating = () => {
  return (
    <div className="text-center items-center w-full h-full flex flex-col justify-center">
      <img src={emptyRating} alt="emptyRating" className="w-1/5 mx-auto" />
      <div className="text-center text-[#BDBDBD] text-lg">
        Chưa có đánh giá nào
      </div>
    </div>
  );
};

export default EmptyRating;
