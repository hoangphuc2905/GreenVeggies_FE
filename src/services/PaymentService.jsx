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

    const response = await handlePaymentApi.createPaymentQR(
      amount,
      orderID,
      paymentMethod
    );

    console.log("Payment QR API response:", response);

    if (response) {
      return {
        qrCodeUrl: response.qrURL,
        message: response.message,
        paymentId: response.paymentID,
        orderID: response.orderID,
        paymentMethod: response.paymentMethod,
        paymentStatus: response.paymentStatus,
        amount: response.amount,
        content: response.content,
      };
    }
    return response;
  } catch (error) {
    console.error("Error details:", error.response || error);
    console.error("Lỗi khi tạo mã QR thanh toán:", error.message);

    // Fallback: Tạo URL VietQR trực tiếp nếu API không hoạt động
    const vietQrUrl =
      "https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=" +
      amount +
      "&addInfo=Thanh%20toan%20don%20hang&accountName=HUYNH%20HOANG%20PHUC&acqId=970422";

    return {
      qrCodeUrl: vietQrUrl,
      message: "Tạo mã QR thanh toán tạm thời.",
      paymentId: "vietqr_" + Date.now(),
      paymentMethod: paymentMethod || "Bank Transfer",
      content: "TT" + Math.floor(100000 + Math.random() * 900000),
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
