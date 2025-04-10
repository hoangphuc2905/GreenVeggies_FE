import { useState, useEffect } from "react";
import axios from "axios";
import { getAddressByID } from "../../../api/api";

const AddressForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [userID, setUserID] = useState(localStorage.getItem("userID") || "");
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState({
    city: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});  // Lỗi từ BE sẽ được lưu ở đây

  // Thông tin phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const addressesPerPage = 3;

  // Gọi API khi userID hợp lệ
  useEffect(() => {
    if (userID) {
      fetchUserAddress();
    }
  }, [userID]);

  const fetchUserAddress = async () => {
    try {
      const userAddress = await getAddressByID(userID);
      
      if (userAddress && Array.isArray(userAddress) && userAddress.length > 0) {
        setAddresses(userAddress); 
      } else if (userAddress && typeof userAddress === "object") {
        setAddresses([userAddress]);
      } else {
        setAddresses([]); 
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy địa chỉ từ API:", error);
      setAddresses([]); 
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Reset lỗi khi người dùng sửa
  };

  // Kiểm tra xem địa chỉ mới có trùng với địa chỉ đã có không
  const isDuplicateAddress = (newAddress) => {
    return addresses.some(
      (addr) =>
        addr.city === newAddress.city &&
        addr.district === newAddress.district &&
        addr.ward === newAddress.ward &&
        addr.street === newAddress.street
    );
  };

  // Gửi API POST để thêm địa chỉ mới
  const handleSubmit = async (e) => {
    e.preventDefault();


    // Kiểm tra trùng địa chỉ
    if (isDuplicateAddress(address)) {
      alert("❌ Địa chỉ này đã tồn tại trong danh sách của bạn!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8004/api/address", {
        userID: userID,
        city: address.city,
        district: address.district,
        ward: address.ward,
        street: address.street,
        isDefault: address.isDefault || false,
      });

      if (response.status === 201) {
        alert("✅ Địa chỉ đã được thêm thành công!");

        // Thêm địa chỉ vào danh sách và đánh dấu nếu là địa chỉ mặc định
        const newAddress = {
          ...address,
          isDefault: address.isDefault || false,
        };

        // Cập nhật danh sách địa chỉ
        setAddresses((prevAddresses) => {
          if (address.isDefault) {
            return [newAddress, ...prevAddresses];
          }
          return [...prevAddresses, newAddress];
        });

        setShowForm(false); // Đóng form sau khi thêm
      } else {
        alert("❌ Lỗi khi thêm địa chỉ: " + response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        setErrors(error.response.data.errors || {});  // Lỗi từ BE sẽ được lưu vào state errors
      } else {
        alert("❌ Lỗi khi gửi yêu cầu API, vui lòng thử lại.");
        console.error("Lỗi API:", error);
      }
    }
  };

  // Tính chỉ số bắt đầu và kết thúc để phân trang
  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = addresses.slice(indexOfFirstAddress, indexOfLastAddress);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Địa chỉ của bạn</h2>

      {/* Hiển thị địa chỉ hiện có */}
      {!showForm && currentAddresses.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {currentAddresses.map((addr, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md border ${
                addr.isDefault ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-100"
              }`}
            >
              <p><strong>Thành phố:</strong> {addr.city}</p>
              <p><strong>Quận/Huyện:</strong> {addr.district}</p>
              <p><strong>Phường/Xã:</strong> {addr.ward}</p>
              <p><strong>Địa chỉ cụ thể:</strong> {addr.street}</p>

              {addr.default && (
                <span className="mt-2 inline-block bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                  ✅ Mặc định
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nút thêm địa chỉ */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
        >
          Thêm địa chỉ mới
        </button>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Thành phố */}
          <div>
            <label className="block text-gray-700">Thành phố:</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>

          {/* Quận/Huyện */}
          <div>
            <label className="block text-gray-700">Quận/Huyện:</label>
            <input
              type="text"
              name="district"
              value={address.district}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 ${
                errors.district ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
          </div>

          {/* Phường/Xã */}
          <div>
            <label className="block text-gray-700">Phường/Xã:</label>
            <input
              type="text"
              name="ward"
              value={address.ward}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 ${
                errors.ward ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
          </div>

          {/* Địa chỉ cụ thể */}
          <div>
            <label className="block text-gray-700">Địa chỉ cụ thể:</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 ${
                errors.street ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
          </div>

          {/* Địa chỉ mặc định */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={address.isDefault}
              onChange={handleChange}
              className="rounded focus:ring-2 focus:ring-green-500"
            />
            <label className="text-gray-700">Đặt làm địa chỉ mặc định</label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
          >
            Lưu địa chỉ
          </button>
        </form>
      )}

      {/* Phân trang */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        >
          Trang trước
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * addressesPerPage >= addresses.length}
          className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        >
          Trang tiếp
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
