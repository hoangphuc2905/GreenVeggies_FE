// First, import notification from antd at the top of the file
import {
  Divider,
  Button,
  Form,
  Input,
  Radio,
  message,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  getUserInfo,
  getShoppingCartByUserId,
  getProductById,
  deleteShoppingCartDetailById,
  addOrder,
} from "../../../api/api";
import { useNavigate } from "react-router-dom";

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
    range: "${label} must be between ${min} và ${max}",
  },
};

const calculateSellingPrice = (price) => {
  return price * 1.5;
};

const onFinish = (values) => {
  console.log(values);
};

const OrderPage = () => {
  const [value, setValue] = useState(1);
  const navigate = useNavigate(); // Initialize navigate
  const [cartItems, setCartItems] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [form] = Form.useForm(); // Sử dụng hook form của Ant Design

  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Giả sử userID được lưu trong localStorage
    if (userID) {
      getUserInfo(userID)
        .then((userInfo) => {
          console.log("User Info:", userInfo);

          // Lấy thông tin địa chỉ từ mảng address
          const address = userInfo.address[0];
          const fullAddress = `${address.street}, ${address.ward}, ${address.district}`;

          // Điền thông tin người dùng vào form
          form.setFieldsValue({
            user: {
              firstName: userInfo.username,
              lastName: userInfo.username,
              address: fullAddress,
              city: address.city,
              phone: userInfo.phone,
              email: userInfo.email,
            },
          });

          // Gọi hàm để lấy danh sách sản phẩm trong giỏ hàng
          fetchCartItems(userID);
        })
        .catch((error) => {
          console.error("Failed to fetch user info:", error);
          message.error("Không thể lấy thông tin người dùng");
        });
    } else {
      message.error("User ID không tồn tại. Vui lòng đăng nhập lại.");
    }
  }, [form]);

  const onChange = async (e) => {
    setValue(e.target.value);
    if (e.target.value === 2 || e.target.value === 3) {
      setShowQR(true);
      const qrCode = await generatePaymentQR(
        "MBB",
        "120826121111",
        "PHAN HOANG TAN",
        totalPrice,
        "Thanh toan don hang #123"
      );
      setQrCodeUrl(qrCode);
    } else {
      setShowQR(false);
      setQrCodeUrl("");
    }
  };
  const fetchCartItems = async (userID) => {
    try {
      const shoppingCart = await getShoppingCartByUserId(userID);
      const detailedCartItems = await Promise.all(
        shoppingCart.shoppingCartDetails.map(async (item) => {
          const product = await getProductById(item.productID);
          return {
            ...item,
            name: product.name,
            price: calculateSellingPrice(product.price),
          };
        })
      );
      setCartItems(detailedCartItems);
    } catch (error) {
      console.error("Failed to fetch shopping cart or product details:", error);
      message.error("Không thể lấy giỏ hàng hoặc chi tiết sản phẩm");
    }
  };
  const handlePlaceOrder = async (
    userID,
    cartItems,
    totalQuantity,
    totalAmount,
    paymentMethod,
    address
  ) => {
    try {
      const orderData = {
        userID,
        orderDetails: cartItems.map((item) => ({
          productID: item.productID,
          quantity: item.quantity,
        })),
        totalQuantity,
        totalAmount,
        address,
        paymentMethod,
      };

      const orderResponse = await addOrder(orderData);

      if (orderResponse) {
        console.log("Order placed successfully:", orderResponse);

        // Clear the cart
        for (const item of cartItems) {
          await deleteShoppingCartDetailById(item.shoppingCartDetailID);
        }

        notification.success({
          message: "Thành công",
          description: "Đặt hàng thành công!",
          placement: "topRight",
          duration: 4,
        });

        // Cập nhật giỏ hàng sau khi đặt hàng thành công
        await fetchCartItems(userID);

        navigate("/user/orders");
      } else {
        notification.error({
          message: "Thất bại",
          description: "Đặt hàng thất bại. Vui lòng thử lại.",
          placement: "topRight",
          duration: 4,
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi đặt hàng.",
        placement: "topRight",
        duration: 4,
      });
    }
    const updatedCartItemCount = cartItems.length; // Hoặc tính toán số lượng mới
    const event = new CustomEvent("wishlistUpdated", {
      detail: updatedCartItemCount,
    });
    window.dispatchEvent(event);
  };

  // Tính tổng tiền sản phẩm và phí vận chuyển
  const totalProductPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function calculateShippingFee(
    orderTotal,
    isNewCustomer = false,
    isVIP = false
  ) {
    if (isVIP) {
      return 0; // Thành viên VIP miễn phí vận chuyển
    }
    if (isNewCustomer) {
      return 50000 * 0.5; // Khách hàng mới giảm 50% phí vận chuyển
    }
    if (orderTotal >= 600000) {
      return 0; // Miễn phí vận chuyển
    }
    if (orderTotal >= 400000) {
      return 15000;
    }
    if (orderTotal >= 200000) {
      return 30000;
    }
    return 50000; // Mặc định phí vận chuyển
  }

  const shippingFee = calculateShippingFee(totalProductPrice);
  const totalPrice = totalProductPrice + shippingFee;

  const generatePaymentQR = async (
    bankCode,
    accountNumber,
    accountName,
    amount,
    content
  ) => {
    // Tạo URL VietQR chính xác
    const qrData = `https://vietqr.net/${bankCode}/${accountNumber}?amount=${amount}&addInfo=${encodeURIComponent(
      content
    )}`;

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
      });
      return qrCodeDataUrl;
    } catch (err) {
      console.error("Lỗi khi tạo QR:", err);
      return null;
    }
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
            form={form}
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
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="w-full"
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
                  message: "Vui lòng nhập địa chỉ đầy đủ!",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Input placeholder="Nhập địa chỉ (Đường, Phường/Xã, Quận/Huyện)" />
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
          <div className="grid grid-cols-3 gap-4">
            <p className="text-sm">Sản phẩm</p>
            <p className="text-sm text-center">Số lượng</p>
            <p className="text-sm text-right">Tạm tính</p>
          </div>
          <Divider style={{ borderColor: "#7cb305" }} />
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                <p>{item.name}</p>
                <p className="text-center">{item.quantity}</p>
                <p className="text-right">
                  {(item.price * item.quantity).toLocaleString()} VND
                </p>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn đang trống.</p>
          )}
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
                label: "Trả tiền mặt khi nhận hàng",
              },
              {
                value: 2,
                label: "Chuyển khoản ngân hàng",
              },
              {
                value: 3,
                label: "Thanh toán MoMo",
              },
            ]}
          />
          {showQR && qrCodeUrl && (
            <div className="mt-4 relative">
              <img src={qrCodeUrl} alt="QR Code" />
            </div>
          )}
          <Divider style={{ borderColor: "#7cb305" }} />
          <div className="grid grid-cols-3 gap-4 mb-2">
            <p className="font-bold">Tổng tiền sản phẩm</p>
            <p></p>
            <p className="font-bold text-right">
              {totalProductPrice.toLocaleString()} VND
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <p className="font-bold">Phí vận chuyển</p>
            <p></p>
            <p className="font-bold text-right">
              {shippingFee.toLocaleString()} VND
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <p className="font-bold">Tổng tiền</p>
            <p></p>
            <p className="font-bold text-right">
              {totalPrice.toLocaleString()} VND
            </p>
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
              className="hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg"
              onClick={() => {
                const userID = localStorage.getItem("userID");
                const totalQuantity = cartItems.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                );
                const totalAmount = totalPrice;
                const formValues = form.getFieldsValue();
                const userAddress = `${formValues.user.address}, ${formValues.user.city}`;

                if (!userID) {
                  alert("User ID không tồn tại. Vui lòng đăng nhập lại.");
                  return;
                }

                handlePlaceOrder(
                  userID,
                  cartItems,
                  totalQuantity,
                  totalAmount,
                  value === 1 ? "CASH" : value === 2 ? "BANK" : "MOMO",
                  userAddress
                );
              }}>
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
