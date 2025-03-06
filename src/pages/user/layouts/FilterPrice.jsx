import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

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
  setSearchParams,
}) => {
  const [searchParams] = useSearchParams();
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
        case "under500k":
          newMax = 500000;
          break;
        case "500kTo1m":
          newMin = 500000;
          newMax = 1000000;
          break;
        case "1mTo2m":
          newMin = 1000000;
          newMax = 2000000;
          break;
        case "above2m":
          newMin = 2000000;
          break;
        default:
          break;
      }

      setMinPrice(newMin);
      setMaxPrice(newMax);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("minPrice", newMin);
        params.set("maxPrice", newMax);
        return params;
      });
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

  return (
    <div className="p-4 border rounded-lg shadow-md mt-6 mb-6">
      <h3 className="text-white text-l font-bold uppercase tracking-wide text-center bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] rounded-xl p-4 shadow-lg hover:scale-105 transition duration-300 ease-in-out">
        Lọc theo giá
      </h3>
      <div className="flex flex-col space-y-4 mt-4">
        <label>
          <input
            type="radio"
            name="price"
            checked={selectedPriceRange === "under500k"}
            onChange={() => handlePriceRangeChange("under500k")}
          />
          Dưới 500K
        </label>
        <label>
          <input
            type="radio"
            name="price"
            checked={selectedPriceRange === "500kTo1m"}
            onChange={() => handlePriceRangeChange("500kTo1m")}
          />
          500K - 1M
        </label>
        <label>
          <input
            type="radio"
            name="price"
            checked={selectedPriceRange === "1mTo2m"}
            onChange={() => handlePriceRangeChange("1mTo2m")}
          />
          1M - 2M
        </label>
        <label>
          <input
            type="radio"
            name="price"
            checked={selectedPriceRange === "above2m"}
            onChange={() => handlePriceRangeChange("above2m")}
          />
          Trên 2M
        </label>
        <input
          type="number"
          placeholder="Giá tối thiểu"
          className="border px-3 py-2 rounded w-full"
          value={tempMinPrice}
          onChange={handleMinPriceChange}
        />
        <input
          type="number"
          placeholder="Giá tối đa"
          className="border px-3 py-2 rounded w-full"
          value={tempMaxPrice}
          onChange={handleMaxPriceChange}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          onClick={handleFilter}
          className="text-white text-l font-bold uppercase tracking-wide text-center bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] rounded-xl p-2 shadow-lg hover:scale-105 transition duration-300 ease-in-out">
          Tìm kiếm
        </button>
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
  setSearchParams: PropTypes.func.isRequired,
};

export default FilterPrice;
