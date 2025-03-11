import { Divider, InputNumber } from "antd";
import bgImage from "../../../assets/bg_1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage khi trang được tải
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Gộp các sản phẩm trùng lặp dựa trên productID
  const mergedWishlist = useMemo(() => {
    const productMap = new Map();
    wishlist.forEach((item) => {
      if (productMap.has(item.productID)) {
        const existingItem = productMap.get(item.productID);
        existingItem.quantity += item.quantity;
      } else {
        productMap.set(item.productID, { ...item });
      }
    });
    return Array.from(productMap.values());
  }, [wishlist]);

  // Tính tổng giá tạm tính
  const subtotal = mergedWishlist.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const removeFromWishlist = (id) => {
    console.log("Removing item with id:", id);
    const updatedWishlist = wishlist.filter((item) => item.productID !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Cập nhật số lượng sản phẩm trong giỏ hàng ở Header
    const event = new CustomEvent("wishlistUpdated", {
      detail: updatedWishlist.length,
    });
    window.dispatchEvent(event);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`, {
      state: { productID: product.productID },
    });
  };

  const handleQuantityChange = (id, value) => {
    if (value < 1) return;
    const updatedWishlist = wishlist.map((item) =>
      item.productID === id ? { ...item, quantity: value } : item
    );
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleCheckout = () => {
    navigate("/order");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col  px-[10%]">
      <div className="container mx-auto mt-14">
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
        <div className="relative">
          <img src={bgImage} alt="Mô tả hình ảnh" className="w-full h-auto" />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-white text-6xl md:text-8xl font-bold font-amatic">
              Giỏ Hàng
            </h2>
          </div>
        </div>

        <div className="container mx-auto mt-4">
          {/* Hàng tiêu đề */}
          <div className="grid grid-cols-6 h-[60px] bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] p-4 text-white font-semibold mb-4">
            <div className="col-span-1 flex justify-center"></div>
            <div className="col-span-2 flex justify-center">
              Danh sách sản phẩm
            </div>
            <div className="col-span-1 flex justify-center">Giá</div>
            <div className="col-span-1 flex justify-center">Số lượng</div>
            <div className="col-span-1 flex justify-center">Tổng</div>
          </div>

          {/* Danh sách sản phẩm */}
          {mergedWishlist.map((item, index) => {
            console.log("Item:", item); // Thêm dòng này để kiểm tra giá trị của item
            return (
              <div key={item.productID}>
                <div className="grid grid-cols-6 items-center p-4 font-semibold cursor-pointer">
                  <div className="col-span-1 flex justify-center">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="text-lg cursor-pointer border"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện onClick của sản phẩm
                        removeFromWishlist(item.productID);
                      }}
                    />
                  </div>

                  <div
                    className="col-span-2 flex items-center gap-4 "
                    onClick={() => handleProductClick(item)}>
                    <img
                      src={
                        Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                          ? item.imageUrl[0]
                          : item.imageUrl
                      }
                      alt={item.name}
                      className="w-[80px] h-auto"
                    />
                    <p className="max-w-[300px] break-words">{item.name}</p>
                  </div>

                  <div className="col-span-1 text-center">
                    {item.price.toLocaleString()} VND
                  </div>
                  <div className="col-span-1 text-center">
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) =>
                        handleQuantityChange(item.productID, value)
                      }
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </div>
                </div>

                {/* Chỉ hiển thị Divider nếu không phải sản phẩm cuối cùng */}
                {index < mergedWishlist.length - 1 && (
                  <Divider style={{ borderColor: "#7cb305" }} />
                )}
              </div>
            );
          })}
        </div>

        <Divider style={{ borderColor: "#7cb305" }} />
        <div className="container mx-auto mt-4">
          <div className="grid grid-cols-6 bg-white p-4">
            <div className="bg-white py-4"></div>
            <div className="bg-white py-4">
              <p className="mb-4 font-bold">Tổng giỏ hàng</p>
              <p className="mb-4">Tạm tính</p>
              <p className="mb-4">Tổng</p>
            </div>
            <div className="bg-white text-center py-4"></div>
            <div className="bg-white text-center py-4"></div>
            <div className="bg-white text-center py-4"></div>
            <div className="bg-white text-center py-4 mt-10">
              <p className="mb-4">{subtotal.toLocaleString()} VND</p>
              <p className="mb-4">{subtotal.toLocaleString()} VND</p>
            </div>

            {/* Thêm nút thanh toán vào cột 5 và 6 */}
            <div className="col-span-2 col-start-5 flex justify-end mt-4">
              <button
                className="bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] text-white font-bold py-2 px-6 rounded-md hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 w-full"
                onClick={handleCheckout}>
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
