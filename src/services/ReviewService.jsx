import { handleReviewApi } from "../api/api";

export const createReview = async (data) => {
  try {
    const response = await handleReviewApi.createReview(data);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};
