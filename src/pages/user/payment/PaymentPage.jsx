import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Spin, Result, notification, Divider, Typography } from "antd";
import {
  createPaymentQR,
  checkPaymentStatus,
} from "../../../services/PaymentService";

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
        console.log("QR code response:", response);

        // More detailed logging for debugging
        console.log(
          "QR code content:",
          response.content ? response.content : "No content provided"
        );
        console.log(
          "Payment method:",
          response.paymentMethod || "No method provided"
        );
        console.log(
          "Payment ID:",
          response.paymentId || "No payment ID provided"
        );

        if (response?.qrCodeUrl) {
          setQrCodeUrl(response.qrCodeUrl);
          setSuccessMessage(
            response.message || "Mã QR thanh toán đã được tạo thành công"
          );

          // If the API returns a payment ID, store it
          if (response.paymentId) {
            setPaymentId(response.paymentId);
          }

          // Store payment content if available
          if (response.content) {
            setPaymentContent(response.content);
            console.log("Setting payment content:", response.content);
          } else {
            // Generate fallback content if not provided
            const fallbackContent =
              "TT" + Math.floor(100000 + Math.random() * 900000);
            setPaymentContent(fallbackContent);
            console.log("Using fallback payment content:", fallbackContent);
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
      intervalId = setInterval(async () => {
        try {
          const statusResponse = await checkPaymentStatus(paymentId);

          if (statusResponse?.payment?.paymentStatus === "Completed") {
            setPaymentStatus("Completed");
            clearInterval(intervalId);

            notification.success({
              message: "Thanh toán thành công",
              description:
                "Thanh toán của bạn đã được xác nhận. Đơn hàng đang được xử lý.",
              placement: "topRight",
              duration: 4,
            });

            // Navigate to order confirmation or order detail page
            setTimeout(() => {
              navigate("/user/orders");
            }, 2000);
          }
        } catch (err) {
          console.error("Error checking payment status:", err);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId, paymentStatus, navigate]);

  const handleCancel = () => {
    navigate("/");
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
            onClick={() => navigate("/user/orders")}
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
