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
import { getListProducts, insertProduct } from "../../../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import FormInsertCategory from "../../category/insert";

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

const UpdateForm = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const location = useLocation();
  const product = location.state?.product; // Lấy product từ location.state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getListProducts("categories");
        setCategories(response);
      } catch (error) {
        message.error("Lỗi tải danh mục!");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log(product);
    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        origin: product.origin,
        description: product.description,
        price: product.price,
        import: product.import,
        unit: product.unit,
        status: product.status,
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
  }, [product, form]);

  const handlerInsertProduct = async (values) => {
    try {
      setLoading(true);
      const imageUrls =
        values.imageUrl?.map((file) => file.url || file.response?.url) || [];
      const formData = { ...values, sold: 0, imageUrl: imageUrls };
      const response = await insertProduct(formData);
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
    <Layout>
      <div className="w-full bg-white rounded-md px-[3%] py-[1%] shadow-md">
        <Flex gap="middle" vertical>
          <Form
            form={form}
            size="middle"
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={handlerInsertProduct}
            validateMessages={validateMessages}
            initialValues={{ status: "available", quantity: 0 }}
          >
            <Flex justify="space-between" align="center">
              <div className="text-2xl text-[#82AE46] font-bold">
                Cập nhật sản phẩm
              </div>
              <Button
                type="default"
                htmlType="submit"
                className="h-12 w-44 px-10 font-medium"
                loading={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
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
                  <Select>
                    {categories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Nguồn gốc"
                  name="origin"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giá nhập"
                  name="price"
                  rules={[{ required: true, type: "number", min: 0 }]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item
                  label="Số lượng nhập"
                  name="import"
                  rules={[{ required: true, type: "number", min: 0 }]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Select>
                    {STATUS_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 font-bold">
                          <div
                            className={`${option.dot} w-4 h-4 rounded-full`}
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
          <FormInsertCategory
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Flex>
      </div>
    </Layout>
  );
};

UpdateForm.propTypes = { product: PropTypes.object };
export default UpdateForm;
