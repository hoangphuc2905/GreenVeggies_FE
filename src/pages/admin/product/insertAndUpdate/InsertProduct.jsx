import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Select,
  Row,
  Col,
  ConfigProvider,
  App,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInsertCategory from "../../category/FormInsertCategory";
import UploadPicture from "../../../../components/uploadPicture/UploadPicture";
import {
  CalcPrice,
  formattedPrice,
} from "../../../../components/calcSoldPrice/CalcPrice";
import { addProduct, getCategories } from "../../../../services/ProductService";

const { TextArea } = Input;

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

const InsertProduct = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy danh sách danh mục khi load trang
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (Array.isArray(response)) {
      setCategories(response);
    } else {
      setCategories([]);
    }
  };

  const handleCategoryAdded = async () => {
    await fetchCategories();
  };

  const openInsertCategory = () => {
    setIsModalOpen(true);
  };
  const handlerInsertProduct = async (values) => {
    try {
      setLoading(true);

      // Gọi hàm addProduct từ ProductService
      const response = await addProduct(values);
      if (response) {
        message.success("Thêm sản phẩm thành công! 🎉");

        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      }
    } catch (errors) {
      console.error("Lỗi khi thêm sản phẩm:", errors);

      // Hiển thị lỗi từ BE
      if (errors) {
        const fieldErrors = Object.keys(errors).map((field) => ({
          name: field,
          errors: [errors[field]],
        }));
        console.error("Có lỗi xảy ra khi thêm sản phẩm:", errors);
        form.setFields(fieldErrors);
      } else {
        message.error("Lỗi hệ thống, vui lòng thử lại sau! ⚠️");
      }
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
                <Form.Item
                  label="Loại danh mục"
                  name="category"
                  rules={[{ required: true }]}
                >
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
                      className="text-primary bg-none w-8 h-8 flex items-center justify-center hover:text-[#34C759]"
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
                  getValueFromEvent={(e) => e.fileList}
                  name="imageUrl"
                >
                  <UploadPicture
                    fileList={form.getFieldValue("imageUrl")}
                    onFileListChange={(newFileList) =>
                      form.setFieldsValue({ imageUrl: newFileList })
                    }
                  />
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
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    className="w-full"
                    onChange={(value) => {
                      const calculatedPrice = CalcPrice(value || 0); // Tính giá bán
                      form.setFieldsValue({
                        entryPrice: calculatedPrice, // Lưu giá trị chưa định dạng
                        formattedEntryPrice: formattedPrice(calculatedPrice), // Hiển thị giá trị đã định dạng
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Giá bán"
                  name="formattedEntryPrice"
                  rules={[{ type: "string" }]}
                >
                  <Input className="w-full" disabled={true} />
                </Form.Item>
                <Form.Item
                  label="Số lượng nhập"
                  name="import"
                  rules={[
                    {
                      required: true,
                      type: "number",
                      min: 0,
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
                  <Select disabled={true} defaultValue="available">
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
    </Layout>
  );
};

export default InsertProduct;
