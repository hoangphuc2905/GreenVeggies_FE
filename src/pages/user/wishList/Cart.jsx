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
import { useEffect, useMemo, useState } from "react";
import { getProductById } from "../../../services/ProductService";
import { CalcPrice } from "../../../components/calcSoldPrice/CalcPrice";
import {
  deleteShoppingCartDetailById,
  getShoppingCartByUserId,
  updateCartQuantity,
  deleteShoppingCartById,
} from "../../../services/ShoppingCartService";
const Cart = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

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

    // Find the current item
    const currentItem = wishlist.find((item) => item.productID === productID);

    // Check if quantity exceeds available stock
    if (currentItem && value > currentItem.quantity) {
      // Check available stock by fetching latest product data
      try {
        const productDetails = await getProductById(productID);

        if (productDetails && value > productDetails.quantity) {
          // Show modal with warning message
          Modal.warning({
            title: "Giới hạn số lượng",
            content: `Rất tiếc, bạn chỉ có thể mua tối đa ${productDetails.quantity} sản phẩm của chương trình giảm giá này.`,
            okText: "OK",
            okButtonProps: {
              style: {
                backgroundColor: "#F05123",
                borderColor: "#F05123",
              },
            },
            centered: true,
          });

          // Set quantity to maximum available
          value = productDetails.quantity;
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
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

  // Xử lý chọn/bỏ chọn tất cả sản phẩm
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(mergedWishlist.map((item) => item.shoppingCartDetailID));
    } else {
      setSelectedItems([]);
    }
  };

  // Xử lý chọn/bỏ chọn một sản phẩm
  const handleSelectItem = (shoppingCartDetailID, checked) => {
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
                <div className="grid grid-cols-7 items-center p-4 font-semibold cursor-pointer">
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
                    <p className="max-w-[300px] break-words">
                      {item.name || "No name available"}
                    </p>
                  </div>

                  <div className="col-span-1 text-center">
                    {(CalcPrice(item.price) || 0).toLocaleString()} VND
                  </div>
                  <div className="col-span-1 text-center">
                    <InputNumber
                      min={0}
                      value={item.quantity}
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
                      onChange={(e) =>
                        handleSelectItem(
                          item.shoppingCartDetailID,
                          e.target.checked
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
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-all duration-200 w-full"
                onClick={clearCart}>
                Xóa tất cả sản phẩm
              </button>
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
