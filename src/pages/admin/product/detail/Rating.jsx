import {
  Avatar,
  Card,
  ConfigProvider,
  Rate,
  Button,
  Divider,
  Image,
  Modal,
  Carousel,
} from "antd";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import EmptyRating from "../../emptyData/EmptyRating";
import { getUserInfo } from "../../../../services/UserService";
import error from "../../../../assets/pictures/erorr.png"; // Ensure the correct path to the fallback image
const { Meta } = Card;

const Rating = ({ product }) => {
  const [userData, setUserData] = useState({});
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [initialSlide, setInitialSlide] = useState(0);

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
    setVisibleReviews((prev) => prev + 4);
  };

  const handleImageClick = (images, index) => {
    setSelectedImages(images);
    setInitialSlide(index);
    setIsImageModalVisible(true);
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
            defaultBg: "none",
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
                        {review.imageUrl?.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium text-gray-600">
                              Hình ảnh:
                            </p>
                            <div className="flex gap-2 overflow-x-auto w-48">
                              {review.imageUrl.slice(0, 5).map((url, index) => (
                                <div
                                  key={index}
                                  className="relative w-16 h-16 cursor-pointer"
                                  onClick={() =>
                                    handleImageClick(review.imageUrl, index)
                                  }
                                >
                                  <Image
                                    src={url}
                                    preview={false}
                                    fallback={error}
                                    alt={`Review Image ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                  {index === 4 &&
                                    review.imageUrl.length > 5 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded-md">
                                        Xem thêm
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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

      <Modal
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        centered
        width={600}
      >
        <Carousel initialSlide={initialSlide} dots={true} arrows={true}>
          {selectedImages.map((url, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={url}
                preview={false}
                fallback={error}
                alt={`Review Image ${index + 1}`}
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </ConfigProvider>
  );
};

Rating.propTypes = {
  product: PropTypes.object,
};

export default Rating;
