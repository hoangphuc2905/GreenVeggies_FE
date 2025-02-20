import {
    Button,
    Col,
    ConfigProvider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Upload,
  } from "antd";
  import { PlusOutlined } from "@ant-design/icons";
  import TextArea from "antd/es/input/TextArea";
  import PropTypes from "prop-types";
  import { useState, useEffect } from "react";
  import { getListProducts } from "../../../../api/api";
  
  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList ?? []);
  
  const STATUS_OPTIONS = [
    {
      value: "available",
      label: "Còn hàng",
      color: "text-green-600",
      dot: "bg-green-500",
    },
    {
      value: "unavailable",
      label: "Không bán",
      color: "text-gray-500",
      dot: "bg-gray-400",
    },
    {
      value: "out_of_stock",
      label: "Hết hàng",
      color: "text-red-500",
      dot: "bg-red-500",
    },
  ];
  
  const validateMessages = {
    required: "${label} không được để trống!",
    types: { number: "${label} phải là số hợp lệ!" },
  };
  
  const InputForm = ({ onFinish, loading, categories, openInsertCategory }) => {
    return (
      <Form
        size="middle"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        style={{ maxWidth: "100%" }}
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={{ status: "available", quantity: 0 }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Loại danh mục" name="category">
              <div className="flex items-center gap-2">
                <Select className="flex-1">
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
                <button
                  onClick={openInsertCategory}
                  type="button"
                  className="text-[#82AE46] bg-none  w-12 h-12 flex items-center justify-center  hover:text-[#34C759]"
                >
                  <PlusOutlined className="text-4xl font-extrabold" />
                </button>
              </div>
            </Form.Item>
  
            <Form.Item
              label="Nguồn gốc"
              name="origin"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <TextArea rows={8} />
            </Form.Item>
            <Form.Item
              label="Hình minh họa"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              name="imageUrl"
            >
              <Upload
                action="https://api.cloudinary.com/v1_1/dze57n4oa/image/upload"
                listType="picture-card"
                accept="image/*"
                data={() => ({ upload_preset: "ml_default" })}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Chỉ được tải lên file hình ảnh!");
                    return false;
                  }
  
                  return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      canvas.width = 768;
                      canvas.height = 768;
                      ctx.drawImage(img, 0, 0, 768, 768);
  
                      canvas.toBlob((blob) => {
                        if (blob) {
                          const resizedFile = new File([blob], file.name, {
                            type: file.type,
                          });
                          resolve(resizedFile);
                        } else {
                          message.error("Lỗi khi resize ảnh!");
                          reject(false);
                        }
                      }, file.type);
                    };
                    img.onerror = () => {
                      message.error("Không thể đọc file ảnh!");
                      reject(false);
                    };
                  });
                }}
                onChange={(info) => {
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
                }}
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá nhập"
              name="price"
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 0,
                  message: "Giá nhập không hợp lệ!",
                },
              ]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
  
            <Form.Item
              label="Số lượng nhập"
              name="import"
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 0,
                  message: "Tồn kho không hợp lệ!",
                },
              ]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item label="Tồn kho">
              <InputNumber
                className="w-full"
                value={0}
                disabled={true}
                placeholder="0"
              />
            </Form.Item>
            <Form.Item label="Đơn vị" name="unit" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="piece">Cái</Select.Option>
                <Select.Option value="kg">Kg</Select.Option>
                <Select.Option value="gram">Gram</Select.Option>
                <Select.Option value="liter">Lít</Select.Option>
                <Select.Option value="ml">Ml</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái" name="status">
              <Select disabled={true} defaultValue="available" className="w-full">
                {STATUS_OPTIONS.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    <div className="flex items-center gap-2 font-bold">
                      <div
                        className={`${option.dot} w-4 h-4 ml-1 blur-[2px] rounded-full relative`}
                      />
                      <span className={option.color}>{option.label}</span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };
  
  InputForm.propTypes = {
    onFinish: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
    openInsertCategory: PropTypes.func.isRequired,
  };
  
  export default InputForm;