import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Select,
  Upload,
  Row,
  Col,
  ConfigProvider,
  App,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getListProducts, updateProduct } from "../../../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import FormInsertCategory from "../../category/insert";
import InsertStockEntry from "../../StockEntry/insert";


const { TextArea } = Input;

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

// Hàm fetch danh mục

const UpdateForm = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);

  const location = useLocation();
  const product = location.state?.product; // Lấy product từ location.state

  const fetchCategories = async () => {
    try {
      const response = await getListProducts("categories");
      setCategories(response);
    } catch (error) {
      message.error("Lỗi tải danh mục!");
    }
  };

  const openInsertStockEntry = () => {
    setIsStockEntryOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryAdded = async () => {
    await fetchCategories();
  };

  const openInsertCategory = () => {
    console.log("Open modal");
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (product) {
      if (categories.length > 0) {
        const selectedCategory = categories.find(
          (cat) => cat._id === product.category?._id
        );
        form.setFieldsValue({
          name: product.name || "",
          category: selectedCategory?._id || null,
          origin: product.origin || "",
          description: product.description || "",
          unit: product.unit || "piece",
          status: product.status || "available",
          imageUrl: product.imageUrl
            ? product.imageUrl.map((url, index) => ({
                uid: index,
                name: `image-${index}`,
                url,
                status: "done",
              }))
            : [],
        });
      }
    }
  }, [product, categories]); // Chạy lại khi product hoặc categories thay đổi

  const handlerUpdateProduct = async (values) => {
    try {
      setLoading(true);
      const imageUrls =
        values.imageUrl?.map((file) => file.url || file.response?.url) || [];
      const formData = { ...values, sold: 0, imageUrl: imageUrls };
      const response = await updateProduct(product.productID, formData);
      if (response) {
        message.success("Cập nhật sản phẩm thành công!");
        setTimeout(() => navigate("/admin/products"), 1000);
      } else {
        message.error("Cập nhật thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="h-fit">
      <div className="w-full bg-white rounded-md px-[3%] py-[1%] shadow-md">
        <Flex gap="middle" vertical>
          <Form
            form={form}
            size="middle"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            layout="horizontal"
            style={{ maxWidth: "100%" }}
            onFinish={handlerUpdateProduct}
            validateMessages={validateMessages}
            initialValues={{ status: "available", quantity: 0 }}
          >
            <Flex className="mb-[10vh]" justify="space-between" align="center">
              <div className="text-2xl text-[#82AE46] font-bold">
                Chỉnh sửa thông tin sản phẩm
              </div>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      defaultBg: "#82AE46",
                      defaultColor: "#ffffff",
                      defaultBorderColor: "#82AE46",

                      defaultHoverBg: "#6D9539",
                      defaultHoverColor: "#ffffff",
                      defaultHoverBorderColor: "#6D9539",
                      defaultActiveBg: "#5A7E30",
                      defaultActiveColor: "#ffffff",
                      defaultActiveBorderColor: "#5A7E30",
                      contentFontSize: "17px",
                    },
                  },
                }}
              >
                <div className="flex justify-center gap-5">
                  <Button
                    type="default"
                    className="h-12 w-44 px-10 font-medium"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </Button>{" "}
                  <Button
                    type="default"
                    htmlType="submit"
                    className="h-12 w-44 px-10 font-medium"
                    loading={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button
                    type="default"
                    htmlType="button"
                    className="h-12 w-44 px-10 font-medium"
                    onClick={openInsertStockEntry}
                  >
                    Nhập hàng
                  </Button>
                </div>
              </ConfigProvider>
            </Flex>
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
                    <Select
                      defaultValue={product.category?._id}
                      placeholder="Chọn danh mục"
                      onChange={(value) =>
                        console.log("Selected category ID:", value)
                      }
                    >
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
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đơn vị"
                  name="unit"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="piece">Cái</Select.Option>
                    <Select.Option value="kg">Kg</Select.Option>
                    <Select.Option value="gram">Gram</Select.Option>
                    <Select.Option value="liter">Lít</Select.Option>
                    <Select.Option value="ml">Ml</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Select className="w-full">
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
                <Form.Item
                  label="Hình minh họa"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="imageUrl"
                >
                  <Upload
                    multiple={true}
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
                          message.success(
                            `Tải lên thành công: ${info.file.name}`
                          );
                          console.log("Cloudinary URL:", imageUrl);
                        } else {
                          message.error(
                            "Không tìm thấy URL ảnh trong phản hồi"
                          );
                          console.log("Response lỗi:", info.file.response);
                        }
                      } else if (info.file.status === "error") {
                        message.error(`Tải lên thất bại: ${info.file.name}`);
                        console.error("Lỗi upload:", info.file.response);
                      }
                    }}
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* Modal thêm danh mục */}
          <FormInsertCategory
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCategoryAdded={handleCategoryAdded}
          />

          <InsertStockEntry
            isOpen={isStockEntryOpen}
            onClose={() => setIsStockEntryOpen(false)}
          ></InsertStockEntry>
        </Flex>
      </div>
    </Layout>
  );
};

UpdateForm.propTypes = { product: PropTypes.object };
export default UpdateForm;
