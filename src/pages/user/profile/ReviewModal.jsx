import React, { useState } from "react";
import { StarFilled, PlusOutlined } from "@ant-design/icons";
import { Image, message, Upload, notification, Modal } from "antd";
import { createReview } from "../../../services/ReviewService";
import { cloundinaryURL, cloundinaryPreset } from "../../../api/api";

const ReviewModal = ({ product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // Lưu trữ danh sách URL
  const [fileList, setFileList] = useState([]); // Quản lý danh sách file cho Upload
  const [previewImage, setPreviewImage] = useState(""); // URL của hình ảnh đang preview
  const [previewOpen, setPreviewOpen] = useState(false); // Trạng thái mở modal preview
  const [validationError, setValidationError] = useState(""); // Thông báo lỗi
  const [ratingError, setRatingError] = useState(false); // Lỗi cho trường đánh giá
  const [commentError, setCommentError] = useState(false); // Lỗi cho trường bình luận

  // Xử lý khi người dùng thêm/xóa hình ảnh
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Cập nhật imageUrls từ fileList
    const urls = newFileList
      .map((file) => file.response?.secure_url || file.url)
      .filter(Boolean);
    setImageUrls(urls);

    // Hiển thị thông báo khi upload thành công hoặc thất bại
    const lastFile = newFileList[newFileList.length - 1];
    if (lastFile?.status === "done") {
      message.success(`Tải lên thành công: ${lastFile.name}`);
    } else if (lastFile?.status === "error") {
      message.error(`Tải lên thất bại: ${lastFile.name}`);
    }
  };

  // Xử lý khi người dùng nhấn vào hình ảnh để xem trước
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.response?.secure_url || file.thumbUrl);
    setPreviewOpen(true);
  };

  // Kiểm tra trước khi upload (giới hạn loại file và dung lượng)
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên file hình ảnh!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5; // Giới hạn 5MB
    if (!isLt5M) {
      message.error("Hình ảnh phải nhỏ hơn 5MB!");
      return false;
    }

    return true;
  };

  // Hàm gửi đánh giá
  const handleSubmit = async () => {
    let hasError = false;

    if (!rating) {
      setRatingError(true);
      hasError = true;
    } else {
      setRatingError(false);
    }

    if (!comment) {
      setCommentError(true);
      hasError = true;
    } else {
      setCommentError(false);
    }

    if (hasError) {
      setValidationError(
        "Vui lòng điền đầy đủ thông tin trước khi gửi đánh giá."
      );
      return;
    }

    setValidationError(""); // Xóa thông báo lỗi nếu hợp lệ

    const reviewData = {
      userID: localStorage.getItem("userID"),
      productID: product.productID,
      rating,
      comment,
      imageUrl: imageUrls,
    };

    console.log("Submitting review data:", reviewData);

    if (
      !reviewData.userID ||
      !reviewData.productID ||
      !reviewData.rating ||
      !reviewData.comment
    ) {
      message.error("Vui lòng điền đầy đủ thông tin trước khi gửi đánh giá.");
      return;
    }

    try {
      await createReview(reviewData);
      message.success("Đánh giá của bạn đã được gửi thành công!");
      onSubmit(reviewData);
      onClose();
    } catch (error) {
      console.error("Error creating review:", error);

      // Kiểm tra lỗi 429 - Too Many Requests
      if (error.status === 429) {
        // Sử dụng Modal thay vì notification để đảm bảo hiển thị trên cùng
        Modal.error({
          title: "Quá nhiều yêu cầu",
          content:
            error.message ||
            "BẠN ĐÃ GỬI QUÁ NHIỀU ĐÁNH GIÁ TRONG VÒNG 1 PHÚT VUI LÒNG GỬI LẠI SAU",
          centered: true,
          zIndex: 9999999,
          maskStyle: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        });
      } else {
        message.error(
          error.message || "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại."
        );
      }
    }
  };

  // Nút upload tùy chỉnh
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải hình lên</div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <h3 className="text-lg font-bold mb-4">Đánh giá sản phẩm</h3>
        <div className="mb-4">
          <img
            src={product.imageUrl?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-16 h-16 object-cover rounded mb-2"
          />
          <p className="text-md font-semibold">{product.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Đánh giá:</label>
          <div
            className={`flex space-x-1 ${
              ratingError ? "border border-red-500 rounded p-1" : ""
            }`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarFilled
                key={star}
                onClick={() =>
                  setRating((prev) => (prev === star ? star - 1 : star))
                }
                style={{
                  fontSize: "24px",
                  color: star <= rating ? "gold" : "#ccc",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bình luận:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`w-full border rounded px-2 py-1 ${
              commentError ? "border-red-500" : ""
            }`}
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Hình ảnh (tối đa 8):
          </label>
          <Upload
            action={cloundinaryURL}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            data={{ upload_preset: cloundinaryPreset }} // Thêm upload_preset cho Cloudinary
            accept="image/*" // Chỉ chấp nhận file hình ảnh
            multiple // Cho phép tải lên nhiều hình
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
        <div className="flex justify-end space-x-2">
          {validationError && (
            <p className="text-red-500 text-sm mb-2">{validationError}</p>
          )}
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-100 text-green-500 px-4 py-2 rounded hover:bg-green-200">
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
