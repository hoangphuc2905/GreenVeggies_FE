import { handleStatisticApi } from "../api/api";

//Lấy thống kê doanh thu theo ngày từ api
export const getRevenueByDate = async (date) => {
  try {
    const response = await handleStatisticApi.getDailyRevenue(date);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//Tình trạng doanh thu theo ngày
export const getPaymentStatusByDate = async (date) => {
  try {
    const response = await handleStatisticApi.getRevenueByPaymentMethod(date);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//Tình trạng doanh thu theo tháng
