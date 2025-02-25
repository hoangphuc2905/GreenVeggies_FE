import { useState, useEffect } from "react";
import axios from "axios";

const AddressForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    userID: "123456",
    city: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });

  const defaultAddress = {
    city: "Hồ Chí Minh",
    district: "Gò Vấp",
    ward: "Phường 1",
    street: "12 Phạm Văn Bảo",
  };

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Lỗi khi tải tỉnh/thành phố:", err));
  }, []);

  // Fetch danh sách quận/huyện khi chọn tỉnh
  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setAddress((prev) => ({ ...prev, city: selectedCity, district: "", ward: "" }));
    
    if (!selectedCity) {
      setDistricts([]);
      setWards([]);
      return;
    }

    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${selectedCity}?depth=2`);
      setDistricts(res.data.districts || []);
      setWards([]);
    } catch (error) {
      console.error("Lỗi khi tải quận/huyện:", error);
    }
  };

  // Fetch danh sách phường/xã khi chọn quận/huyện
  const handleDistrictChange = async (e) => {
    const selectedDistrict = e.target.value;
    setAddress((prev) => ({ ...prev, district: selectedDistrict, ward: "" }));

    if (!selectedDistrict) {
      setWards([]);
      return;
    }

    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
      setWards(res.data.wards || []);
    } catch (error) {
      console.error("Lỗi khi tải phường/xã:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Address submitted:", address);
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Địa chỉ của bạn</h2>

      {!showForm && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <p className="text-gray-700"><strong>Thành phố:</strong> {defaultAddress.city}</p>
          <p className="text-gray-700"><strong>Quận/Huyện:</strong> {defaultAddress.district}</p>
          <p className="text-gray-700"><strong>Phường/Xã:</strong> {defaultAddress.ward}</p>
          <p className="text-gray-700"><strong>Địa chỉ cụ thể:</strong> {defaultAddress.street}</p>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
        >
          Thêm địa chỉ mới
        </button>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ID người dùng (Không cho nhập) */}
          <div>
            <label className="block text-gray-700">ID người dùng:</label>
            <input
              type="text"
              name="userID"
              value={address.userID}
              className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-200 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* Thành phố */}
          <div>
            <label className="block text-gray-700">Thành phố:</label>
            <select
              name="city"
              value={address.city}
              onChange={handleCityChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Chọn thành phố</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quận/Huyện */}
          <div>
            <label className="block text-gray-700">Quận/Huyện:</label>
            <select
              name="district"
              value={address.district}
              onChange={handleDistrictChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              required
              disabled={!districts.length}
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phường/Xã */}
          <div>
            <label className="block text-gray-700">Phường/Xã:</label>
            <select
              name="ward"
              value={address.ward}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              required
              disabled={!wards.length}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          {/* Địa chỉ cụ thể */}
          <div>
            <label className="block text-gray-700">Địa chỉ cụ thể:</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Địa chỉ mặc định */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={address.isDefault}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Đánh dấu là địa chỉ mặc định</label>
          </div>

          <button type="submit" className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition">
            Lưu địa chỉ
          </button>
        </form>
      )}
    </div>
  );
};

export default AddressForm;
