import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Spin, Result, notification, Divider, Typography } from "antd";
import { createPaymentQR } from "../../../services/PaymentService";
import { createNotify } from "../../../services/NotifyService";
import { updateStatus } from "../../../services/OrderService";
import { deleteShoppingCartDetailById } from "../../../services/ShoppingCartService";

const { Text, Paragraph } = Typography;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentContent, setPaymentContent] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Extract payment amount from URL search params
  const searchParams = new URLSearchParams(location.search);
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const generateQRCode = async () => {
      if (!amount) {
        setError("Không tìm thấy thông tin thanh toán");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Sending payment request with amount:", amount);
        console.log("Order ID:", orderId);

        // Call the actual API for QR code generation
        const response = await createPaymentQR(
          parseInt(amount),
          orderId,
          "Bank Transfer"
        );
        console.log("QR code response từ PaymentService:", response);

        // More detailed logging for debugging
        console.log(
          "QR content từ response:",
          response.content ? response.content : "No content provided"
        );
        console.log(
          "QR payment ID từ response:",
          response.paymentId ? response.paymentId : "No payment ID provided"
        );

        if (response?.qrCodeUrl) {
          setQrCodeUrl(response.qrCodeUrl);
          setSuccessMessage(
            response.message || "Mã QR thanh toán đã được tạo thành công"
          );

          // If the API returns a payment ID, store it
          if (response.paymentId) {
            console.log("Setting payment ID:", response.paymentId);
            setPaymentId(response.paymentId);
          } else {
            console.warn("No payment ID found in response");
          }

          // Store payment content from response
          if (response.content) {
            setPaymentContent(response.content);
            console.log("Setting payment content:", response.content);
          } else {
            // This shouldn't happen with the new implementation
            console.warn("No content found in payment response");
          }

          // Store payment method if available
          if (response.paymentMethod) {
            setPaymentMethod(response.paymentMethod);
          }

          // Set payment status
          if (response.paymentStatus) {
            setPaymentStatus(response.paymentStatus);
          }
        } else {
          setError("Không thể tạo mã QR thanh toán");
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError(
          "Đã xảy ra lỗi khi tạo mã QR thanh toán: " +
            (err.message || "Lỗi không xác định")
        );
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [amount, orderId]);

  // Check payment status periodically if we have a payment ID
  useEffect(() => {
    let intervalId;

    if (paymentId && paymentStatus === "Pending") {
      // Optional: We can keep this if you want auto-redirect after some time
      // Or remove it completely if not needed
      intervalId = setInterval(() => {
        // No need to check status anymore, we're just using a timer
        clearInterval(intervalId);

        // After a timeout, assume payment is done and redirect
        setPaymentStatus("Completed");

        notification.success({
          message: "Thanh toán thành công",
          description:
            "Thanh toán của bạn đã được xác nhận. Đơn hàng đang được xử lý.",
          placement: "topRight",
          duration: 4,
        });

        // Dispatch order success event
        window.dispatchEvent(new Event("orderSuccess"));

        // Navigate to order confirmation or order detail page
        setTimeout(() => {
          navigate("/user/orders");
        }, 2000);
      }, 300000); // 5 minutes - you can adjust this timeout
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId, paymentStatus, navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  // Add a function to handle payment confirmation
  const handlePaymentConfirmation = async () => {
    try {
      setProcessingPayment(true);

      // Đã có payment ID (từ khi tạo payment QR), không cần tạo mới
      if (!paymentId || paymentId.startsWith("vietqr_")) {
        // Trường hợp hiếm khi không có paymentId hợp lệ
        console.warn("Không tìm thấy payment ID hợp lệ");
      } else {
        console.log("Cập nhật trạng thái cho payment ID:", paymentId);
      }

      // Xóa các sản phẩm đã chọn khỏi giỏ hàng
      try {
        // Lấy danh sách sản phẩm từ localStorage
        const pendingCartItems = JSON.parse(
          localStorage.getItem(`pendingCartItems_${orderId}`) || "[]"
        );

        if (pendingCartItems && pendingCartItems.length > 0) {
          console.log("Removing items from cart:", pendingCartItems);

          // Xóa từng sản phẩm khỏi giỏ hàng
          for (const shoppingCartDetailID of pendingCartItems) {
            await deleteShoppingCartDetailById(shoppingCartDetailID);
          }

          // Xóa danh sách đã lưu sau khi xử lý xong
          localStorage.removeItem(`pendingCartItems_${orderId}`);

          // Phát sự kiện cập nhật giỏ hàng
          window.dispatchEvent(new Event("cartUpdated"));

          console.log("All items have been removed from shopping cart");
        } else {
          console.warn("No pending cart items found for order:", orderId);
        }
      } catch (cartError) {
        console.error("Error removing items from cart:", cartError);
        // Continue anyway, don't block the flow
      }

      // Cập nhật trạng thái đơn hàng và giảm số lượng trong kho
      try {
        // Cập nhật với reduceInventory = true để giảm số lượng trong kho
        await updateStatus(orderId, "Pending", true);
        console.log(
          "Đã cập nhật trạng thái đơn hàng và giảm số lượng trong kho:",
          orderId
        );
      } catch (updateError) {
        console.error("Error updating order status:", updateError);
        // Continue anyway, don't block the flow
      }

      // Tạo thông báo cho người dùng và admin
      try {
        // Tạo thông báo cho người dùng
        const notificationDataUser = {
          senderType: "system",
          receiverID: localStorage.getItem("userID"),
          title: "Thông báo đơn hàng",
          message: `Đơn hàng #${orderId} đã được thanh toán thành công.`,
          type: "order",
          orderID: orderId,
        };

        // Tạo thông báo cho admin
        const notificationDataAdmin = {
          senderType: "system",
          receiverID: "admin",
          title: "Thông báo đơn hàng",
          message: `Đơn hàng #${orderId} đã được thanh toán, cần được duyệt.`,
          type: "order",
          orderID: orderId,
        };

        await createNotify(notificationDataUser);
        await createNotify(notificationDataAdmin);
        console.log("Đã tạo thông báo thành công");
      } catch (notifyError) {
        console.error("Error creating notifications:", notifyError);
        // Continue anyway
      }

      // Phát sự kiện cập nhật thông báo
      window.dispatchEvent(new Event("orderSuccess"));

      notification.success({
        message: "Thành công",
        description: "Thanh toán thành công! Đơn hàng của bạn đang được xử lý.",
        placement: "topRight",
        duration: 4,
      });

      // Update payment status in UI
      setPaymentStatus("Completed");

      // Scroll to top và chuyển trang
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        navigate("/user/orders");
      }, 1500);
    } catch (error) {
      console.error("Error processing payment:", error);
      // Make sure we don't rely on error.message which might be undefined
      notification.error({
        message: "Lỗi",
        description:
          "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại sau.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Spin size="large" tip="Đang tạo mã QR thanh toán..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Result
          status="error"
          title="Lỗi thanh toán"
          subTitle={error}
          extra={[
            <Button
              key="back"
              onClick={handleCancel}
              type="primary"
              style={{
                background: "linear-gradient(to right, #82AE46, #5A8E1B)",
                color: "white",
              }}>
              Quay lại
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (paymentStatus === "Completed") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Cảm ơn bạn đã thanh toán đơn hàng #${orderId}. Đơn hàng của bạn đang được xử lý.`}
          extra={[
            <Button
              key="orders"
              onClick={() => navigate("/user/orders")}
              type="primary"
              style={{
                background: "linear-gradient(to right, #82AE46, #5A8E1B)",
                color: "white",
              }}>
              Xem đơn hàng
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-[10%] ">
      <Divider style={{ borderColor: "#7cb305" }} />
      <h2 className="text-2xl font-bold mb-6">
        Thanh toán đơn hàng #{orderId}
      </h2>

      <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Quét mã QR VietQR để thanh toán
          </h3>
          <p className="text-gray-600">
            Số tiền:{" "}
            <span className="font-bold text-green-600">
              {parseInt(amount).toLocaleString()} VND
            </span>
          </p>
          <p className="text-gray-600 font-medium">Mã đơn hàng: #{orderId}</p>

          {paymentMethod && (
            <p className="text-gray-600">
              Phương thức: <span className="font-medium">{paymentMethod}</span>
            </p>
          )}

          {paymentContent && (
            <div className="mt-2 bg-green-50 p-2 rounded-md">
              <Text strong>Nội dung chuyển khoản:</Text>
              <Paragraph copyable className="font-bold text-green-700">
                {paymentContent}
              </Paragraph>
              <p className="text-xs text-green-800 mt-1">
                Vui lòng nhập nội dung chuyển khoản theo quy định
              </p>
            </div>
          )}

          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
        </div>

        {qrCodeUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={qrCodeUrl}
              alt="VietQR Code"
              className="w-64 h-64 object-contain"
            />
          </div>
        )}

        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold">Ngân hàng:</span> MB Bank
          </p>
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold">Số tài khoản:</span> 868629052003
          </p>
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold">Chủ tài khoản:</span> HUYNH HOANG
            PHUC
          </p>
          <p className="text-sm text-gray-500">
            Vui lòng sử dụng ứng dụng ngân hàng hỗ trợ VietQR để quét mã và hoàn
            tất thanh toán
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Các ứng dụng như Momo, Vietcombank, Techcombank, MB Bank, ACB,
            BIDV,...)
          </p>
          <p className="text-xs text-red-500 mt-3 font-medium">
            Lưu ý: Vui lòng không tắt trang này cho đến khi hoàn tất thanh toán
          </p>
        </div>

        <div className="flex justify-between">
          <Button onClick={handleCancel} danger>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handlePaymentConfirmation}
            loading={processingPayment}
            disabled={processingPayment || paymentStatus === "Completed"}
            style={{
              background: "linear-gradient(to right, #82AE46, #5A8E1B)",
              color: "white",
            }}>
            Đã thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
