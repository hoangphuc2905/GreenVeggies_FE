import { Divider, Button, Form, Input, Radio } from "antd";
import { useState } from "react";

const style = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const onFinish = (values) => {
  console.log(values);
};

const OrderPage = () => {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-[10%] mt-28">
      <Divider style={{ borderColor: "#7cb305" }} />
      <h2 className="text-2xl font-bold mb-6">Thông tin đặt hàng</h2>
      <div className="flex w-full">
        {/* Cột bên trái: Thông tin đặt hàng */}
        <div className="w-1/2 pr-4">
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
              width: "100%",
            }}
            validateMessages={validateMessages}>
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase text-center">
              Thông tin thanh toán
            </label>
            <div className="flex">
              <Form.Item
                name={["user", "firstName"]}
                label="Họ"
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="w-1/2 pr-2"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input />
              </Form.Item>
              <Form.Item
                name={["user", "lastName"]}
                label="Tên"
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="w-1/2 pl-2"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              name={["user", "address"]}
              label="Địa chỉ"
              rules={[
                {
                  required: true,
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "city"]}
              label="Tỉnh/ Thành phố"
              rules={[
                {
                  required: true,
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "phone"]}
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "email"]}
              label="Email"
              rules={[
                {
                  type: "email",
                  required: true,
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Input />
            </Form.Item>
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase text-center">
              Thông tin bổ sung
            </label>
            <Form.Item
              name={["user", "introduction"]}
              label="Ghi chú đơn hàng"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
        {/* Cột bên phải: Thông tin đơn hàng */}
        <div className="w-1/2 pl-4 border-[#82AE46] border-4 sticky top-28 self-start p-4">
          <h3 className="text-xl font-bold mb-4">Đơn hàng của bạn</h3>
          <div className="grid grid-cols-3">
            <p className="text-sm">Sản phẩm</p>
            <p className="text-sm">Số lượng</p>
            <p className="text-sm">Tạm tính</p>
          </div>
          <Divider style={{ borderColor: "#7cb305" }} />
          <div className="grid grid-cols-3 mb-2">
            <p>Product 1</p>
            <p>1</p>
            <p>100,000 VND</p>
          </div>
          <div className="grid grid-cols-3 mb-2">
            <p>Product 1</p>
            <p>1</p>
            <p>100,000 VND</p>
          </div>
          <Divider style={{ borderColor: "#7cb305" }} />
          <Form.Item
            name="discountCode"
            label="Mã giảm giá"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="mt-4">
            <Input placeholder="Nhập mã giảm giá" />
          </Form.Item>
          <label className="block text-sm font-bold mb-2 uppercase">
            Phương thức thanh toán
          </label>
          <Radio.Group
            style={style}
            onChange={onChange}
            value={value}
            options={[
              {
                value: 1,
                label: "Chuyển khoản ngân hàng",
              },
              {
                value: 2,
                label: "Trả tiền mặt khi nhận hàng",
              },
              {
                value: 3,
                label: "Thanh toán MoMo",
              },
            ]}
          />
          <Divider style={{ borderColor: "#7cb305" }} />
          <div className="grid grid-cols-3 mb-2">
            <p className="font-bold">Tổng tiền sản phẩm</p>
            <p></p>
            <p className="font-bold">200,000 VND</p>
          </div>
          <div className="grid grid-cols-3 mb-2">
            <p className="font-bold">Phí vận chuyển</p>
            <p></p>
            <p className="font-bold">50,000 VND</p>
          </div>
          <div className="grid grid-cols-3 mb-2">
            <p className="font-bold">Tổng tiền</p>
            <p></p>
            <p className="font-bold">250,000 VND</p>
          </div>
          <Divider style={{ borderColor: "#7cb305" }} />
          <div className="flex justify-end m-4">
            <Button
              type="primary"
              style={{
                background: "linear-gradient(to right, #82AE46, #5A8E1B)",
                color: "white",
                fontWeight: "bold",
                padding: "8px 24px",
                borderRadius: "6px",
                transition: "all 0.2s ease-in-out",
                width: "100%",
              }}
              className="hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg">
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
