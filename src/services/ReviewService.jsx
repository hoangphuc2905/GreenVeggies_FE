import { handleReviewApi } from "../api/api";
import { getUserInfo } from "../services/UserService";

export const createReview = async (data) => {
  try {
    const response = await handleReviewApi.createReview(data);
    if (response && response.data) {
      return response.data;
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return null;
  } catch (error) {
    // Log the full error structure
    console.error("Full error structure:", error);

    if (error.response) {
      // For rate limit errors (429)
      if (error.response.status === 429) {
        console.error("Rate limit error (429):", error.response.data);
        throw {
          status: 429,
          data: error.response.data,
          message:
            error.response.data?.errors?.rateLimit ||
            "Quá nhiều yêu cầu trong thời gian ngắn",
        };
      }

      // For other API errors with response data
      if (error.response.data) {
        console.error(
          "Lỗi từ BE:",
          error.response.data.message || "Không có thông báo lỗi"
        );
        throw error.response.data;
      }
    }

    console.error("Lỗi khi tạo đánh giá:", error);
    throw new Error("Lỗi kết nối đến máy chủ!");
  }
};

export const getAllReviews = async () => {
  try {
    const response = await handleReviewApi.getAllReviews();
    if (response && response.data) {
      // Fetch user information for each review
      const reviewsWithUserInfo = await Promise.all(
        response.data.map(async (review) => {
          try {
            const userInfo = await getUserInfo(review.userID);
            return {
              ...review,
              user: userInfo,
            };
          } catch (error) {
            console.error(
              `Error fetching user info for review ${review._id}:`,
              error
            );
            return {
              ...review,
              user: null,
            };
          }
        })
      );
      return reviewsWithUserInfo;
    }
    console.error("API không trả về dữ liệu hợp lệ:", response);
    return [];
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Lỗi từ BE:", error.response.data.message);
      return { error: error.response.data.message };
    }
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return { error: "Lỗi kết nối đến máy chủ!" };
  }
};
