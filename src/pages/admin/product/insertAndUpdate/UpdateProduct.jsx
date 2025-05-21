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
import { useLocation, useNavigate } from "react-router-dom";
import FormInsertCategory from "../../category/FormInsertCategory";
import UploadPicture from "../../../../components/uploadPicture/UploadPicture.jsx";
import InsertStockEntry from "../../stockEntry/InsertStockEntry";
import {
  CalcPrice,
  formattedPrice,
} from "../../../../components/calcSoldPrice/CalcPrice.jsx";
import {
  getCategories,
  updateProduct,
  deleteImage,
} from "../../../../services/ProductService.jsx";

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

const UpdateProduct = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const location = useLocation();
  const getProduct = location.state?.product;

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
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
          entryPrice: formattedPrice(CalcPrice(getProduct.price)) || 0,
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
  }, [getProduct, categories]);

  const clearFieldError = (fieldName) => {
    form.setFields([
      {
        name: fieldName,
        errors: [],
      },
    ]);
  };

  const deleteImagesOnCloud = async (images) => {
    if (!images || images.length === 0) return;
    for (const imageUrl of images) {
      const publicId = imageUrl
        .substring(imageUrl.lastIndexOf("/") + 1)
        .split(".")[0];
      try {
        await deleteImage(publicId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
  };

  const handlerUpdateProduct = async (values) => {
    try {
      setLoading(true);
      // Delete images marked for deletion before saving
      await deleteImagesOnCloud(removedImages);
      const response = await updateProduct(product.productID, values);
      if (response) {
        message.success("Cập nhật sản phẩm thành công!");
        setTimeout(() => navigate("/admin/products"), 1000);
      }
    } catch (errors) {
      console.error("Lỗi khi cập nhật sản phẩm:", errors);
      if (errors) {
        const fieldErrors = Object.keys(errors).map((field) => ({
          name: field,
          errors: [errors[field]],
        }));
        form.setFields(fieldErrors);
      } else {
        message.error("Lỗi hệ thống ở service, vui lòng thử lại sau! ⚠️");
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
            onFinish={handlerUpdateProduct}
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
                  // rules={[{ required: true }]}
                >
                  <Input onChange={() => clearFieldError("name")} />
                </Form.Item>
                <Form.Item label="Loại danh mục" name="category">
                  <div className="flex items-center gap-2">
                    <Select
                      value={form.getFieldValue("category")}
                      placeholder="Chọn danh mục"
                      onChange={(value) => {
                        form.setFieldsValue({ category: value });
                        clearFieldError("category");
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
                  // rules={[{ required: true }]}
                >
                  <Input onChange={() => clearFieldError("origin")} />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                  <TextArea
                    rows={6}
                    onChange={() => clearFieldError("description")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đơn vị"
                  name="unit"
                  // rules={[{ required: true }]}
                >
                  <Select onChange={() => clearFieldError("unit")}>
                    <Select.Option value="piece">Phần</Select.Option>
                    <Select.Option value="kg">Kg</Select.Option>
                    <Select.Option value="gram">Gram</Select.Option>
                    <Select.Option value="liter">Lít</Select.Option>
                    <Select.Option value="ml">Ml</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Đơn giá"
                  name="price"
                  rules={[{ type: "number", min: 0 }]}
                >
                  <InputNumber
                    type="number"
                    className="w-full"
                    onChange={(value) => {
                      form.setFieldsValue({
                        entryPrice: formattedPrice(CalcPrice(value)),
                      });
                      clearFieldError("price");
                    }}
                  />
                </Form.Item>
                <Form.Item label="Giá bán" name="entryPrice">
                  <InputNumber className="w-full" disabled={true} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Select
                    className="w-full"
                    onChange={() => clearFieldError("status")}
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
                <Form.Item
                  label="Hình minh họa"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e.fileList}
                  name="imageUrl"
                >
                  <UploadPicture
                    fileList={form.getFieldValue("imageUrl")}
                    onFileListChange={(newFileList) => {
                      form.setFieldsValue({ imageUrl: newFileList });
                      clearFieldError("imageUrl");
                    }}
                    onImagesMarkedForDelete={(newRemovedImages) =>
                      setRemovedImages(newRemovedImages)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
          />
        </Flex>
      </div>
    </Layout>
  );
};

UpdateProduct.propTypes = { product: PropTypes.object };
export default UpdateProduct;
