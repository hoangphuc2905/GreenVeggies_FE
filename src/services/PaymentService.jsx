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
    const response = await handlePaymentApi.createPaymentQR(
      amount,
      orderID,
      paymentMethod
    );
    return response;
  } catch (error) {
    console.error("Error creating payment QR code:", error);
    throw error;
  }
};

/**
 * Checks the status of a payment
 * @param {string} paymentID - The ID of the payment to check
 * @returns {Promise<Object>} - The payment status data
 */
export const checkPaymentStatus = async (paymentID) => {
  try {
    return await handlePaymentApi.checkPaymentStatus(paymentID);
  } catch (error) {
    console.error("Error checking payment status at service:", error);
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
    return response.data.payment;
  } catch (error) {
    console.error("Error fetching payment by order ID:", error);
    throw error;
  }
};
