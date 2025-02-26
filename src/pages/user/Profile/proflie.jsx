import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, updateUser } from "../../../redux/userSlice"; // Action updateUser

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "https://i.imgur.com/TdZ9vVu.png");

  useEffect(() => {
    if (!user && userID && token) {
      dispatch(fetchUser({ userID, token }))
        
        .catch(error => {
          console.error("Failed to fetch user:", error);
        });
    }
  }, [dispatch, user, userID, token]);
  

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      setAvatarPreview(user.avatar || "https://i.imgur.com/TdZ9vVu.png");

    }
  }, [user]);

  // Xử lý chọn ảnh avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl); // Hiển thị ảnh trước khi tải lên
      setEditedUser({ ...editedUser, avatar: file }); // Lưu ảnh vào state để gửi lên server
    }
  };

  // Xử lý lưu thông tin
  const handleSave = () => {
    const formData = new FormData();
    formData.append("username", editedUser.username);
    formData.append("phone", editedUser.phone);
    formData.append("email", editedUser.email);
    formData.append("dateOfBirth", editedUser.dateOfBirth);
    formData.append("address", editedUser.address);
    if (editedUser.avatar instanceof File) {
      formData.append("avatar", editedUser.avatar); // Gửi ảnh lên server nếu có
    }

    dispatch(updateUser({ userID, token, updatedData: formData })); // Gửi dữ liệu lên server
    setIsEditing(false);
  };

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-4">Thông tin cá nhân</h2>

      {/* Avatar + Chọn ảnh */}
      <div className="flex flex-col items-center mb-4">
        <label htmlFor="avatarInput" className="relative cursor-pointer">
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-gray-300 shadow-md object-cover"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
              <span className="text-white text-sm">Chọn ảnh</span>
            </div>
          )}
        </label>
        {isEditing && (
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        )}
      </div>

      {/* User Info Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {user ? (
          <>
            <div className="grid grid-cols-2 border-b">
              <div className="p-3 font-semibold border-r">Họ và tên:</div>
              <div className="p-3">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                  />
                ) : (
                  user.username
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-3 font-semibold border-r">Số điện thoại:</div>
              <div className="p-3">
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                  />
                ) : (
                  user.phone
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-3 font-semibold border-r">Email:</div>
              <div className="p-3">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                  />
                ) : (
                  user.email
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-3 font-semibold border-r">Ngày sinh:</div>
              <div className="p-3">
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editedUser.dateOfBirth ? new Date(editedUser.dateOfBirth).toISOString().split("T")[0] : ""}
                    onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                  />
                ) : (
                  editedUser.dateOfBirth ? new Date(editedUser.dateOfBirth).toLocaleDateString() : "Không có dữ liệu"
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 border-b">
              <div className="p-3 font-semibold border-r">Địa chỉ:</div>
              <div className="p-3">
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedUser.address}
                    onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300"
                  />
                ) : (
                  user.address
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Đang tải thông tin...</p>
        )}
      </div>

      {/* Button Sửa & Lưu */}
      <button
        className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
      >
        {isEditing ? "Lưu" : "Sửa thông tin"}
      </button>
    </>
  );
};

export default Profile;