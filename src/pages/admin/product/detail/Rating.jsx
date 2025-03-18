import { Avatar, Card, ConfigProvider, Rate, Button, Divider } from "antd";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getUserInfo } from "../../../../api/api";
import EmptyRating from "../../emptyData/EmptyRating";
const { Meta } = Card;

const Rating = ({ product }) => {
  const [userData, setUserData] = useState({});
  const [visibleReviews, setVisibleReviews] = useState(4); // Ban đầu hiển thị 4 đánh giá

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!product?.reviews) return;

      const uniqueUserIDs = [...new Set(product.reviews.map((r) => r.userID))];

      uniqueUserIDs.forEach(async (userID) => {
        if (!userID) return;

        if (!userData[userID]) {
          try {
            const response = await getUserInfo(userID);
            setUserData((prev) => ({
              ...prev,
              [userID]: {
                username: response?.username || "Người dùng ẩn danh",
                avatar: response?.avatar || "/default-avatar.png",
              },
            }));
          } catch (error) {
            console.error(`Lỗi khi lấy thông tin user ${userID}:`, error);
            setUserData((prev) => ({
              ...prev,
              [userID]: {
                username: "Người dùng ẩn danh",
                avatar: "/default-avatar.png",
              },
            }));
          }
        }
      });
    };

    fetchUserNames();
  }, [product?.reviews, userData]);

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 4); // Mở thêm 4 đánh giá mỗi lần bấm
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultHoverBg: "bg-opacity",
            defaultHoverColor: "#4096ff",
            defaultActiveBg: "none",
            defaultActiveColor: "#4096ff",
            defaultActiveBorderColor: "none",
            defaultHoverBorderColor: "none",
            defaultBorderColor: "none",
            defaultBg: "none"
          },
        },
      }}
    >
      <div>
        <div className="px-2 text-[#808080]">Phản hồi của khách hàng</div>

        {product?.reviews && product.reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 py-4 px-5">
              {product.reviews.slice(0, visibleReviews).map((review) => (
                <Card
                  key={review.reviewID}
                  className="shadow-md transition-transform duration-300 hover:scale-105"
                >
                  <Meta
                    avatar={
                      <Avatar
                        className="w-14 h-14"
                        src={
                          userData[review.userID]?.avatar ||
                          "/default-avatar.png"
                        }
                      />
                    }
                    title={
                      <p className="text-xl font-semibold">
                        {userData[review.userID]?.username ||
                          "Người dùng ẩn danh"}
                      </p>
                    }
                    description={
                      <>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                          <Rate
                            disabled
                            defaultValue={review.rating}
                            className="text-sm"
                          />
                        </div>
                        <p className="text-[14px] text-black mt-10">
                          {review.comment}
                        </p>
                      </>
                    }
                  />
                </Card>
              ))}
            </div>

            {visibleReviews < product.reviews.length && (
              <Divider className="text-center mt-4">
                <Button
                  type="default"
                  htmlType="button"
                  onClick={handleShowMore}
                  className="text-sm"
                >
                  Xem thêm
                </Button>
              </Divider>
            )}
          </>
        ) : (
          <EmptyRating />
        )}
      </div>
    </ConfigProvider>
  );
};

Rating.propTypes = {
  product: PropTypes.object,
};

export default Rating;
