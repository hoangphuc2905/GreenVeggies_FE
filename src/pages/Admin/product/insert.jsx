import {
  Breadcrumb,
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
  message,
} from "antd";
import { HomeOutlined, PlusOutlined, ShopOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { getListProducts, insertProduct } from "../../../api/api";

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
const handlerInsertProduct = async (values) => {
  try {
    const imageUrls =
      values.imageUrl?.map((file) => file.url || file.response?.url) || [];

    const formData = {
      name: values.name,
      description: values.description,
      price: values.price,
      sold: 0,
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
      console.log("Thêm sản phẩm thành công", response);
    } else {
      console.error("Thêm sản phẩm thất bại", formData);
      console.error("Lỗi khi thêm sản phẩm:", response);
      console.error("Hình ảnh:", values.imageUrl);
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
  }
};

const fetchCategories = async (key) => {
  try {
    const response = await getListProducts(key);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const InsertForm = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetchCategories("categories");
      setCategories(response);
      console.log("Categories", response);
    };
    fetchCategory();
  }, []);

  return (
    <Layout className="-mt-9 h-fit">
      <Breadcrumb
        items={[
          { href: "", title: <HomeOutlined /> },
          {
            href: "/admin/products",
            title: (
              <>
                <ShopOutlined />
                <span>Sản phẩm</span>
              </>
            ),
          },
          { title: "Thêm sản phẩm" },
        ]}
        className="py-5"
      />
      <div className="w-full bg-white p-4 rounded-md">
        <Flex gap="middle" vertical>
          <Form
            size="middle"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            layout="horizontal"
            style={{ maxWidth: "100%" }}
            onFinish={handlerInsertProduct}
            validateMessages={validateMessages}
            initialValues={{ status: "available", quantity: 0 }}
          >
            <Flex className="mb-[10vh]" justify="space-between" align="center">
              <div className="text-2xl text-[#82AE46] font-bold mt-3">
                Thêm thông tin sản phẩm mới
              </div>
              <Button
                className="w-[20vh] bg-[#82AE46] text-white"
                type="primary"
                htmlType="submit"
              >
                Lưu
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
                  <TextArea rows={8} />
                </Form.Item>
                <Form.Item
                  label="Hình minh họa"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="imageUrl"
                >
                  <Upload
                    action="/api/upload" // 🔄 Cập nhật URL đúng
                    listType="picture-card"
                    accept=".png,.jpg,.jpeg"
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        message.error("Chỉ được tải lên file hình ảnh!");
                      }
                      return isImage;
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
              <Col span={12}>
                <Form.Item
                  label="Giá nhập"
                  name="price"
                  rules={[{ required: true, type: "number" }]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="Số lượng nhập" name="import">
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item
                  label="Tồn kho"
                  rules={[{ required: true, type: "number" }]}
                >
                  <InputNumber
                    className="w-full"
                    value={0}
                    disabled={true}
                    placeholder="0"
                  />
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
                  <Select defaultValue="available" className="w-full">
                    {STATUS_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 font-bold">
                          <div
                            className={`${option.dot} w-4 h-4 rounded-full relative`}
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
        </Flex>
      </div>
    </Layout>
  );
};

export default InsertForm;
