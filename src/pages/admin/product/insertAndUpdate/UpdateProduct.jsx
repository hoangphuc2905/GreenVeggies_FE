import {
  Button,
  Flex,
  Form,
  Input,
  Layout,
  Select,
  Row,
  Col,
  ConfigProvider,
  App,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getListProducts, updateProduct } from "../../../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import FormInsertCategory from "../../category/FormInsertCategory";
import UploadPicture from "../../../../components/uploadPicture/UploadPicture.jsx";
import InsertStockEntry from "../../stockEntry/InsertStockEntry";

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

const validateMessages = {
  required: "${label} không được để trống!",
  types: { number: "${label} phải là số hợp lệ!" },
};

const UpdateProduct = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);

  const location = useLocation();
  const getProduct = location.state?.product; // Lấy product từ location.state

  const fetchCategories = async () => {
    try {
      const response = await getListProducts("categories");
      setCategories(response);
    } catch (error) {
      message.error("Lỗi tải danh mục!" + error);
    }
  };

  const openInsertStockEntry = (product) => {
    setIsStockEntryOpen(true);
    setProduct(product);
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
    if (getProduct) {
      setProduct(getProduct);
      if (categories.length > 0) {
        const selectedCategory = categories.find(
          (cat) => cat._id === getProduct?.category?._id
        );
        form.setFieldsValue({
          name: getProduct.name || "",
          category: selectedCategory?._id || null,
          origin: getProduct.origin || "",
          description: getProduct.description || "",
          unit: getProduct.unit || "piece",
          status: getProduct.status || "available",
          price: getProduct.price || 0,
          entryPrice: getProduct.price * 1.5 || 0,
          imageUrl: getProduct.imageUrl
            ? getProduct.imageUrl.map((url, index) => ({
                uid: index,
                name: `image-${index}`,
                url,
                status: "done",
              }))
            : [],
        });
      }
    }
  }, [getProduct, categories]); // Chạy lại khi product hoặc categories thay đổi

  const handlerUpdateProduct = async (values) => {
    try {
      setLoading(true);
      const imageUrls =
        values.imageUrl?.map((file) => file.url || file.response?.url) || [];
      const formData = { ...values, imageUrl: imageUrls };
      const response = await updateProduct(product.productID, formData);
      if (response) {
        message.success("Cập nhật sản phẩm thành công!");
        console.log("Cập nhật sản phẩm thành công!", formData);
        setTimeout(() => navigate("/admin/products"), 1000);
      } else {
        message.error("Cập nhật thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại sau!" + error);
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
            onFinish={handlerUpdateProduct}
            validateMessages={validateMessages}
            initialValues={{ status: "available", quantity: 0 }}
          >
            <Flex className="mb-[5vh]" justify="space-between" align="center">
              <div className="text-xl text-primary font-bold">
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
                    },
                  },
                }}
              >
                <div className="flex justify-center gap-2">
                  <Button
                    size="small"
                    type="default"
                    className="py-2 px-6"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="small"
                    type="default"
                    htmlType="submit"
                    className="py-2 px-6"
                    loading={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button
                    size="small"
                    type="default"
                    htmlType="button"
                    className="py-2 px-6"
                    onClick={() => openInsertStockEntry(product)}
                  >
                    Nhập hàng
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
                      value={form.getFieldValue("category")} // Lấy giá trị từ form
                      placeholder="Chọn danh mục"
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
                <Form.Item
                  label="Đơn giá"
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
                    type="number"
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
            productID={product?.productID}
            productName={product?.name}
            entryPrice={product?.price}
          ></InsertStockEntry>
        </Flex>
      </div>
    </Layout>
  );
};

UpdateProduct.propTypes = { product: PropTypes.object };
export default UpdateProduct;
