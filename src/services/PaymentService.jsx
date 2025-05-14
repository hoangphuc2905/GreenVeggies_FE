import { handlePaymentApi } from "../api/api";

/**
 * Creates a QR code for payment based on the provided parameters
 * @param {number} amount - The payment amount
 * @param {string} orderID - The order ID
 * @param {string} paymentMethod - The payment method (Bank Transfer or Cash)
 * @returns {Promise<Object>} - The response containing the QR code data
 */
export const createPaymentQR = async (amount, orderID, paymentMethod) => {
  try {
    console.log(
      "Creating payment QR for amount:",
      amount,
      "orderID:",
      orderID,
      "method:",
      paymentMethod
    );

    // Tạo mã nội dung (content) duy nhất ngay từ đầu
    const content = "TT" + Math.floor(100000 + Math.random() * 900000);

    // Gọi API để tạo thanh toán với content được tạo từ trước
    const response = await handlePaymentApi.createPayment(
      amount,
      orderID,
      paymentMethod,
      content
    );

    console.log("Payment API response:", response);

    if (response && response.payment) {
      // Tạo URL VietQR với content đã tạo
      const vietQrUrl =
        "https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=" +
        amount +
        "&addInfo=" +
        content +
        "&accountName=HUYNH%20HOANG%20PHUC&acqId=970422";

      // Trả về kết quả với content đã tạo (đảm bảo nhất quán)
      return {
        qrCodeUrl: vietQrUrl,
        message: "Tạo mã QR thanh toán thành công.",
        paymentId: response.payment.paymentID,
        orderID: response.payment.orderID,
        paymentMethod: response.payment.paymentMethod,
        paymentStatus: response.payment.paymentStatus,
        amount: response.payment.amount,
        content: content, // Sử dụng content đã tạo, không phải response.payment.content
      };
    }

    // Nếu không nhận được phản hồi từ API, tạo kết quả dự phòng
    console.error("Không nhận được phản hồi từ API thanh toán");

    // Tạo URL VietQR dự phòng
    const fallbackVietQrUrl =
      "https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=" +
      amount +
      "&addInfo=" +
      content +
      "&accountName=HUYNH%20HOANG%20PHUC&acqId=970422";

    return {
      qrCodeUrl: fallbackVietQrUrl,
      message: "Tạo mã QR thanh toán tạm thời.",
      paymentId: "vietqr_" + Date.now(),
      paymentMethod: paymentMethod || "Bank Transfer",
      content: content, // Sử dụng content đã tạo từ đầu
    };
  } catch (error) {
    console.error("Error details:", error.response || error);
    console.error("Lỗi khi tạo mã QR thanh toán:", error.message);

    // Trong trường hợp lỗi, vẫn sử dụng content đã tạo từ đầu
    const content = "TT" + Math.floor(100000 + Math.random() * 900000);

    // Tạo URL VietQR dự phòng
    const vietQrUrl =
      "https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=" +
      amount +
      "&addInfo=" +
      content +
      "&accountName=HUYNH%20HOANG%20PHUC&acqId=970422";

    return {
      qrCodeUrl: vietQrUrl,
      message: "Tạo mã QR thanh toán tạm thời.",
      paymentId: "vietqr_" + Date.now(),
      paymentMethod: paymentMethod || "Bank Transfer",
      content: content,
    };
  }
};

/**
 * Checks the status of a payment
 * @param {string} paymentID - The ID of the payment to check
 * @returns {Promise<Object>} - The payment status data
 */
export const checkPaymentStatus = async (paymentID) => {
  try {
    const response = await handlePaymentApi.checkPaymentStatus(paymentID);
    if (!response) {
      throw new Error("No response from payment status check");
    }
    return response;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};

/**
 * Gets payment information by order ID
 * @param {string} orderID - The order ID to find payment for
 * @returns {Promise<Object>} - The payment data
 */
export const getPaymentByOrderId = async (orderID) => {
  try {
    const response = await handlePaymentApi.getPaymentByOrderId(orderID);
    if (!response || !response.payment) {
      throw new Error("No payment data found for order");
    }
    return response.payment;
  } catch (error) {
    console.error("Error fetching payment by order ID:", error);
    throw error;
  }
};
