const CalcPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return 0; // Trả về 0 nếu giá trị không hợp lệ
  }
  return price * 1.5; // Tính giá bán
};

const formattedPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "0 VNĐ"; // Trả về giá trị mặc định nếu không hợp lệ
  }
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(price).replace("₫", "VNĐ"); // Thay thế ₫ bằng VNĐ
};

export { formattedPrice, CalcPrice };
