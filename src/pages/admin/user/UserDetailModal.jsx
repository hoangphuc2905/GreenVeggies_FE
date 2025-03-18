import PropTypes from "prop-types";
import { Modal, Button, Image } from "antd";
import DefaultAVT from "../../../assets/default.png";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal
      title="Thông tin người dùng"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      {user && (
        <div className="flex flex-col items-center gap-4">
          {/* Avatar trên cùng, căn giữa */}
          <div className="w-36 h-36">
            <Image
              src={user.avatar || DefaultAVT}
              alt="Avatar"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
          </div>

          {/* Thông tin người dùng */}
          <div className="w-full px-20 space-y-2">
            <p>
              <strong className="text-gray-700">Tên:</strong> {user.username}
            </p>
            <p>
              <strong className="text-gray-700">Email:</strong> {user.email}
            </p>
            <p>
              <strong className="text-gray-700">Điện thoại:</strong>{" "}
              {user.phone}
            </p>
            <p>
              <strong className="text-gray-700">Ngày sinh:</strong>{" "}
              {user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </p>

            <p>
              <strong className="text-gray-700">Vai trò:</strong> {user.role}
            </p>
            <p>
              <strong className="text-gray-700">Trạng thái:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-md text-sm border font-medium
      ${
        user.accountStatus === "Active"
          ? "bg-[#f6ffed] text-[#8dbe6e] border-[#8dbe6e]"
          : user.accountStatus === "Inactive"
          ? "bg-[#fffbe6] text-[#d48806] border-[#d48806]"
          : "bg-[#fff1f0] text-[#cf1322] border-[#cf1322]"
      }
    `}
              >
                {user.accountStatus}
              </span>
            </p>
          </div>

          {/* Địa chỉ (nếu có) */}
          <div className="w-full px-20 text-left">
            <p>
              <strong className="text-gray-700">Địa chỉ:</strong>
              {user.address?.length > 0 ? (
                <div className="ml-4">
                  {user.address.map((addr) => (
                    <div
                      key={addr._id}
                      className="pl-2 border-l-2 border-gray-300"
                    >
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                      {addr.default && (
                        <span className="text-green-600 font-bold">
                          {" "}
                          (Mặc định)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                "Chưa cập nhật"
              )}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

// PropTypes để tránh lỗi ESLint
UserDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    dateOfBirth: PropTypes.string,
    role: PropTypes.string,
    accountStatus: PropTypes.string,
    avatar: PropTypes.string,
    address: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        street: PropTypes.string,
        ward: PropTypes.string,
        district: PropTypes.string,
        city: PropTypes.string,
        default: PropTypes.bool,
      })
    ),
  }),
};

export default UserDetailModal;
