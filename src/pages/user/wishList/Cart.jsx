// Add notification to imports at the top
import { Divider, InputNumber, notification } from "antd";
import bgImage from "../../../assets/pictures/bg_1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getShoppingCartByUserId,
  getProductById,
  deleteShoppingCartDetailById,
  updateCartQuantity,
} from "../../../api/api"; // Import the API functions
import { CalcPrice } from "../../../components/calcSoldPrice/CalcPrice";
const Cart = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const userID = localStorage.getItem("userID");
      console.log("UserID:", userID); // Debugging statement
      if (userID) {
        try {
          const fetchedWishlist = await getShoppingCartByUserId(userID);
          console.log("Fetched wishlist:", fetchedWishlist); // Debugging statement
          if (
            fetchedWishlist &&
            Array.isArray(fetchedWishlist.shoppingCartDetails)
          ) {
            const detailedWishlist = await Promise.all(
              fetchedWishlist.shoppingCartDetails.map(async (item) => {
                const productDetails = await getProductById(item.productID);
                return {
                  ...item,
                  ...productDetails,
                  quantity: item.quantity || 1, // Ensure quantity is set
                  totalAmount:
                    (item.quantity || 1) *
                    (CalcPrice(productDetails.price) || 0), // Calculate totalAmount
                };
              })
            );
            setWishlist(detailedWishlist);
          } else {
            console.error("Fetched wishlist is not an array:", fetchedWishlist);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        }
      }
    };

    fetchWishlist();
  }, []);

  // Gộp các sản phẩm trùng lặp dựa trên productID
  const mergedWishlist = useMemo(() => {
    const productMap = new Map();
    wishlist.forEach((item) => {
      productMap.set(item.productID, { ...item });
    });
    return Array.from(productMap.values());
  }, [wishlist]);

  // Tính tổng giá tạm tính
  const subtotal = mergedWishlist.reduce(
    (acc, item) => acc + (item.totalAmount || 0),
    0
  );

  const removeFromWishlist = async (shoppingCartDetailID) => {
    console.log(
      "Removing item with shoppingCartDetailID:",
      shoppingCartDetailID
    );

    // Call the API to delete the item from the wishlist
    const result = await deleteShoppingCartDetailById(shoppingCartDetailID);
    if (result) {
      const updatedWishlist = wishlist.filter(
        (item) => item.shoppingCartDetailID !== shoppingCartDetailID
      );
      setWishlist(updatedWishlist);

      // Cập nhật số lượng sản phẩm trong giỏ hàng ở Header
      const event = new CustomEvent("wishlistUpdated", {
        detail: updatedWishlist.length,
      });
      window.dispatchEvent(event);
    } else {
      console.error("Failed to remove item from wishlist");
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`, {
      state: { productID: product.productID },
    });
  };
  const handleQuantityChange = async (shoppingCartID, productID, value) => {
    console.log("ShoppingCartID:", shoppingCartID);
    console.log("ProductID:", productID);
    console.log("Value:", value);

    if (!productID) {
      console.error("ProductID is invalid:", productID);
      return;
    }

    if (value === null || value < 1) {
      console.error("Invalid value:", value);
      return;
    }

    try {
      // Cập nhật danh sách wishlist
      setWishlist((prevWishlist) => {
        const updatedWishlist = prevWishlist.map((item) =>
          item.productID === productID
            ? {
                ...item,
                quantity: value,
                totalAmount: value * (CalcPrice(item.price) || 0),
              }
            : item
        );

        // Cập nhật localStorage
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        return updatedWishlist;
      });

      // Gọi API để cập nhật số lượng
      const result = await updateCartQuantity(shoppingCartID, productID, value);
      if (!result) {
        console.error("Failed to update quantity in database.");
      }
    } catch (error) {
      console.error(
        "Failed to update quantity in database or update wishlist:",
        error
      );
    }
  };
  const handleCheckout = () => {
    if (mergedWishlist.length === 0) {
      notification.warning({
        message: "Giỏ hàng trống",
        description: "Bạn chưa có sản phẩm nào trong giỏ hàng",
        placement: "top",
        duration: 3,
      });
      return;
    }
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
                        removeFromWishlist(item.shoppingCartDetailID); // Pass shoppingCartDetailID here
                      }}
                    />
                  </div>

                  <div
                    className="col-span-2 flex items-center gap-4 "
                    onClick={() => handleProductClick(item)}
                  >
                    <img
                      src={
                        Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                          ? item.imageUrl[0]
                          : item.imageUrl
                      }
                      alt={item.name}
                      className="w-[80px] h-auto"
                    />
                    <p className="max-w-[300px] break-words">
                      {item.name || "No name available"}
                    </p>
                  </div>

                  <div className="col-span-1 text-center">
                    {(CalcPrice(item.price) || 0).toLocaleString()} VND
                  </div>
                  <div className="col-span-1 text-center">
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => {
                        if (value === null || value < 1) {
                          console.error("Invalid value:", value);
                          return;
                        }

                        console.log(
                          "Changing quantity for:",
                          item.productID,
                          "New value:",
                          value
                        );
                        handleQuantityChange(
                          item.shoppingCartID,
                          item.productID,
                          value
                        );
                      }}
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    {(
                      (CalcPrice(item.price) || 0) * item.quantity
                    ).toLocaleString()}{" "}
                    VND
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
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
