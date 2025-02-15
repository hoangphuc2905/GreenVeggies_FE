import { Avatar, Card, Rate } from "antd";

const { Meta } = Card;

const Rating = () => {
  return (
    <div>
    <div className="px-2 text-[#808080] ">n phản hồi của khách hàng</div>
      <div className="grid grid-cols-2 gap-4 py-4">
        <Card>
          <Meta
            avatar={
              <Avatar
                className="w-14 h-14"
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
              />
            }
            title={<p className="text-xl font-semibold">Card title</p>} // Tăng cỡ chữ
            description={
              <>
                <div className="flex items-center justify-between">
                  <p className="font-medium">6 Tháng 9, 2024</p>
                  <Rate disabled defaultValue={4} className="text-sm" />
                </div>
                <p className="font-normal mt-10 ">This is the description</p>
              </>
            }
          />
        </Card>
        <Card>
          <Meta
            avatar={
              <Avatar
                className="w-14 h-14"
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=9"
              />
            }
            title={<p className="text-xl font-semibold">Another title</p>} // Tăng cỡ chữ
            description={
              <>
                <div className="flex items-center justify-between">
                  <p className="font-medium">6 Tháng 9, 2024</p>
                  <Rate disabled defaultValue={4} className="text-sm" />
                </div>
                <p className="font-normal mt-10 ">This is the description</p>
              </>
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default Rating;
