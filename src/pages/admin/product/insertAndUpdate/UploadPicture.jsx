import { message } from "antd";
import { deleteImage } from "../../../../api/api";


export const handlerBeforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("Chỉ được tải lên file hình ảnh!");
    return false;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const newFile = new File([reader.result], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      resolve(newFile);
    };
    reader.onerror = () => {
      message.error("Lỗi khi đọc file ảnh!");
      reject(false);
    };
  });
};

export const handlerChange = (info) => {
  if (info.file.status === "done") {
    const imageUrl = info.file.response?.secure_url;
    if (imageUrl) {
      message.success(`Tải lên thành công: ${info.file.name}`);
      console.log("Cloudinary URL:", imageUrl);
    } else {
      message.error("Không tìm thấy URL ảnh trong phản hồi");
      console.log("Response lỗi:", info.file.response);
    }
  } else if (info.file.status === "error") {
    message.error(`Tải lên thất bại: ${info.file.name}`);
    console.error("Lỗi upload:", info.file.response);
  }
};

export const handlePreview = async (
  file,
  setPreviewImage,
  setPreviewOpen,
  setPreviewTitle
) => {
  setPreviewImage(file.url || file.thumbUrl);
  setPreviewOpen(true);
  setPreviewTitle(
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
  );
};
export const handleRemove = async (file) => {
  const imageUrl = file.url || file.response?.secure_url;
  if (!imageUrl) {
    message.error("Không tìm thấy URL ảnh để xóa");
    return;
  }

  const publicId = imageUrl
    .substring(imageUrl.lastIndexOf("/") + 1)
    .split(".")[0];
  console.log("publicId:", publicId);

  try {
    const data = await deleteImage(publicId);
    if (data?.message === "Xóa ảnh thành công!") {
      message.success("Xóa ảnh thành công!");
      console.log("Delete image:", data);
    } else {
      message.error(data?.message || "Xóa ảnh thất bại!");
      console.error("Error:", data);
    }
  } catch (error) {
    message.error("Lỗi khi xóa ảnh!");
    console.error("Error:", error);
    console.log("Response:", error.response?.data || error.message);
  }
};
