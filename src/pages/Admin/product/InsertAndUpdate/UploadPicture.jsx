import { message } from "antd";

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