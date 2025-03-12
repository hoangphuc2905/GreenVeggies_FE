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
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getListProducts, insertProduct } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import FormInsertCategory from "../../category/FormInsertCategory";
import {
  handlerBeforeUpload,
  handlerChange,
  handlePreview,
  handleRemove,
} from "./UploadPicture";

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
// Message hiển thị khi validate form
const validateMessages = {
  required: "${label} không được để trống!",
  types: { number: "${label} phải là số hợp lệ!" },
};

const InsertProduct = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Lấy danh sách danh mục khi load trang
  useEffect(() => {
    fetchCategories();
  }, []);

  // Mở modal thêm danh mục
  const openInsertCategory = () => {
    console.log("Open modal");
    setIsModalOpen(true);
  };

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await getListProducts("categories");
      console.log("API Response:", response);

      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      message.error("Lỗi tải danh mục!");
      setCategories([]);
    }
  };

  // Xử lý khi thêm danh mục
  const handleCategoryAdded = async () => {
    await fetchCategories();
  };

  // Xử lý khi nhấn nút Lưu
  const handlerInsertProduct = async (values) => {
    try {
      setLoading(true);

      const imageUrls =
        values.imageUrl?.map((file) => file.url || file.response?.url) || [];

      const formData = {
        name: values.name,
        description: values.description,
        price: values.price,
        quantity: values.import,
        import: values.import,
        category: values.category,
        origin: values.origin,
        imageUrl: imageUrls,
        unit: values.unit,
        status: values.status,
      };

      const response = await insertProduct(formData);
      if (response) {
        message.success("Thêm sản phẩm thành công! 🎉");

        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      } else {
        message.error("Thêm sản phẩm thất bại. Vui lòng thử lại! ❌");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      message.error("Lỗi hệ thống, vui lòng thử lại sau! ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="h-full">
      <div className="w-full bg-white rounded-md px-[2%] py-[1%] shadow-md">
        <Flex gap="middle" vertical>
          <Form
            form={form}
            size="small"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            layout="horizontal"
            style={{ maxWidth: "100%" }}
            onFinish={handlerInsertProduct}
            validateMessages={validateMessages}
            initialValues={{ status: "available", quantity: 0 }}
          >
            <Flex className="mb-[5vh]" justify="space-between" align="center">
              <div className="text-xl text-primary font-bold">
                Thêm thông tin sản phẩm mới
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
                    },
                  },
                }}
              >
                <div className="flex justify-center gap-2">
                  <Button
                    size="small"
                    type="default"
                    htmlType="submit"
                    className="py-4 px-10 size-3"
                    loading={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>

                  <Button
                    size="small"
                    type="default"
                    className="py-4 px-10 size-3"
                  >
                    Nhập Excel
                  </Button>
                </div>
              </ConfigProvider>
            </Flex>
            <Row gutter={16}>
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
                      className="flex-1"
                      onChange={(value) => {
                        form.setFieldsValue({ category: value });
                      }}
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
                      className="text-[#82AE46] bg-none w-8 h-8 flex items-center justify-center hover:text-[#34C759]"
                    >
                      <PlusOutlined />
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
                  <TextArea rows={6} />
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
                    beforeUpload={handlerBeforeUpload}
                    onChange={handlerChange}
                    onPreview={(file) =>
                      handlePreview(
                        file,
                        setPreviewImage,
                        setPreviewOpen,
                        setPreviewTitle
                      )
                    }
                    onRemove={handleRemove} // 🛠️ Gọi hàm xóa ảnh
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải hình lên</div>
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
                      type: "number",
                      min: 0,
                      message: "Giá nhập không hợp lệ!",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    onChange={(value) => {
                      form.setFieldsValue({ entryPrice: (value || 0) * 1.5 });
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Giá bán"
                  name="entryPrice"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Giá nhập không hợp lệ!",
                    },
                  ]}
                >
                  <InputNumber className="w-full" disabled={true} />
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
                  <Select
                    disabled={true}
                    defaultValue="available"
                    className="w-full"
                  >
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

          {/* Modal thêm danh mục */}
          <FormInsertCategory
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCategoryAdded={handleCategoryAdded}
          />
        </Flex>
      </div>

      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Layout>
  );
};

export default InsertProduct;
