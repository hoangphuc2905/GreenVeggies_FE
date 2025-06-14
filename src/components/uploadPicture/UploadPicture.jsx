import { message, Modal, Upload } from "antd";
import { cloundinaryPreset, cloundinaryURL } from "../../api/api.js";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

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

const UploadPicture = ({
  type = "product",
  fileList = [],
  onFileListChange,
  onImagesMarkedForDelete,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [files, setFiles] = useState(fileList);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    if (JSON.stringify(files) !== JSON.stringify(fileList)) {
      setFiles(fileList);
    }
  }, [fileList]);

  const handleChange = ({ fileList: newFileList, file }) => {
    setFiles(newFileList);
    onFileListChange(newFileList);

    if (file.status === "done") {
      message.success(`Tải lên thành công: ${file.name}`);
    } else if (file.status === "error") {
      message.error(`Tải lên thất bại: ${file.name}`);
    }

    if (newFileList.length > fileList.length) {
      message.success("Ảnh mới đã được thêm!");
    }
  };

  const handleRemove = async (file) => {
    const imageUrl = file.url || file.response?.secure_url;
    if (!imageUrl) {
      message.error("Không tìm thấy URL ảnh để xóa");
      return;
    }

    // Add the image to the removedImages list
    setRemovedImages((prev) => {
      const newRemovedImages = [...prev, imageUrl];
      onImagesMarkedForDelete(newRemovedImages);
      return newRemovedImages;
    });

    // Update the file list without deleting from Cloudinary
    const newFileList = files.filter((item) => item.uid !== file.uid);
    setFiles(newFileList);
    onFileListChange(newFileList);
  };

  return (
    <div>
      <Upload
        multiple
        action={cloundinaryURL}
        listType="picture-card"
        accept="image/*"
        data={() => ({ upload_preset: cloundinaryPreset })}
        beforeUpload={handlerBeforeUpload}
        onChange={handleChange}
        onPreview={(file) =>
          setPreviewImage(file.url || file.thumbUrl) ||
          setPreviewOpen(true) ||
          setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
          )
        }
        onRemove={handleRemove}
        fileList={files}
      >
        <button style={{ border: 0, background: "none" }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Tải hình lên</div>
        </button>
      </Upload>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadPicture;
