import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Input, Alert, Slider, Divider } from "antd";

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
  const [errorMessage,] = useState("");
  const [sliderValues, setSliderValues] = useState([0, 200000]);

  // Update slider when price range selection changes
  useEffect(() => {
    if (selectedPriceRange) {
      switch (selectedPriceRange) {
        case "under30k":
          setSliderValues([0, 30000]);
          break;
        case "30kTo50k":
          setSliderValues([30000, 50000]);
          break;
        case "50kTo100k":
          setSliderValues([50000, 100000]);
          break;
        case "above100k":
          setSliderValues([100000, 200000]);
          break;
        default:
          setSliderValues([0, 200000]);
      }
    }
  }, [selectedPriceRange]);

  // Update input fields when slider changes
  useEffect(() => {
    setTempMinPrice(sliderValues[0].toString());
    setTempMaxPrice(
      sliderValues[1] === 200000 ? "" : sliderValues[1].toString()
    );
  }, [sliderValues, setTempMinPrice, setTempMaxPrice]);

  useEffect(() => {
    if (searchQuery) {
      setMinPrice(0);
      setMaxPrice(Number.MAX_VALUE);
      setTempMinPrice("");
      setTempMaxPrice("");
      setSliderValues([0, 200000]);
    }
  }, [searchQuery, setMinPrice, setMaxPrice, setTempMinPrice, setTempMaxPrice]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceRangeChange = (range) => {
    if (selectedPriceRange === range) {
      setSelectedPriceRange(null);
      setMinPrice(0);
      setMaxPrice(Number.MAX_VALUE);
      setSliderValues([0, 200000]);
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
      scrollToTop();
    }
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setTempMinPrice(value);
    setSelectedPriceRange(null);

    if (value && !isNaN(Number(value))) {
      setSliderValues([Number(value), sliderValues[1]]);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setTempMaxPrice(value);
    setSelectedPriceRange(null);

    if (value && !isNaN(Number(value))) {
      setSliderValues([sliderValues[0], Number(value)]);
    } else {
      // If empty, set to max
      setSliderValues([sliderValues[0], 200000]);
    }
  };

  const handleSliderChange = (values) => {
    setSliderValues(values);
    setSelectedPriceRange(null);
  };

  const handleSliderAfterChange = (values) => {
    // After slider movement completes, apply the filter
    setMinPrice(values[0]);
    setMaxPrice(values[1] === 200000 ? Number.MAX_VALUE : values[1]);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("search");
      params.set("minPrice", values[0]);
      params.set("maxPrice", values[1] === 200000 ? "max" : values[1]);
      return params;
    });
    setCurrentPage(1);

    // Scroll to top after price adjustment
    scrollToTop();
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

  // Format price for slider tooltip
  const sliderTooltipFormatter = (value) => {
    return value === 200000 ? "MAX" : `${value.toLocaleString()} VND`;
  };

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

        <Divider plain className="my-4">
          Điều chỉnh giá
        </Divider>

        <div className="px-4">
          <Slider
            range
            min={0}
            max={200000}
            step={1000}
            value={sliderValues}
            onChange={handleSliderChange}
            onAfterChange={handleSliderAfterChange}
            tooltip={{
              formatter: sliderTooltipFormatter,
              open: true,
              placement: "top",
            }}
            className="mt-8 mb-12 [&_.ant-slider-track]:!bg-[#82AE46] [&_.ant-slider-handle]:!border-[#82AE46]"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Giá tối thiểu"
            value={tempMinPrice}
            onChange={handleMinPriceChange}
            className="mt-4 hover:border-[#82AE46] focus:border-[#82AE46] focus:shadow-[0_0_0_2px_rgba(130,174,70,0.2)]"
            status={errorMessage ? "error" : ""}
            addonAfter="VND"
          />
          <span className="mt-4">-</span>
          <Input
            type="number"
            placeholder="Giá tối đa"
            value={tempMaxPrice}
            onChange={handleMaxPriceChange}
            className="mt-4 hover:border-[#82AE46] focus:border-[#82AE46] focus:shadow-[0_0_0_2px_rgba(130,174,70,0.2)]"
            status={errorMessage ? "error" : ""}
            addonAfter="VND"
          />
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className="!p-2"
          />
        )}
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
