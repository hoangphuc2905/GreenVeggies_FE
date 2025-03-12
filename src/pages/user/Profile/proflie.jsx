import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../../redux/userSlice";
import { updateUserInfo } from "../../../api/api";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || "https://i.imgur.com/TdZ9vVu.png"
  );
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user && userID && token) {
      dispatch(fetchUser({ userID, token })).catch((error) => {
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

  // Handle avatar change
  const handlerChange = (info) => {
    if (info.file.status === "done") {
      // Success, set preview
      const imageUrl = info.file.response.secure_url; // Cloudinary provides the uploaded image URL
      setAvatarPreview(imageUrl);
      setEditedUser({ ...editedUser, avatar: imageUrl }); // Update editedUser with avatar URL
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Prevent automatic upload, this is a hook to modify the file before upload
  const handlerBeforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2; // Limit the file size to 2MB
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  // Age validation function
  const isValidAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      return age - 1;
    }
    return age;
  };

  // Phone number validation function
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/; // Must start with 0 and be followed by exactly 9 digits
    return phoneRegex.test(phone);
  };

  // Handle save and call API
  const handleSave = async () => {
    const formData = new FormData();
    let formErrors = {};

    // Validate age (must be greater than 12)
    const age = isValidAge(editedUser.dateOfBirth);
    if (age < 12) {
      formErrors.dateOfBirth = "Bạn phải lớn hơn 12 tuổi.";
    }

    // Validate phone number (must be 10 digits starting with 0)
    if (!isValidPhoneNumber(editedUser.phone)) {
      formErrors.phone = "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setErrorMessage(""); // Clear general error message
      setSuccessMessage(""); // Clear success message
      return; // Prevent submission if there are errors
    }

    // Append fields to FormData (exclude email for editing)
    formData.append("username", editedUser.username);
    formData.append("phone", editedUser.phone);
    formData.append("email", editedUser.email); // Email is not editable but should be sent as part of formData
    formData.append("dateOfBirth", editedUser.dateOfBirth);

    if (editedUser.avatar && editedUser.avatar.startsWith("http")) {
      formData.append("avatar", editedUser.avatar); // If avatar is a URL, append it as is
    }

    // Call the updateUserInfo function with FormData
    const updatedUser = await updateUserInfo(userID, token, formData);

    if (updatedUser) {
      setIsEditing(false); // Exit editing mode if the update was successful
      setSuccessMessage("Cập nhật thông tin thành công!");
      setErrorMessage(""); // Clear error message
      setTimeout(() => {
        setSuccessMessage(""); // Clear success message after 3 seconds
      }, 3000);
    } else {
      setErrorMessage("Cập nhật thông tin thất bại.");
      setSuccessMessage(""); // Clear success message
      setTimeout(() => {
        setErrorMessage(""); // Clear error message after 3 seconds
      }, 3000);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditedUser(user);
    setAvatarPreview(user?.avatar || "https://i.imgur.com/TdZ9vVu.png");
    setIsEditing(false);
    setErrors({}); // Clear errors when canceling
    setSuccessMessage(""); // Clear success message
    setErrorMessage(""); // Clear error message
  };

  // Handle input change for fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });

    // Clear the error for phone number when user starts typing
    if (name === "phone" && isValidPhoneNumber(value)) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.phone; // Remove phone error if valid
        return updatedErrors;
      });
    }

    // Clear the error for dateOfBirth when user starts typing
    if (name === "dateOfBirth" && isValidAge(value) >= 12) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.dateOfBirth; // Remove age error if valid
        return updatedErrors;
      });
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-4">Thông tin cá nhân</h2>

      {/* Avatar + Chọn ảnh */}
      <div className="flex flex-col items-center mb-4">
        {isEditing ? (
          <Upload
            multiple={false}
            action="https://api.cloudinary.com/v1_1/dze57n4oa/image/upload"
            listType="picture-card"
            accept="image/*"
            data={() => ({ upload_preset: "ml_default" })}
            beforeUpload={handlerBeforeUpload}
            onChange={handlerChange}
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        ) : (
          <img
            src={avatarPreview}
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-gray-300 shadow-md object-cover"
          />
        )}
      </div>

      {/* User Info Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {user ? (
          <>
            {["username", "phone", "email", "dateOfBirth"].map(
              (field, index) => (
                <div key={index} className="grid grid-cols-2 border-b">
                  <div className="p-3 font-semibold border-r">
                    {field === "username" && "Họ và tên:"}
                    {field === "phone" && "Số điện thoại:"}
                    {field === "email" && "Email:"}
                    {field === "dateOfBirth" && "Ngày sinh:"}
                  </div>
                  <div className="p-3">
                    {field === "email" ? (
                      // Email is not editable
                      <span>{editedUser.email}</span>
                    ) : isEditing ? (
                      <input
                        type={field === "dateOfBirth" ? "date" : "text"}
                        name={field}
                        value={
                          field === "dateOfBirth"
                            ? editedUser.dateOfBirth
                              ? new Date(editedUser.dateOfBirth)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                            : editedUser[field]
                        }
                        onChange={handleInputChange}
                        className={`w-full border px-2 py-1 rounded-md focus:ring-2 focus:ring-green-300 ${
                          errors[field] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    ) : field === "dateOfBirth" ? (
                      editedUser.dateOfBirth ? (
                        new Date(editedUser.dateOfBirth).toLocaleDateString()
                      ) : (
                        "Không có dữ liệu"
                      )
                    ) : (
                      editedUser[field]
                    )}
                    {/* Display error messages */}
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">Đang tải thông tin...</p>
        )}
      </div>

      {/* Button Sửa, Lưu & Hủy */}
      <div className="mt-4 flex gap-3">
        {isEditing ? (
          <>
            <button
              className="flex-1 py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
              onClick={handleSave}
            >
              Lưu
            </button>
            <button
              className="flex-1 py-2 rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500 transition"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            className="w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition"
            onClick={() => setIsEditing(true)}
          >
            Sửa thông tin
          </button>
        )}
      </div>

      {/* Display success or error message */}
      {successMessage && (
        <p className="text-green-500 text-center mt-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </>
  );
};

export default Profile;
