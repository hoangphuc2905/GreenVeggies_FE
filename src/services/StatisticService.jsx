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
//Thống kê đơn hàng theo trạng thái
export const getOrderStatusByDate = async (day, month, year) => {
  try {
    const response = await handleStatisticApi.getOrderStatsByStatus(
      day,
      month,
      year
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//Thống kê doanh thu theo năm
export const getYearlyRevenue = async (year) => {
  try {
    const response = await handleStatisticApi.getYearlyRevenue(year);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//Thống kê đơn hàng thành công theo tháng của năm

export const getMonthlyOrderStats = async (month, year) => {
  try {
    console.log("Thángs:", month);
    console.log("Năms:", year);
    const response = await handleStatisticApi.getMonthlySuccessfulOrders(
      month,
      year
    );
    console.log("Thống kê đơn hàng s:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//Lấy danh sách đơn hàng theo ngày, tháng và năm
export const getListOrdersStatusByDate = async ({
  day,
  month,
  year,
  status,
}) => {
  try {
    console.log("Ngày:", day);
    console.log("Tháng:", month);
    console.log("Năm:", year);
    console.log("Trạng thái:", status);
    const response = await handleStatisticApi.getOrderStatusByDate({
      day,
      month,
      year,
      status,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
