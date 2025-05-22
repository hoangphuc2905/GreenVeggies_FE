// First, import notification from antd at the top of the file
import {
  Divider,
  Button,
  Form,
  Input,
  Radio,
  message,
  notification,
  Select,
  Spin,
  Modal,
} from "antd";
import { useState, useEffect } from "react";
import {
  getUserInfo,
  getAddressesByUserId,
} from "../../../services/UserService";
import { deleteShoppingCartDetailById } from "../../../services/ShoppingCartService";
import { useNavigate, useLocation } from "react-router-dom";
import { createNotify } from "../../../services/NotifyService";
import { addOrder } from "../../../services/OrderService";
import { CalcPrice } from "../../../components/calcSoldPrice/CalcPrice";
import translateUnit from "../../../components/translateUnit";
import AddressForm from "../profile/AddressForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

const onFinish = (values) => {
  console.log(values);
};

const OrderPage = () => {
  const [value, setValue] = useState(1);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (userID) {
      // Fetch user info
      getUserInfo(userID)
        .then((userInfo) => {
          console.log("User Info:", userInfo);

          form.setFieldsValue({
            user: {
              firstName: userInfo.username,
              lastName: userInfo.username,
              phone: userInfo.phone,
              email: userInfo.email,
            },
          });

          // Lấy danh sách sản phẩm được chọn từ state
          const selectedProducts = location.state?.selectedProducts;
          if (selectedProducts && selectedProducts.length > 0) {
            setCartItems(selectedProducts);
          } else {
            // Nếu không có sản phẩm được chọn, chuyển về trang giỏ hàng
            notification.warning({
              message: "Chưa chọn sản phẩm",
              description: "Vui lòng chọn sản phẩm từ giỏ hàng",
              placement: "top",
              duration: 3,
            });
            navigate("/wishlist");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user info:", error);
          message.error("Không thể lấy thông tin người dùng");
        });

      // Fetch user addresses
      fetchUserAddress();
    } else {
      message.error("User ID không tồn tại. Vui lòng đăng nhập lại.");
    }
  }, [form, location.state, navigate]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
  };

  // Format the address for display
  const formatAddress = (address) => {
    return `${address.street}, ${address.ward}, ${address.district}, ${
      address.city
    }${address.default ? " (Mặc định)" : ""}`;
  };

  // Get the full address string for the selected address
  const getSelectedAddressString = () => {
    const selected = addresses.find((addr) => addr._id === selectedAddress);
    if (selected) {
      return `${selected.street}, ${selected.ward}, ${selected.district}, ${selected.city}`;
    }
    return "";
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
      // Đảm bảo dữ liệu đầu vào hợp lệ
      if (!userID || !cartItems || cartItems.length === 0) {
        notification.error({
          message: "Lỗi",
          description: "Thông tin đơn hàng không hợp lệ. Vui lòng thử lại.",
          placement: "topRight",
          duration: 4,
        });
        return;
      }

      // Đảm bảo định dạng số nguyên cho số lượng và tổng tiền
      const orderData = {
        userID,
        orderDetails: cartItems.map((item) => ({
          productID: item.productID,
          quantity: parseInt(item.quantity),
        })),
        totalQuantity: parseInt(totalQuantity),
        totalAmount: parseInt(totalAmount),
        address,
        paymentMethod,
        paymentStatus: paymentMethod === "BANK" ? "Pending" : undefined,
        reduceInventory: paymentMethod !== "BANK", // Chỉ giảm số lượng trong kho nếu không phải thanh toán qua ngân hàng
      };

      console.log("Đang gửi dữ liệu đơn hàng:", orderData);

      if (paymentMethod === "BANK") {
        try {
          const orderResponse = await addOrder(orderData);

          if (
            orderResponse &&
            orderResponse.order &&
            orderResponse.order.orderID
          ) {
            console.log("Order created for bank transfer:", orderResponse);

            // Lưu danh sách sản phẩm vào localStorage để xử lý sau khi thanh toán
            localStorage.setItem(
              `pendingCartItems_${orderResponse.order.orderID}`,
              JSON.stringify(cartItems.map((item) => item.shoppingCartDetailID))
            );

            // Không xóa các sản phẩm đã chọn khỏi giỏ hàng, việc này sẽ được thực hiện sau khi xác nhận thanh toán

            // Phát sự kiện cập nhật giỏ hàng để làm mới UI
            window.dispatchEvent(new Event("cartUpdated"));

            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });

            navigate(
              `/user/payment?amount=${totalAmount}&orderId=${orderResponse.order.orderID}`
            );
            return;
          } else {
            notification.error({
              message: "Thất bại",
              description: "Không thể tạo đơn hàng. Vui lòng thử lại.",
              placement: "topRight",
              duration: 4,
            });
            return;
          }
        } catch (orderError) {
          console.error("Lỗi khi tạo đơn hàng:", orderError);

          // Hiển thị thông báo lỗi cụ thể từ server nếu có
          let errorMessage = "Không thể tạo đơn hàng. Vui lòng thử lại.";

          if (orderError.message && orderError.message.includes("quá tải")) {
            errorMessage = orderError.message;

            // Hiển thị thông báo lỗi với nút thử lại
            notification.error({
              message: "Lỗi",
              description: (
                <div>
                  <p>{errorMessage}</p>
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginTop: "10px" }}
                    onClick={() =>
                      handlePlaceOrder(
                        userID,
                        cartItems,
                        totalQuantity,
                        totalAmount,
                        paymentMethod,
                        address
                      )
                    }>
                    Thử lại
                  </Button>
                </div>
              ),
              placement: "topRight",
              duration: 8,
            });
            return;
          }

          // Nếu không phải lỗi quá tải, hiển thị thông báo thông thường
          notification.error({
            message: "Lỗi",
            description: orderError.message || errorMessage,
            placement: "topRight",
            duration: 4,
          });
        }
      }

      try {
        const orderResponse = await addOrder(orderData);

        if (orderResponse) {
          console.log("Order placed successfully:", orderResponse);

          const notificationDataUser = {
            senderType: "system",
            receiverID: userID,
            title: "Thông báo đơn hàng",
            message: `Đơn hàng #${orderResponse.order.orderID} đã được đặt thành công.`,
            type: "order",
            orderID: orderResponse.order.orderID,
          };

          const notificationDataAdmin = {
            senderType: "system",
            receiverID: "admin",
            title: "Thông báo đơn hàng",
            message: `Đơn hàng #${orderResponse.order.orderID} cần được duyệt.`,
            type: "order",
            orderID: orderResponse.order.orderID,
          };

          await createNotify(notificationDataUser);
          await createNotify(notificationDataAdmin);

          // Xóa các sản phẩm đã chọn khỏi giỏ hàng (chỉ cho thanh toán tiền mặt)
          for (const item of cartItems) {
            await deleteShoppingCartDetailById(item.shoppingCartDetailID);
          }

          // Phát sự kiện cập nhật giỏ hàng và thông báo
          window.dispatchEvent(new Event("cartUpdated"));
          window.dispatchEvent(new Event("orderSuccess"));

          // Scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });

          notification.success({
            message: "Thành công",
            description: "Đặt hàng thành công!",
            placement: "topRight",
            duration: 4,
          });

          navigate("/user/orders");
        } else {
          notification.error({
            message: "Thất bại",
            description: "Đặt hàng thất bại. Vui lòng thử lại.",
            placement: "topRight",
            duration: 4,
          });
        }
      } catch (orderError) {
        console.error("Lỗi khi tạo đơn hàng:", orderError);

        // Hiển thị thông báo lỗi cụ thể từ server nếu có
        let errorMessage = "Không thể tạo đơn hàng. Vui lòng thử lại.";

        if (orderError.message && orderError.message.includes("quá tải")) {
          errorMessage = orderError.message;

          // Hiển thị thông báo lỗi với nút thử lại
          notification.error({
            message: "Lỗi",
            description: (
              <div>
                <p>{errorMessage}</p>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginTop: "10px" }}
                  onClick={() =>
                    handlePlaceOrder(
                      userID,
                      cartItems,
                      totalQuantity,
                      totalAmount,
                      paymentMethod,
                      address
                    )
                  }>
                  Thử lại
                </Button>
              </div>
            ),
            placement: "topRight",
            duration: 8,
          });
          return;
        }

        // Nếu không phải lỗi quá tải, hiển thị thông báo thông thường
        notification.error({
          message: "Lỗi",
          description: orderError.message || errorMessage,
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
  };

  // Tính tổng tiền sản phẩm và phí vận chuyển
  const totalProductPrice = cartItems.reduce(
    (acc, item) => acc + CalcPrice(item.price) * item.quantity,
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

  const fetchUserAddress = async () => {
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) return;

      setLoadingAddresses(true);
      const userAddress = await getAddressesByUserId(userID);
      if (userAddress && Array.isArray(userAddress) && userAddress.length > 0) {
        setAddresses(userAddress);

        // Find default address
        const defaultAddress = userAddress.find(
          (addr) => addr.default === true
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
          form.setFieldsValue({
            user: {
              ...form.getFieldValue("user"),
              addressId: defaultAddress._id,
            },
          });
        } else if (userAddress.length > 0) {
          // If no default, select the first address
          setSelectedAddress(userAddress[0]._id);
          form.setFieldsValue({
            user: {
              ...form.getFieldValue("user"),
              addressId: userAddress[0]._id,
            },
          });
        }
      } else if (userAddress && typeof userAddress === "object") {
        setAddresses([userAddress]);
        setSelectedAddress(userAddress._id);
        form.setFieldsValue({
          user: {
            ...form.getFieldValue("user"),
            addressId: userAddress._id,
          },
        });
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
      message.error("Không thể lấy danh sách địa chỉ");
    } finally {
      setLoadingAddresses(false);
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
              name={["user", "addressId"]}
              label={
                <div className="flex items-center justify-between w-full">
                  <span>Địa chỉ giao hàng</span>
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    onClick={() => setIsAddressModalVisible(true)}
                    className="ml-2 flex items-center justify-center"
                    style={{
                      backgroundColor: "#82AE46",
                      borderColor: "#82AE46",
                      width: "24px",
                      height: "24px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ fontSize: "12px" }}
                    />
                  </Button>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn địa chỉ giao hàng!",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <Spin spinning={loadingAddresses}>
                {addresses.length > 0 ? (
                  <Select
                    value={selectedAddress}
                    onChange={handleAddressChange}
                    placeholder="Chọn địa chỉ giao hàng"
                    className="w-full">
                    {addresses.map((address) => (
                      <Select.Option key={address._id} value={address._id}>
                        {formatAddress(address)}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <div className="text-red-500">
                    Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ bằng nút + ở
                    trên.
                  </div>
                )}
              </Spin>
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

          {/* Address Modal */}
          <Modal
            title="Thêm địa chỉ mới"
            open={isAddressModalVisible}
            onCancel={() => setIsAddressModalVisible(false)}
            footer={null}
            width={700}>
            <AddressForm
              isModal={true}
              onAddressAdded={() => {
                fetchUserAddress();
                setIsAddressModalVisible(false);
              }}
            />
          </Modal>
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
                <p>
                  {item.name} ({translateUnit(item.unit)})
                </p>
                <p className="text-center">{item.quantity}</p>
                <p className="text-right">
                  {(CalcPrice(item.price) * item.quantity).toLocaleString()} VND
                </p>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn đang trống.</p>
          )}
          <Divider style={{ borderColor: "#7cb305" }} />
          {/* <Form.Item
            name="discountCode"
            label="Mã giảm giá"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="mt-4">
            <Input placeholder="Nhập mã giảm giá" />
          </Form.Item> */}
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
            ]}
          />
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
                const address = getSelectedAddressString();

                if (!userID) {
                  alert("User ID không tồn tại. Vui lòng đăng nhập lại.");
                  return;
                }

                if (!selectedAddress) {
                  notification.error({
                    message: "Địa chỉ giao hàng",
                    description: "Vui lòng chọn địa chỉ giao hàng",
                    placement: "topRight",
                    duration: 3,
                  });
                  return;
                }

                handlePlaceOrder(
                  userID,
                  cartItems,
                  totalQuantity,
                  totalAmount,
                  value === 1 ? "CASH" : "BANK",
                  address
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
