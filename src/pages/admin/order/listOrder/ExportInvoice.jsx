import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../../../services/UserService";
import { getProductById } from "../../../../services/ProductService";
import logo from "../../../../assets/pictures/logo.png";
import PropTypes from "prop-types";
import { formattedPrice } from "../../../../components/calcSoldPrice/CalcPrice";

// Hàm tính phí vận chuyển giống logic hệ thống
const calculateShippingFee = (
  orderTotal,
  isNewCustomer = false,
  isVIP = false
) => {
  if (isVIP) return 0;
  if (isNewCustomer) return 50000 * 0.5;
  if (orderTotal >= 600000) return 0;
  if (orderTotal >= 400000) return 15000;
  if (orderTotal >= 200000) return 30000;
  return 50000;
};

const ExportInvoice = ({ order, customerName }) => {
  // State lưu tên khách hàng (userName) và tên sản phẩm (productNames)
  const [userName, setUserName] = useState(customerName || "");
  const [productNames, setProductNames] = useState({});
  // Không dùng productPrices, productTotals ở state nữa

  // Lấy tên khách hàng từ userID nếu chưa có
  useEffect(() => {
    const fetchName = async () => {
      if (!userName && order?.userID) {
        try {
          const user = await getUserInfo(order.userID);
          setUserName(user?.username || order.userID);
        } catch {
          setUserName(order.userID);
        }
      }
    };
    fetchName();
    // eslint-disable-next-line
  }, [order, customerName]);

  // Lấy tên sản phẩm, xuất xứ cho từng productID trong order
  useEffect(() => {
    const fetchProductNames = async () => {
      if (!order?.orderDetails) return;
      const names = {};
      await Promise.all(
        order.orderDetails.map(async (item) => {
          try {
            const product = await getProductById(item.productID);
            let productName = product?.name || item.productID;
            if (product?.origin) {
              productName += ` (${product.origin})`;
            }
            names[item.productID] = productName;
          } catch {
            names[item.productID] = item.productID;
          }
        })
      );
      setProductNames(names);
    };
    fetchProductNames();
  }, [order]);

  // Nếu không có đơn hàng thì không hiển thị gì cả
  if (!order) return null;

  // Tính tổng số lượng sản phẩm trong đơn hàng
  const totalQuantity = order.orderDetails?.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Tính tổng tiền sản phẩm (không bao gồm phí ship)
  const totalProductPrice = order.orderDetails?.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  // Tính phí vận chuyển
  const shippingFee = calculateShippingFee(totalProductPrice);

  // Hiển thị giao diện hóa đơn xuất PDF
  // - Logo, tên shop, địa chỉ, số điện thoại
  // - Thông tin gửi/nhận
  // - Tổng số lượng sản phẩm
  // - Bảng sản phẩm: mã, tên, số lượng (tên có thể kèm xuất xứ)
  // - Tổng tiền hóa đơn, ô chữ ký người nhận
  return (
    <div
      className="w-[800px] mx-auto bg-white border border-gray-300 p-10"
      id="invoice-content"
    >
      {/* Logo và tên shop */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2">
          <img src={logo} alt="Logo" className="w-36 h-36 object-contain" />
          <div className="-ml-6">
            <span className="font-bold text-2xl text-green-700 block">
              Green Veggies Shop
            </span>
            <span className="block text-gray-700 text-base">
              12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh
            </span>
            <span className="block text-gray-700 text-base">
              +84 333 319 121
            </span>
          </div>
        </div>
        <div>
          <span className="font-bold">Mã đơn hàng: </span>
          {order.orderID}
        </div>
      </div>
      {/* Hàng 2: Thông tin gửi/nhận */}
      <div className="flex justify-between border border-dashed border-gray-400 p-4 mb-4">
        <div>
          <div className="font-bold">Từ:</div>
          <div>Green Veggies Shop</div>
          <div className="text-gray-700 text-sm">
            12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh
          </div>
          <div className="text-gray-700 text-sm">+84 333 319 121</div>
        </div>
        <div>
          <div className="font-bold">Đến:</div>
          <div>
            {userName} <br />
            {order.address} <br />
            {order.phone}
          </div>
        </div>
      </div>
      {/* Hàng 3: Tổng số lượng sản phẩm */}
      <div className="mb-4 text-lg">
        <span className="font-bold">Tổng số lượng sản phẩm: </span>
        {totalQuantity}
      </div>
      {/* Hàng 4: Bảng sản phẩm */}
      <div className="mb-4">
        <table className="w-full border-collapse text-base">
          <thead>
            <tr>
              <th className="border-b border-gray-300 text-left py-2">Mã SP</th>
              <th className="border-b border-gray-300 text-left py-2">
                Tên SP
              </th>
              <th className="border-b border-gray-300 text-right py-2">
                Đơn giá
              </th>
              <th className="border-b border-gray-300 text-right py-2">
                Số lượng
              </th>
              <th className="border-b border-gray-300 text-right py-2">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails?.map((item) => (
              <tr key={item.productID}>
                <td className="py-1">{item.productID}</td>
                <td className="py-1">{productNames[item.productID] || ""}</td>
                <td className="py-1 text-right">
                  {formattedPrice(
                    item.quantity > 0 ? item.totalAmount / item.quantity : 0
                  )}
                </td>
                <td className="text-right py-1">{item.quantity}</td>
                <td className="py-1 text-right">
                  {formattedPrice(item.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Hàng 5: Tổng tiền, phí vận chuyển và chữ ký */}
      <div className="flex justify-between items-end mt-10">
        <div className="flex flex-col gap-2 text-lg">
          <div>
            <span className="font-bold">Tổng tiền sản phẩm: </span>
            <span>{formattedPrice(totalProductPrice)}</span>
          </div>
          <div>
            <span className="font-bold">Phí vận chuyển: </span>
            <span>{formattedPrice(shippingFee)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Tổng tiền hóa đơn: </span>
            <span className="text-2xl text-green-700 font-bold border border-green-400 rounded px-4 py-2 bg-green-50 shadow-sm">
              {formattedPrice(order.totalAmount)}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold">Người nhận</div>
          <div className="border border-gray-300 w-40 h-14 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

ExportInvoice.propTypes = {
  // order: Đối tượng đơn hàng, chứa thông tin đơn và danh sách sản phẩm
  order: PropTypes.shape({
    orderID: PropTypes.string.isRequired,
    userID: PropTypes.string,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productID: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        totalAmount: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  // customerName: Tên khách hàng (nếu có)
  customerName: PropTypes.string,
};

export default ExportInvoice;
