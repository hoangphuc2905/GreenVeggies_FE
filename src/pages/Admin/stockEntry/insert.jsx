import { Button, DatePicker, Form, Input, InputNumber, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import PropTypes from "prop-types";
import { insertStockEntry } from "../../../api/api";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const InsertStockEntry = ({ isOpen, onClose, productID, productName, onStockUpdated  }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const hanndlerSubmit = async (values) => {
    console.log(values);
    try {
        
      setLoading(true);
      const response = await insertStockEntry(values);
      if (!response) {
        throw new Error("Có lỗi xảy ra khi thêm phiếu nhập!");
      }
      setLoading(false);
      onClose();
      if(onStockUpdated)
      {
        onStockUpdated();
      }
      console.log("Thêm phiếu nhập thành công");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Xóa dữ liệu khi đóng modal
    onClose();
  };

  return (
    <Modal
      title="Thêm phiếu nhập"
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
        {/* Hiển thị ID sản phẩm */}
        <Form.Item label="ID sản phẩm" name="productID">
          <Input disabled />
        </Form.Item>

        {/* Hiển thị tên sản phẩm */}
        <Form.Item label="Tên sản phẩm" name="productName">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Ngày nhập">
          <DatePicker defaultValue={dayjs()} format={dateFormat} disabled />
        </Form.Item>

        <Form.Item
          label="Giá nhập"
          name="entryPrice"
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber  />
        </Form.Item>

        <Form.Item
          label="Số lượng nhập"
          name="entryQuantity"
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber  />
        </Form.Item>

        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

InsertStockEntry.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onStockEntry: PropTypes.func,
  productID: PropTypes.string,
  productName: PropTypes.string,
  onStockUpdated: PropTypes.func
};

export default InsertStockEntry;
