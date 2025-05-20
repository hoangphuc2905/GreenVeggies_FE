// Add notification to imports at the top
import {
  Divider,
  InputNumber,
  notification,
  Checkbox,
  Spin,
  Modal,
} from "antd";
import bgImage from "../../../assets/pictures/bg_1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import { getProductById } from "../../../services/ProductService";
import { CalcPrice } from "../../../components/calcSoldPrice/CalcPrice";
import {
  deleteShoppingCartDetailById,
  getShoppingCartByUserId,
  updateCartQuantity,
  deleteShoppingCartById,
} from "../../../services/ShoppingCartService";

// Kiểm soát thông báo toàn cục
const notificationShown = {
  outOfStock: false,
  unavailable: false,
};

const Cart = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const isNotificationShownRef = useRef(false); // Sử dụng ref để theo dõi thông báo

  // Reset notification state when component unmounts
  useEffect(() => {
    return () => {
      notificationShown.outOfStock = false;
      notificationShown.unavailable = false;
      isNotificationShownRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
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
            // Tạo mảng để lưu tên các sản phẩm hết hàng và ngừng kinh doanh
            const outOfStockProducts = [];
            const unavailableProducts = [];

            const detailedWishlist = await Promise.all(
              fetchedWishlist.shoppingCartDetails.map(async (item) => {
                const productDetails = await getProductById(item.productID);
                // Kiểm tra trạng thái sản phẩm
                const isOutOfStock =
                  productDetails.status === "out_of_stock" ||
                  productDetails.quantity <= 0;
                const isUnavailable = productDetails.status === "unavailable";

                // Thêm tên sản phẩm vào danh sách tương ứng
                if (isOutOfStock) {
                  outOfStockProducts.push(productDetails.name);
                }
                if (isUnavailable) {
                  unavailableProducts.push(productDetails.name);
                }

                return {
                  ...item,
                  ...productDetails,
                  quantity: item.quantity || 1, // Ensure quantity is set
                  totalAmount:
                    (item.quantity || 1) *
                    (CalcPrice(productDetails.price) || 0), // Calculate totalAmount
                  isOutOfStock: isOutOfStock, // Chỉ đánh dấu sản phẩm hết hàng
                  isUnavailable: isUnavailable, // Đánh dấu sản phẩm ngừng kinh doanh
                };
              })
            );

            // Hiển thị thông báo cho sản phẩm hết hàng
            if (
              outOfStockProducts.length > 0 &&
              !notificationShown.outOfStock
            ) {
              let description;
              if (outOfStockProducts.length === 1) {
                description = `Sản phẩm "${outOfStockProducts[0]}" đã hết hàng. Bạn nên xóa sản phẩm này khỏi giỏ hàng.`;
              } else {
                description = `Các sản phẩm sau đã hết hàng:\n${outOfStockProducts
                  .map((name) => `- ${name}`)
                  .join(
                    "\n"
                  )}\n\nBạn nên xóa những sản phẩm này khỏi giỏ hàng.`;
              }

              // Đánh dấu đã hiển thị thông báo
              notificationShown.outOfStock = true;

              notification.warning({
                message: "Sản phẩm hết hàng",
                description: description,
                placement: "topRight",
                duration: 5,
                style: { whiteSpace: "pre-line" },
                onClose: () => {
                  // Sau 5 giây, cho phép hiển thị thông báo lại nếu cần
                  setTimeout(() => {
                    notificationShown.outOfStock = false;
                  }, 1000);
                },
              });
            }

            // Hiển thị thông báo cho sản phẩm ngừng kinh doanh
            if (
              unavailableProducts.length > 0 &&
              !notificationShown.unavailable
            ) {
              let description;
              if (unavailableProducts.length === 1) {
                description = `Sản phẩm "${unavailableProducts[0]}" đã ngừng kinh doanh. Bạn nên xóa sản phẩm này khỏi giỏ hàng.`;
              } else {
                description = `Các sản phẩm sau đã ngừng kinh doanh:\n${unavailableProducts
                  .map((name) => `- ${name}`)
                  .join(
                    "\n"
                  )}\n\nBạn nên xóa những sản phẩm này khỏi giỏ hàng.`;
              }

              // Đánh dấu đã hiển thị thông báo
              notificationShown.unavailable = true;

              notification.warning({
                message: "Sản phẩm ngừng kinh doanh",
                description: description,
                placement: "topRight",
                duration: 5,
                style: { whiteSpace: "pre-line" },
                onClose: () => {
                  // Sau 5 giây, cho phép hiển thị thông báo lại nếu cần
                  setTimeout(() => {
                    notificationShown.unavailable = false;
                  }, 1000);
                },
              });
            }

            setWishlist(detailedWishlist);
          } else {
            console.error("Fetched wishlist is not an array:", fetchedWishlist);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        } finally {
          setLoading(false);
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

  // Tính tổng giá tạm tính chỉ cho các sản phẩm được chọn
  const subtotal = useMemo(() => {
    return mergedWishlist
      .filter((item) => selectedItems.includes(item.shoppingCartDetailID))
      .reduce((acc, item) => acc + (item.totalAmount || 0), 0);
  }, [mergedWishlist, selectedItems]);

  const removeFromWishlist = async (shoppingCartDetailID) => {
    console.log(
      "Removing item with shoppingCartDetailID:",
      shoppingCartDetailID
    );

    try {
      // Call the API to delete the item from the wishlist
      const result = await deleteShoppingCartDetailById(shoppingCartDetailID);

      // Check if the result contains an error
      if (result && result.error) {
        notification.error({
          message: "Lỗi",
          description: result.error,
          placement: "topRight",
          duration: 3,
        });
        return false;
      }

      // If success, update local state: remove the deleted item
      const updatedWishlist = wishlist.filter(
        (item) => item.shoppingCartDetailID !== shoppingCartDetailID
      );
      setWishlist(updatedWishlist);

      // Update selected items list if needed
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== shoppingCartDetailID)
      );

      // Dispatch cartUpdated event
      window.dispatchEvent(new Event("cartUpdated"));

      // Show success notification
      notification.success({
        message: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng",
        placement: "topRight",
        duration: 3,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa sản phẩm khỏi giỏ hàng",
        placement: "topRight",
        duration: 3,
      });
      return false;
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

    // If value is 0, remove the item from cart
    if (value === 0) {
      // Find the item to get its shoppingCartDetailID
      const itemToRemove = wishlist.find(
        (item) => item.productID === productID
      );

      if (itemToRemove && itemToRemove.shoppingCartDetailID) {
        await removeFromWishlist(itemToRemove.shoppingCartDetailID);
        return;
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không tìm thấy thông tin chi tiết sản phẩm cần xóa",
          placement: "topRight",
          duration: 3,
        });
      }
      return;
    }

    if (value === null || value < 0) {
      console.error("Invalid value:", value);
      return;
    }

    // Trước khi cập nhật, kiểm tra số lượng với kho hàng
    try {
      // Lấy thông tin sản phẩm mới nhất từ API để có số lượng chính xác
      const productDetails = await getProductById(productID);

      if (!productDetails) {
        notification.error({
          message: "Lỗi",
          description: "Không thể lấy thông tin sản phẩm",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      // Kiểm tra nếu sản phẩm ngừng kinh doanh
      if (productDetails.status === "unavailable") {
        notification.error({
          message: "Sản phẩm ngừng kinh doanh",
          description:
            "Sản phẩm này đã ngừng kinh doanh, vui lòng xóa khỏi giỏ hàng",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      // Kiểm tra nếu sản phẩm đã hết hàng
      if (
        productDetails.status === "out_of_stock" ||
        productDetails.quantity <= 0
      ) {
        notification.error({
          message: "Sản phẩm hết hàng",
          description: "Sản phẩm này đã hết hàng, vui lòng xóa khỏi giỏ hàng",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      // Kiểm tra số lượng yêu cầu có vượt quá số lượng trong kho không
      if (value > productDetails.quantity) {
        // Đặt số lượng là tối đa có sẵn trong kho
        value = productDetails.quantity;

        // Hiển thị thông báo
        notification.warning({
          message: "Giới hạn số lượng",
          description: `Số lượng đã được điều chỉnh xuống ${value} vì đó là số lượng tối đa có sẵn.`,
          placement: "topRight",
          duration: 3,
        });
      }

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

      // Dispatch cartUpdated event để cập nhật UI
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(
        "Failed to update quantity in database or update wishlist:",
        error
      );
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật số lượng sản phẩm",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  // Xử lý chọn/bỏ chọn tất cả sản phẩm
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      // Chỉ chọn các sản phẩm còn hàng và đang kinh doanh
      const availableItems = mergedWishlist
        .filter((item) => !item.isOutOfStock && !item.isUnavailable)
        .map((item) => item.shoppingCartDetailID);
      setSelectedItems(availableItems);
    } else {
      setSelectedItems([]);
    }
  };

  // Xử lý chọn/bỏ chọn một sản phẩm
  const handleSelectItem = (
    shoppingCartDetailID,
    checked,
    isOutOfStock,
    isUnavailable
  ) => {
    // Nếu sản phẩm hết hàng hoặc ngừng kinh doanh, không cho phép chọn
    if (isOutOfStock || isUnavailable) {
      return;
    }

    if (checked) {
      setSelectedItems([...selectedItems, shoppingCartDetailID]);
    } else {
      setSelectedItems(
        selectedItems.filter((id) => id !== shoppingCartDetailID)
      );
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      notification.warning({
        message: "Chưa chọn sản phẩm",
        description: "Vui lòng chọn ít nhất một sản phẩm để thanh toán",
        placement: "top",
        duration: 3,
      });
      return;
    }

    // Kiểm tra xem có sản phẩm hết hàng hoặc ngừng kinh doanh nào được chọn không
    const selectedProblematicItems = mergedWishlist.filter(
      (item) =>
        selectedItems.includes(item.shoppingCartDetailID) &&
        (item.isOutOfStock || item.isUnavailable)
    );

    if (selectedProblematicItems.length > 0) {
      // Tìm sản phẩm hết hàng
      const outOfStockItems = selectedProblematicItems.filter(
        (item) => item.isOutOfStock
      );

      // Tìm sản phẩm ngừng kinh doanh
      const unavailableItems = selectedProblematicItems.filter(
        (item) => item.isUnavailable
      );

      let errorMessage = "";

      if (outOfStockItems.length > 0 && unavailableItems.length > 0) {
        errorMessage =
          "Có sản phẩm đã hết hàng và ngừng kinh doanh. Vui lòng xóa những sản phẩm này khỏi giỏ hàng trước khi thanh toán.";
      } else if (outOfStockItems.length > 0) {
        errorMessage =
          "Một số sản phẩm đã hết hàng. Vui lòng xóa những sản phẩm này khỏi giỏ hàng trước khi thanh toán.";
      } else {
        errorMessage =
          "Một số sản phẩm đã ngừng kinh doanh. Vui lòng xóa những sản phẩm này khỏi giỏ hàng trước khi thanh toán.";
      }

      notification.error({
        message: "Không thể thanh toán",
        description: errorMessage,
        placement: "top",
        duration: 4,
      });
      return;
    }

    // Chỉ chuyển các sản phẩm đã chọn sang trang thanh toán
    const selectedProducts = mergedWishlist.filter((item) =>
      selectedItems.includes(item.shoppingCartDetailID)
    );
    navigate("/order", { state: { selectedProducts } });
  };

  // Add function to clear entire cart
  const clearCart = async () => {
    if (wishlist.length === 0) {
      notification.info({
        message: "Giỏ hàng trống",
        description: "Giỏ hàng của bạn hiện đang trống.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    // Confirm before deleting
    Modal.confirm({
      title: "Xác nhận xóa giỏ hàng",
      content: "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?",
      okText: "Xóa tất cả",
      cancelText: "Hủy",
      okButtonProps: {
        style: {
          backgroundColor: "#F05123",
          borderColor: "#F05123",
        },
      },
      onOk: async () => {
        try {
          // Get shoppingCartID from first item
          if (wishlist.length > 0) {
            const shoppingCartID = wishlist[0].shoppingCartID;

            const result = await deleteShoppingCartById(shoppingCartID);

            if (result && result.error) {
              notification.error({
                message: "Lỗi",
                description: result.error,
                placement: "topRight",
                duration: 3,
              });
              return;
            }

            // Update local state
            setWishlist([]);
            setSelectedItems([]);

            // Trigger cart update event
            window.dispatchEvent(new Event("cartUpdated"));

            notification.success({
              message: "Xóa thành công",
              description: "Đã xóa tất cả sản phẩm trong giỏ hàng",
              placement: "topRight",
              duration: 3,
            });
          }
        } catch (error) {
          console.error("Lỗi khi xóa giỏ hàng:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa giỏ hàng, vui lòng thử lại sau",
            placement: "topRight",
            duration: 3,
          });
        }
      },
    });
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
          <div className="grid grid-cols-7 h-[60px] bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] p-4 text-white font-semibold mb-4">
            <div className="col-span-1 flex justify-center"></div>
            <div className="col-span-2 flex justify-center">
              Danh sách sản phẩm
            </div>
            <div className="col-span-1 flex justify-center">Giá</div>
            <div className="col-span-1 flex justify-center">Số lượng</div>
            <div className="col-span-1 flex justify-center">Tổng</div>
            <div className="col-span-1 flex justify-center">
              <Checkbox
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <Spin
            spinning={loading}
            tip="Đang tải giỏ hàng..."
            className="[&_.ant-spin-dot]:!text-[#82AE46] [&_.ant-spin-text]:!text-[#82AE46]">
            {mergedWishlist.map((item, index) => (
              <div key={item.productID}>
                <div
                  className={`grid grid-cols-7 items-center p-4 font-semibold ${
                    item.isOutOfStock || item.isUnavailable
                      ? "opacity-50 cursor-not-allowed bg-gray-100"
                      : "cursor-pointer"
                  }`}>
                  <div className="col-span-1 flex justify-center">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="text-lg cursor-pointer border"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item.shoppingCartDetailID);
                      }}
                    />
                  </div>

                  <div
                    className="col-span-2 flex items-center gap-4"
                    onClick={() =>
                      !item.isOutOfStock &&
                      !item.isUnavailable &&
                      handleProductClick(item)
                    }>
                    <img
                      src={
                        Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                          ? item.imageUrl[0]
                          : item.imageUrl
                      }
                      alt={item.name}
                      className="w-[80px] h-auto"
                    />
                    <div>
                      <p className="max-w-[300px] break-words">
                        {item.name || "No name available"}
                      </p>
                      {item.isUnavailable ? (
                        <p className="text-red-500 text-sm">
                          Sản phẩm đã ngừng kinh doanh
                        </p>
                      ) : item.isOutOfStock ? (
                        <p className="text-red-500 text-sm">
                          Sản phẩm đã hết hàng
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    {(CalcPrice(item.price) || 0).toLocaleString()} VND
                  </div>
                  <div className="col-span-1 text-center">
                    <InputNumber
                      min={0}
                      value={item.quantity}
                      disabled={item.isOutOfStock}
                      onChange={(value) => {
                        if (value === null || value < 0) {
                          console.error("Invalid value:", value);
                          return;
                        }
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
                  <div className="col-span-1 flex justify-center">
                    <Checkbox
                      checked={selectedItems.includes(
                        item.shoppingCartDetailID
                      )}
                      disabled={item.isOutOfStock}
                      onChange={(e) =>
                        handleSelectItem(
                          item.shoppingCartDetailID,
                          e.target.checked,
                          item.isOutOfStock,
                          item.isUnavailable
                        )
                      }
                    />
                  </div>
                </div>

                {index < mergedWishlist.length - 1 && (
                  <Divider style={{ borderColor: "#7cb305" }} />
                )}
              </div>
            ))}
          </Spin>
        </div>

        <Divider style={{ borderColor: "#7cb305" }} />
        <div className="container mx-auto mt-4">
          <div className="grid grid-cols-7 bg-white p-4">
            <div className="col-span-4 bg-white py-4">
              <p className="mb-4 font-bold">Tổng giỏ hàng</p>
              <p className="mb-4">Tạm tính</p>
              <p className="mb-4">Tổng</p>
            </div>
            <div className="col-span-2 bg-white text-center py-4 mt-10">
              <p className="mb-4">{subtotal.toLocaleString()} VND</p>
              <p className="mb-4">{subtotal.toLocaleString()} VND</p>
            </div>

            <div className="col-span-1 flex flex-col justify-end gap-3">
              {/* Only show delete button if there are products in cart */}
              {wishlist.length > 0 && (
                <button
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-all duration-200 w-full"
                  onClick={clearCart}>
                  Xóa tất cả sản phẩm
                </button>
              )}
              <button
                className="bg-gradient-to-r from-[#82AE46] to-[#5A8E1B] text-white font-bold py-3 px-8 rounded-md hover:shadow-xl hover:scale-105 active:scale-105 active:shadow-lg transition-all duration-200 w-full"
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

export default Cart;
