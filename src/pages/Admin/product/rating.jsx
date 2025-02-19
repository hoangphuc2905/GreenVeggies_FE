import { Avatar, Card, ConfigProvider, Rate } from "antd";

const { Meta } = Card;

const reviews = [
  {
    id: 1,
    name: "Thỏ 7 màu siêu cấp vipro",
    date: "6 Tháng 9, 2024",
    rating: 4,
    description: "Đã mua và ăn thử. Ngon đó mà ông Năm nói thích ăn nhà trồng hơn nên không ủng hộ nữa!",
    avatar:
      "https://img.hoidap247.com/picture/question/20200508/large_1588936738888.jpg",
  },
  {
    id: 2,
    name: "Vịt enzo",
    date: "6 Tháng 9, 2024",
    rating: 4,
    description: "Ok ok! Quạck Quạck!",
    avatar: "https://phanmemmkt.vn/wp-content/uploads/2024/09/avt-Facebook-hai-huoc.jpg",
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    date: "7 Tháng 9, 2024",
    rating: 5,
    description: "Trải nghiệm tuyệt vời! Rất đáng tiền!",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=10",
  },
  {
    id: 4,
    name: "Phạm Minh D",
    date: "8 Tháng 9, 2024",
    rating: 3,
    description: "Dịch vụ ổn nhưng cần cải thiện thêm.",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=11",
  },
  {
    id: 5,
    name: "Bùi Thảo E",
    date: "9 Tháng 9, 2024",
    rating: 5,
    description: "Rất hài lòng, sẽ giới thiệu cho bạn bè!",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=12",
  },
  {
    id: 6,
    name: "Đỗ Hải F",
    date: "10 Tháng 9, 2024",
    rating: 3,
    description: "Không quá đặc biệt, nhưng chấp nhận được.",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=13",
  },
];

const Rating = () => {
  return (
    <ConfigProvider>
      <div>
        <div className="px-2 text-[#808080]">Phản hồi của khách hàng</div>
        <div className="grid grid-cols-2 gap-6 py-4 px-5">
          {reviews.map((review) => (
            <Card 
              key={review.id} 
              className="shadow-md transition-transform duration-300 hover:scale-105"
            >
              <Meta
                avatar={<Avatar className="w-14 h-14" src={review.avatar} />}
                title={<p className="text-xl font-semibold">{review.name}</p>}
                description={
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.date}</p>
                      <Rate disabled defaultValue={review.rating} className="text-sm" />
                    </div>
                    <p className="text-[14px] text-black mt-10">{review.description}</p>
                  </>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Rating;
