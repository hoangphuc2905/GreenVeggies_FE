import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Input, Button, Alert } from "antd";

const FilterPrice = ({
  setMinPrice,
  setMaxPrice,
  setCurrentPage,
  selectedPriceRange,
  setSelectedPriceRange,
  tempMinPrice,
  setTempMinPrice,
  tempMaxPrice,
  setTempMaxPrice,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (searchQuery) {
      setMinPrice(0);
      setMaxPrice(Number.MAX_VALUE);
      setTempMinPrice("");
      setTempMaxPrice("");
    }
  }, [searchQuery, setMinPrice, setMaxPrice, setTempMinPrice, setTempMaxPrice]);

  const handleFilter = () => {
    const newMinPrice = tempMinPrice ? Number(tempMinPrice) : 0;
    const newMaxPrice = tempMaxPrice ? Number(tempMaxPrice) : Number.MAX_VALUE;

    if (newMinPrice < 0 || newMaxPrice < 0) {
      setErrorMessage("Giá không được nhỏ hơn 0");
      return;
    }

    if (newMinPrice > newMaxPrice) {
      setErrorMessage("Giá tối thiểu phải nhỏ hơn giá tối đa");
      return;
    }

    setErrorMessage("");
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("search");
      params.set("minPrice", newMinPrice);
      params.set("maxPrice", newMaxPrice);
      return params;
    });

    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceRangeChange = (range) => {
    if (selectedPriceRange === range) {
      setSelectedPriceRange(null);
      setMinPrice(0);
      setMaxPrice(Number.MAX_VALUE);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("minPrice");
        params.delete("maxPrice");
        params.delete("search"); // Xóa từ khóa tìm kiếm khi chọn radio
        return params;
      });
    } else {
      setSelectedPriceRange(range);
      setTempMinPrice("");
      setTempMaxPrice("");
      setCurrentPage(1);

      let newMin = 0,
        newMax = Number.MAX_VALUE;

      switch (range) {
        case "under30k":
          newMax = 30000;
          break;
        case "30kTo50k":
          newMin = 30000;
          newMax = 50000;
          break;
        case "50kTo100k":
          newMin = 50000;
          newMax = 100000;
          break;
        case "above100k":
          newMin = 100000;
          break;
        default:
          break;
      }

      setMinPrice(newMin);
      setMaxPrice(newMax);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("minPrice", newMin);
        params.set("maxPrice", newMax === Number.MAX_VALUE ? "max" : newMax);
        params.delete("search"); // Xóa từ khóa tìm kiếm khi chọn radio
        return params;
      });

      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMinPriceChange = (e) => {
    setTempMinPrice(e.target.value);
    setSelectedPriceRange(null);
  };

  const handleMaxPriceChange = (e) => {
    setTempMaxPrice(e.target.value);
    setSelectedPriceRange(null);
  };

  const menuItems = [
    {
      key: "under30k",
      label: "Dưới 30.000 VND",
    },
    {
      key: "30kTo50k",
      label: "30.000 - 50.000 VND",
    },
    {
      key: "50kTo100k",
      label: "50.000 - 100.000 VND",
    },
    {
      key: "above100k",
      label: "Trên 100.000 VND",
    },
  ];

  return (
    <div className="p-4 border rounded-lg shadow-md mt-6 mb-6">
      <h2
        className="text-white text-lg font-bold uppercase tracking-wide text-center 
               bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] 
               rounded-t-lg p-4
               transition duration-300 ease-in-out">
        Lọc theo giá
      </h2>

      <div className="flex flex-col space-y-4 mt-4">
        <Menu
          mode="vertical"
          selectedKeys={selectedPriceRange ? [selectedPriceRange] : []}
          items={menuItems}
          onClick={({ key }) => handlePriceRangeChange(key)}
          style={{
            border: "none",
          }}
          className="[&_.ant-menu-item:hover]:!bg-[#82AE46] [&_.ant-menu-item:hover]:!text-white [&_.ant-menu-item-selected]:!bg-[#82AE46] [&_.ant-menu-item-selected]:!text-white"
        />

        <Input
          type="number"
          placeholder="Giá tối thiểu"
          value={tempMinPrice}
          onChange={handleMinPriceChange}
          className="mt-4 hover:border-[#82AE46] focus:border-[#82AE46] focus:shadow-[0_0_0_2px_rgba(130,174,70,0.2)]"
          status={errorMessage ? "error" : ""}
        />
        <Input
          type="number"
          placeholder="Giá tối đa"
          value={tempMaxPrice}
          onChange={handleMaxPriceChange}
          className="hover:border-[#82AE46] focus:border-[#82AE46] focus:shadow-[0_0_0_2px_rgba(130,174,70,0.2)]"
          status={errorMessage ? "error" : ""}
        />
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className="!p-2"
          />
        )}
        <Button
          onClick={handleFilter}
          className="text-[#82AE46] font-bold uppercase hover:!text-white transition-all duration-300"
          style={{
            background: "white",
            border: "2px solid #82AE46",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#82AE46";
            e.currentTarget.style.borderColor = "#82AE46";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#82AE46";
          }}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

FilterPrice.propTypes = {
  setMinPrice: PropTypes.func.isRequired,
  setMaxPrice: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  selectedPriceRange: PropTypes.string,
  setSelectedPriceRange: PropTypes.func.isRequired,
  tempMinPrice: PropTypes.string.isRequired,
  setTempMinPrice: PropTypes.func.isRequired,
  tempMaxPrice: PropTypes.string.isRequired,
  setTempMaxPrice: PropTypes.func.isRequired,
};

export default FilterPrice;
