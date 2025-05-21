import { Modal } from "antd";
import { useEffect, useState } from "react";
import {
  addNewAddress,
  deleteAddress,
  getAddressesByUserId,
  updateAddress,
} from "../../../services/UserService";

const AddressForm = ({ isModal = false, onAddressAdded = null }) => {
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

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const addressesPerPage = 3;

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    if (userID && !isModal) {
      fetchUserAddress();
    }

    // If we're in modal mode, always show the form
    if (isModal) {
      setShowForm(true);
    }
  }, [userID, isModal]);

  const fetchUserAddress = async () => {
    try {
      const userAddress = await getAddressesByUserId(userID);
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
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const isDuplicateAddress = (newAddress) => {
    return addresses.some(
      (addr) =>
        addr.city === newAddress.city &&
        addr.district === newAddress.district &&
        addr.ward === newAddress.ward &&
        addr.street === newAddress.street
    );
  };

  // Add a validation function to check all required fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!address.city.trim()) {
      newErrors.city = "Vui lòng nhập tên thành phố";
      isValid = false;
    }

    if (!address.district.trim()) {
      newErrors.district = "Vui lòng nhập tên quận/huyện";
      isValid = false;
    }

    if (!address.ward.trim()) {
      newErrors.ward = "Vui lòng nhập tên phường/xã";
      isValid = false;
    }

    if (!address.street.trim()) {
      newErrors.street = "Vui lòng nhập địa chỉ cụ thể";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update handleSubmit to validate form first
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      handleUpdateAddress(e);
    } else {
      setSuccessMessage("");
      setErrorMessage("");

      // Validate form before submission
      if (!validateForm()) {
        setErrorMessage(" Vui lòng nhập đầy đủ thông tin địa chỉ");
        return;
      }

      if (!isModal && isDuplicateAddress(address)) {
        setErrorMessage(" Địa chỉ này đã tồn tại trong danh sách của bạn!");
        return;
      }

      try {
        const data = {
          userID: userID,
          city: address.city,
          district: address.district,
          ward: address.ward,
          street: address.street,
          isDefault: address.isDefault || false,
        };

        const response = await addNewAddress(data);

        if (response) {
          setSuccessMessage("✅ Địa chỉ đã được thêm thành công!");

          const newAddress = {
            ...address,
            isDefault: address.isDefault || false,
          };

          setAddresses((prevAddresses) => {
            if (address.isDefault) {
              return [newAddress, ...prevAddresses];
            }
            return [...prevAddresses, newAddress];
          });

          // Reset form
          setAddress({
            city: "",
            district: "",
            ward: "",
            street: "",
            isDefault: false,
          });

          // If we're in modal mode and have a callback, call it
          if (isModal && onAddressAdded) {
            onAddressAdded(response);
          } else {
            setShowForm(false);
          }
        } else {
          setErrorMessage(
            "❌ Lỗi khi thêm địa chỉ: " + (response?.message || "")
          );
        }
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          setErrors(error.response.data.errors || {});
        } else {
          setErrorMessage("❌ Lỗi khi gửi yêu cầu API, vui lòng thử lại.");
          console.error("Lỗi API:", error);
        }
      }
    }
  };

  // Bắt đầu chỉnh sửa địa chỉ
  const handleEdit = (addr) => {
    setAddress({
      city: addr.city,
      district: addr.district,
      ward: addr.ward,
      street: addr.street,
      isDefault: addr.isDefault || false,
    });
    setEditingAddressId(addr.id || addr._id);
    setShowForm(true);
    setIsEditing(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Hủy chỉnh sửa địa chỉ
  const handleCancelEdit = () => {
    setAddress({
      city: "",
      district: "",
      ward: "",
      street: "",
      isDefault: false,
    });

    // If we're in modal mode and have a callback, call it to close the modal
    if (isModal && onAddressAdded) {
      onAddressAdded();
    } else {
      setShowForm(false);
    }

    setIsEditing(false);
    setEditingAddressId(null);
  };

  // Add this new function to check for duplicates during update
  const isDuplicateForUpdate = (updatedAddress, currentAddressId) => {
    return addresses.some(
      (addr) =>
        addr.city === updatedAddress.city &&
        addr.district === updatedAddress.district &&
        addr.ward === updatedAddress.ward &&
        addr.street === updatedAddress.street &&
        (addr.id || addr._id) !== currentAddressId // Exclude the current address being edited
    );
  };

  // Update handleUpdateAddress to check for duplicates
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form before updating
    if (!validateForm()) {
      setErrorMessage(" Vui lòng nhập đầy đủ thông tin địa chỉ");
      return;
    }

    // Check for duplicates, excluding the current address being edited
    if (isDuplicateForUpdate(address, editingAddressId)) {
      setErrorMessage(" Địa chỉ này đã tồn tại trong danh sách của bạn!");
      return;
    }

    try {
      const data = {
        city: address.city,
        district: address.district,
        ward: address.ward,
        street: address.street,
        isDefault: address.isDefault || false,
      };

      const response = await updateAddress(editingAddressId, userID, data);

      if (response) {
        setSuccessMessage("✅ Địa chỉ đã được cập nhật thành công!");

        // Cập nhật lại danh sách địa chỉ trong state
        if (!isModal) {
          await fetchUserAddress();
        }

        // Reset form
        setAddress({
          city: "",
          district: "",
          ward: "",
          street: "",
          isDefault: false,
        });

        // If we're in modal mode and have a callback, call it
        if (isModal && onAddressAdded) {
          onAddressAdded(response);
        } else {
          setShowForm(false);
        }

        setIsEditing(false);
        setEditingAddressId(null);
      } else {
        setErrorMessage("❌ Lỗi khi cập nhật địa chỉ!");
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrorMessage("❌ Lỗi khi gửi yêu cầu API, vui lòng thử lại.");
        console.error("Lỗi API:", error);
      }
    }
  };

  // Xóa địa chỉ
  const handleDeleteAddress = (addressID) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteAddress(addressID, userID);

          if (response) {
            setSuccessMessage("✅ Đã xóa địa chỉ thành công!");
            // Cập nhật lại danh sách địa chỉ
            await fetchUserAddress();
          } else {
            setErrorMessage("❌ Không thể xóa địa chỉ!");
          }
        } catch (error) {
          setErrorMessage("❌ Lỗi khi xóa địa chỉ, vui lòng thử lại.");
          console.error("Lỗi khi xóa địa chỉ:", error);
        }
      },
    });
  };

  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;
  const currentAddresses = addresses.slice(
    indexOfFirstAddress,
    indexOfLastAddress
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // If in modal mode, only show the form part
  if (isModal) {
    return (
      <div className="bg-white p-4">
        {successMessage && (
          <div className="text-green-600 font-semibold text-center mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="text-red-600 font-semibold text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

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
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
          </div>

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
            {errors.ward && (
              <p className="text-red-500 text-sm">{errors.ward}</p>
            )}
          </div>

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
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street}</p>
            )}
          </div>

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

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition">
              {isEditing ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full py-2 rounded-md text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 transition">
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Non-modal view (original component)
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        Địa chỉ của bạn
      </h2>

      {successMessage && (
        <div className="text-green-600 font-semibold text-center mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-600 font-semibold text-center mb-4">
          {errorMessage}
        </div>
      )}

      {!showForm && currentAddresses.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {currentAddresses.map((addr, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md border ${
                addr.isDefault
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-100"
              }`}>
              <p>
                <strong>Thành phố:</strong> {addr.city}
              </p>
              <p>
                <strong>Quận/Huyện:</strong> {addr.district}
              </p>
              <p>
                <strong>Phường/Xã:</strong> {addr.ward}
              </p>
              <p>
                <strong>Địa chỉ cụ thể:</strong> {addr.street}
              </p>

              {addr.default && (
                <span className="mt-2 inline-block bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                  ✅ Mặc định
                </span>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(addr)}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr.id || addr._id)}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setSuccessMessage("");
            setErrorMessage("");
          }}
          className="mt-2 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition">
          Thêm địa chỉ mới
        </button>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

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
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
          </div>

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
            {errors.ward && (
              <p className="text-red-500 text-sm">{errors.ward}</p>
            )}
          </div>

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
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street}</p>
            )}
          </div>

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
            className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition">
            {isEditing ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
          </button>

          {/* Add cancel button for both adding and editing */}
          <button
            type="button"
            onClick={handleCancelEdit}
            className="mt-2 w-full py-2 rounded-md text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 transition">
            {isEditing ? "Hủy" : "Đóng"}
          </button>
        </form>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400">
          Trang trước
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * addressesPerPage >= addresses.length}
          className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400">
          Trang tiếp
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
