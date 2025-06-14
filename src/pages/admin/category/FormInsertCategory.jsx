import {
  Button,
  ConfigProvider,
  Divider,
  Form,
  Input,
  List,
  message,
  Modal,
  Skeleton,
} from "antd";
import logo from "../../../assets/pictures/Green.png";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReloadOutlined, SaveFilled } from "@ant-design/icons";
import { addCategory, getCategories } from "../../../services/ProductService";

const fetchCategories = async (page, limit) => {
  try {
    const response = await getCategories();
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const FormInsertCategory = ({ isOpen, onClose, onCategoryAdded }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [form] = Form.useForm();

  const loadMoreData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetchCategories(page, limit);

      if (response.length < limit) {
        setHasMore(false);
      }

      setCategories((prev) => {
        const newCategories = response.filter(
          (item) =>
            !prev.some((existing) => existing.categoryID === item.categoryID)
        );
        return [...prev, ...newCategories];
      });

      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      setPage(1);
      setHasMore(true);
      loadMoreData();
    }
  }, [isOpen]);

  const handleRefresh = async () => {
    setLoading(true);
    setCategories([]);
    setPage(1);
    setHasMore(true);
    form.resetFields();

    try {
      const response = await fetchCategories(1, limit);
      setCategories(response);
      if (response.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi làm mới danh mục:", error);
    }

    setLoading(false);
  };

  const handleInsertCategory = async (values) => {
    try {
      setLoading(true);

      // Gọi hàm addCategory từ ProductService
      const response = await addCategory(values);
      if (response) {
        message.success("Thêm mới danh mục thành công!");
        handleRefresh(); // Làm mới danh sách danh mục
        onCategoryAdded(); // Gọi lại API danh mục trong InsertForm
        form.resetFields(); // Reset form
      }
    } catch (errors) {
      console.error("Lỗi khi thêm mới danh mục:", errors);

      // Hiển thị thông báo lỗi từ BE nếu có
      if (errors) {
        const fieldErrors = Object.keys(errors).map((field) => ({
          name: field,
          errors: [errors[field]],
        }));
        console.error("Có lỗi xảy ra thêm danh mục mới:", errors);
        form.setFields(fieldErrors);
      } else {
        message.error("Lỗi hệ thống ở service, vui lòng thử lại sau! ⚠️");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            // contentBg: "#E2F8C5",
          },
          Button: {
            defaultHoverBg: "bg-opacity",
            defaultHoverColor: "#ffffff",
            defaultHoverBorderColor: "none",
          },
        },
      }}
    >
      <Modal
        title={
          <div className=" flex items-center justify-center gap-4">
            <img src={logo} className="w-14 h-14" alt="Logo" />
            <div className="py-3 font-bold text-xl text-primary">
              THÊM MỚI DANH MỤC
            </div>
          </div>
        }
        centered
        open={isOpen}
        onCancel={onClose}
        footer={null}
        className="custom-modal"
      >
        <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
          <Form
            form={form}
            name="wrap"
            labelAlign="left"
            labelWrap
            layout="vertical"
            onFinish={handleInsertCategory}
          >
            <Form.Item
              label={
                <div className="font-bold"> Nhập vào tên danh mục mới</div>
              }
              name="name"
              // rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <div className="flex flex-col gap-4">
              <div className="font-bold">Các danh mục hiện có</div>
              <div
                id="scrollableDiv"
                className="h-[400px] overflow-auto px-4 border shadow-md bg-[#F5F5F5]"
              >
                <InfiniteScroll
                  dataLength={categories.length}
                  next={loadMoreData}
                  hasMore={hasMore}
                  loader={
                    loading && (
                      <Skeleton avatar paragraph={{ rows: 1 }} active />
                    )
                  }
                  endMessage={<Divider plain>Đã tải hết danh mục</Divider>}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    dataSource={categories}
                    renderItem={(item) => (
                      <List.Item
                        key={item.categoryID}
                        className="bg-[#F5F5F5] hover:bg-[#E2F8C5] transition duration-200 cursor-pointer rounded-md"
                        style={{ paddingLeft: "16px", paddingRight: "16px" }}
                      >
                        <List.Item.Meta
                          title={
                            <span className="block pl-4"> {item.name}</span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </div>
            <div className="mt-4 flex justify-between w-full gap-4">
              <Form.Item className="w-full">
                <Button
                  type="default"
                  htmlType="submit"
                  icon={<SaveFilled />}
                  className="min-w-defaultWidth max-w-full w-full bg-primary hover:bg-green-600 text-white py-4"
                >
                  Thêm mới
                </Button>
              </Form.Item>

              <Form.Item className="w-full">
                <Button
                  htmlType="button"
                  size="small"
                  onClick={handleRefresh}
                  icon={<ReloadOutlined />}
                  className="min-w-defaultWidth max-w-full w-full bg-blue-500 hover:bg-blue-600 text-white py-4"
                >
                  Làm mới
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

FormInsertCategory.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCategoryAdded: PropTypes.func,
};

export default FormInsertCategory;
