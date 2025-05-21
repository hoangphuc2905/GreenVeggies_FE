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

    // Chỉ gọi API backend một lần duy nhất
    console.log("Đang gọi API tạo payment");
    const response = await handlePaymentApi.createPayment(
      amount,
      orderID,
      paymentMethod
    );

    // Nếu API trả về thành công
    if (response && response.paymentID) {
      console.log("Tạo payment thành công với ID:", response.paymentID);
      console.log("Content từ backend:", response.content);

      // Sử dụng content và QR URL từ backend
      return {
        qrCodeUrl:
          response.qrURL || createFallbackQRUrl(amount, response.content),
        message: response.message || "Tạo mã QR thanh toán thành công.",
        paymentId: response.paymentID,
        orderID: response.orderID || orderID,
        paymentMethod: response.paymentMethod || paymentMethod,
        paymentStatus: response.paymentStatus || "Pending",
        amount: response.amount || amount,
        content: response.content, // Luôn sử dụng content từ backend
      };
    }

    // Nếu không nhận được phản hồi hợp lệ, tìm payment từ cơ sở dữ liệu
    console.error("Không nhận được phản hồi hợp lệ từ API thanh toán");
    return findPaymentInDatabase(orderID);
  } catch (error) {
    console.error("Error details:", error.response || error);
    console.error("Lỗi khi tạo mã QR thanh toán:", error.message);

    // Trong trường hợp lỗi, tìm payment từ cơ sở dữ liệu
    return findPaymentInDatabase(orderID);
  }
};

/**
 * Helper function to create a fallback QR URL
 */
function createFallbackQRUrl(amount, content) {
  return `https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=${amount}&addInfo=${content}&accountName=HUYNH%20HOANG%20PHUC&acqId=970422`;
}

/**
 * Tìm payment đã có trong cơ sở dữ liệu
 */
async function findPaymentInDatabase(orderID) {
  try {
    const response = await handlePaymentApi.getPaymentByOrderId(orderID);

    // Nếu đã có payment trong database, sử dụng thông tin đó
    if (response && response.payment) {
      console.log("Đã tìm thấy payment trong database:", response.payment);
      return {
        qrCodeUrl: createFallbackQRUrl(
          response.payment.amount,
          response.payment.content
        ),
        message: "Sử dụng thông tin thanh toán đã lưu",
        paymentId: response.payment.paymentID,
        orderID: response.payment.orderID,
        paymentMethod: response.payment.paymentMethod,
        paymentStatus: response.payment.paymentStatus,
        amount: response.payment.amount,
        content: response.payment.content, // Sử dụng content từ database
      };
    }

    // Không tìm thấy payment và không tạo content mới
    throw new Error("Không tìm thấy thông tin thanh toán và không thể tạo mới");
  } catch (error) {
    // Nếu lỗi khi lấy payment từ database, trả về lỗi
    console.error("Không thể lấy thông tin payment từ database:", error);
    throw new Error("Không thể tạo hoặc lấy thông tin thanh toán");
  }
}

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
      return null; // Hoặc xử lý theo cách bạn muốn
    }
    return response.payment;
  } catch (error) {
    console.error("Error fetching payment by order ID:", error);
    throw error;
  }
};
