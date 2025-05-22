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
import {
  addProduct,
  getCategories,
  deleteImage,
} from "../../../../services/ProductService";
import { getProducts } from "../../../../services/ProductService";
import { UNIT_OPTIONS } from "../../../../constants/unitOptions";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (Array.isArray(response)) {
      setCategories(response);
    } else {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setProducts([]);
    }
  };

  const handleCategoryAdded = async () => {
    await fetchCategories();
  };

  const openInsertCategory = () => {
    setIsModalOpen(true);
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

  const handlerInsertProduct = async (values) => {
    try {
      setLoading(true);

      // Check trùng tên sản phẩm (không phân biệt hoa thường, loại bỏ khoảng trắng đầu/cuối)
      const newName = (values.name || "").trim().toLowerCase();
      const isDuplicate = products.some(
        (p) => (p.name || "").trim().toLowerCase() === newName
      );
      if (isDuplicate) {
        message.error("Tên sản phẩm đã tồn tại. Vui lòng nhập tên khác!");
        setLoading(false);
        return;
      }

      // Delete images marked for deletion before saving
      await deleteImagesOnCloud(removedImages);
      const response = await addProduct(values);
      if (response) {
        message.success("Thêm sản phẩm thành công! 🎉");
        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      }
    } catch (errors) {
      console.error("Lỗi khi thêm sản phẩm:", errors);
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

  const clearFieldError = (fieldName) => {
    form.setFields([
      {
        name: fieldName,
        errors: [],
      },
    ]);
  };

  const handleCancel = async () => {
    const allImages = [
      ...(form.getFieldValue("imageUrl") || [])
        .map((f) => f.url || f.response?.secure_url)
        .filter(Boolean),
      ...removedImages,
    ];
    await deleteImagesOnCloud(allImages);
    navigate("/admin/products");
  };

  useEffect(() => {
    return () => {
      if (!form.isFieldsTouched()) {
        const allImages = [
          ...(form.getFieldValue("imageUrl") || [])
            .map((f) => f.url || f.response?.secure_url)
            .filter(Boolean),
          ...removedImages,
        ];
        deleteImagesOnCloud(allImages);
      }
    };
  }, [form, removedImages]);

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
                    onClick={handleCancel}
                  >
                    Hủy
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
                  // rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm." }]}
                >
                  <Input onChange={() => clearFieldError("name")} />
                </Form.Item>
                <Form.Item
                  label="Loại danh mục"
                  name="category"
                  // rules={[{ required: true, message: "Vui lòng chọn danh mục." }]}
                >
                  <div className="flex items-center gap-2">
                    <Select
                      className="flex-1"
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
                      className="text-primary bg-none w-8 h-8 flex items-center justify-center hover:text-[#34C759]"
                    >
                      <PlusOutlined />
                    </button>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Nguồn gốc"
                  name="origin"
                  // rules={[{ required: true, message: "Vui lòng nhập nguồn gốc." }]}
                >
                  <Input onChange={() => clearFieldError("origin")} />
                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  // rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm." }]}
                >
                  <TextArea
                    rows={6}
                    onChange={() => clearFieldError("description")}
                  />
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
              <Col span={12}>
                <Form.Item
                  label="Giá nhập"
                  name="price"
                  rules={[{ type: "number", min: 0 }]}
                >
                  <InputNumber
                    type="number"
                    className="w-full"
                    onKeyDown={(e) => {
                      if (
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "+" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(value) => {
                      const calculatedPrice = CalcPrice(value || 0);
                      form.setFieldsValue({
                        entryPrice: calculatedPrice,
                        formattedEntryPrice: formattedPrice(calculatedPrice),
                      });
                      clearFieldError("price");
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Giá bán (1.5 lần giá trị giá nhập)"
                  name="formattedEntryPrice"
                  rules={[{ type: "string" }]}
                >
                  <Input className="w-full" disabled={true} />
                </Form.Item>
                <Form.Item
                  label="Số lượng nhập"
                  name="import"
                  rules={[{ type: "number", min: 0 }]}
                >
                  <InputNumber
                    className="w-full"
                    onKeyDown={(e) => {
                      if (
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "+" ||
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onChange={() => clearFieldError("import")}
                  />
                </Form.Item>
                <Form.Item
                  label="Đơn vị"
                  name="unit"
                  // rules={[{ required: true, message: "Vui lòng chọn đơn vị." }]}
                >
                  <Select onChange={() => clearFieldError("unit")}>
                    {UNIT_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
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
