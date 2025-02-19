import { Avatar, Card, ConfigProvider, Rate } from "antd";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getUserInfo } from "../../../api/api";

const { Meta } = Card;

const Rating = ({ product }) => {
  const [userData, setUserData] = useState({}); 

  useEffect(() => {
    const fetchUserNames = async () => {
      if (!product?.reviews) return;

      const uniqueUserIDs = [...new Set(product.reviews.map((r) => r.userID))];

      uniqueUserIDs.forEach(async (userID) => {
        if (!userID) {
          console.error("Lỗi: userID bị null hoặc undefined");
          return;
        }

        if (!userData[userID]) {
          try {
            console.log("Fetching user for ID:", userID);
            const response = await getUserInfo(userID);
            console.log("User info:", response);

            setUserData((prev) => ({
              ...prev,
              [userID]: response?.username || "Người dùng ẩn danh",
            }));
          } catch (error) {
            console.error(`Lỗi khi lấy thông tin user ${userID}:`, error);
            setUserData((prev) => ({
              ...prev,
              [userID]: "Người dùng ẩn danh",
            }));
          }
        }
      });
    };

    fetchUserNames();
  }, [product?.reviews]);

  return (
    <ConfigProvider>
      <div>
        <div className="px-2 text-[#808080]">Phản hồi của khách hàng</div>
        <div className="grid grid-cols-2 gap-6 py-4 px-5">
          {product?.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <Card
                key={review._id}
                className="shadow-md transition-transform duration-300 hover:scale-105"
              >
                <Meta
                  avatar={
                    <Avatar
                      className="w-14 h-14"
                      src={review.avatar || "/default-avatar.png"}
                    />
                  }
                  title={
                    <p className="text-xl font-semibold">
                      {userData[review.userID] || "Người dùng ẩn danh"}
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
            ))
          ) : (
            <p className="text-center text-gray-500">Chưa có phản hồi nào.</p>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

Rating.propTypes = {
  product: PropTypes.object,
};

export default Rating;
