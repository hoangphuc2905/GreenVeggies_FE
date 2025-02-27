import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import PropTypes from "prop-types";
import { insertStockEntry } from "../../../api/api";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  SaveFilled,
} from "@ant-design/icons";
import logo from "../../../assets/Green.png";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const InsertStockEntry = ({
  isOpen,
  onClose,
  productID,
  productName,
  onStockUpdated,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const hanndlerSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      const formData = {
        productID: productID,
        entryPrice: values.entryPrice,
        entryQuantity: values.entryQuantity,
      };
      const response = await insertStockEntry(formData);
      if (!response) {
        message.error("Có lỗi xảy ra khi thêm phiếu nhập!");
        throw new Error("Có lỗi xảy ra khi thêm phiếu nhập!");
      }
      setLoading(false);
      onClose();
      if (onStockUpdated) {
        onStockUpdated();
      }
      message.success("Thêm phiếu nhập thành công!");
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm phiếu nhập!");
      setLoading;
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Xóa dữ liệu khi đóng modal
    onClose();
  };

  const handleRefresh = () => {
    form.resetFields(); // Xóa dữ liệu khi đóng modal
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
            <div className="py-3 font-bold text-xl text-[#82AE46]">
              THÊM PHIẾU NHẬP HÀNG
            </div>
          </div>
        }
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="wrap"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600 }}
          onFinish={hanndlerSubmit}
          initialValues={{
            productID: productID,
            productName: productName,
          }}
        >
          {/* Hiển thị ID sản phẩm
          <Form.Item label="ID sản phẩm" name="productID">
            <Input disabled />
          </Form.Item> */}

          {/* Hiển thị tên sản phẩm */}
          <Form.Item label="Tên sản phẩm" name="productName">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Ngày nhập">
            <DatePicker
              className="w-full"
              defaultValue={dayjs()}
              format={dateFormat}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Giá nhập"
            name="entryPrice"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber className="w-full"></InputNumber>
          </Form.Item>

          <Form.Item
            label="Số lượng nhập"
            name="entryQuantity"
            rules={[{ required: true, type: "number" }]}
          >
            <InputNumber className="w-full"></InputNumber>
          </Form.Item>

          <div className="mt-4 flex justify-between w-full gap-4">
            <Form.Item className="w-full">
              <Button
                htmlType="button"
                onClick={handleCancel}
                icon={<ArrowLeftOutlined />}
                className="w-full bg-[#FF3D00] hover:bg-red-600 text-white py-6 text-base"
              >
                Hủy bỏ
              </Button>
            </Form.Item>

            <Form.Item className="w-full">
              <Button
                type="default"
                htmlType="submit"
                icon={<SaveFilled />}
                className="w-full bg-[#82AE46] hover:bg-green-600 text-white py-6 text-base"
              >
                Thêm mới
              </Button>
            </Form.Item>

            <Form.Item className="w-full">
              <Button
                htmlType="button"
                onClick={handleRefresh}
                icon={<ReloadOutlined />}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-base"
              >
                Làm mới
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

InsertStockEntry.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onStockEntry: PropTypes.func,
  productID: PropTypes.string,
  productName: PropTypes.string,
  onStockUpdated: PropTypes.func,
};

export default InsertStockEntry;
