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

import { ReloadOutlined, SaveFilled } from "@ant-design/icons";
import logo from "../../../assets/pictures/Green.png";
import { insertStockEntry } from "../../../services/ProductService";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const InsertStockEntry = ({
  isOpen,
  onClose,
  productID,
  productName,
  onStockUpdated,
  entryPrice,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const hanndlerSubmit = async (values) => {
    try {
      setLoading(true);

      // Gọi service để thêm phiếu nhập hàng
      const response = await insertStockEntry({
        productID,
        entryPrice: values.entryPrice,
        entryQuantity: values.entryQuantity,
      });

      if (response) {
        message.success("Thêm phiếu nhập thành công!");
        onClose();
        if (onStockUpdated) {
          onStockUpdated(); // Gọi callback để cập nhật danh sách
        }
        form.resetFields(); // Reset form sau khi thành công
      }
    } catch (errors) {
      console.error("Lỗi khi thêm phiếu nhập:", errors);

      if (errors) {
        const fieldErrors = Object.keys(errors).map((field) => ({
          name: field,
          errors: [errors[field]],
        }));
        console.error("Có lỗi xảy ra khi thêm phiếu nhập:", errors);
        form.setFields(fieldErrors);
      } else {
        message.error("Lỗi hệ thống ở service, vui lòng thử lại sau! ⚠️");
      }
    } finally {
      setLoading(false);
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
            entryPrice: entryPrice,
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
            rules={[
              { type: "number", message: "Giá phải là số", min: 0 },
              { required: true, message: "Vui lòng nhập giá nhập" },
            ]}
          >
            <InputNumber
              type="number"
              className="w-full"
              stringMode={false}
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
            />
          </Form.Item>

          <Form.Item
            label="Số lượng nhập"
            name="entryQuantity"
            rules={[
              { type: "number", message: "Số lượng phải là số", min: 0 },
              { required: true, message: "Vui lòng nhập số lượng nhập" },
            ]}
          >
            <InputNumber
              type="number"
              className="w-full"
              stringMode={false}
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
            />
          </Form.Item>

          <div className="mt-4 flex justify-between w-full gap-4">
            <Form.Item className="w-full">
              <Button
                type="default"
                htmlType="submit"
                icon={<SaveFilled />}
                className="min-w-full bg-[#82AE46] hover:bg-green-600 text-white py-4"
              >
                Thêm mới
              </Button>
            </Form.Item>

            <Form.Item className="w-full">
              <Button
                htmlType="button"
                onClick={handleRefresh}
                icon={<ReloadOutlined />}
                className="min-w-full bg-blue-500 hover:bg-blue-600 text-white py-4 "
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
