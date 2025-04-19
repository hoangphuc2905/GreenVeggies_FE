import { handlePaymentApi } from "../api/api";

/**
 * Creates a QR code for payment based on the provided amount
 * @param {number} amount - The payment amount
 * @returns {Promise<Object>} - The response containing the QR code data
 */
export const createPaymentQR = async (amount) => {
  try {
    return await handlePaymentApi.createPaymentQR(amount);
  } catch (error) {
    console.error("Error creating payment QR code:", error);
    throw error;
  }
};

/**
 * Checks the status of a payment
 * @param {string} paymentId - The ID of the payment to check
 * @returns {Promise<Object>} - The payment status data
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    return await handlePaymentApi.checkPaymentStatus(paymentId);
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
};
