import { Card, Progress, Statistic, Typography } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title } = Typography;

const RevenueCard = ({ title, value, growth, unit, color }) => {
  const isIncrease = growth >= 0;

  return (
    <Card
      className="w-[40vh] h-[100px] rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:cursor-pointer p-0"
      bodyStyle={{ paddingTop: 0 }} // Xóa padding mặc định của Card
    >
      <Title level={5} className="text-gray-700">
        {title}
      </Title>

      <div className="flex items-center gap-3">
        <Progress
          type="circle"
          percent={Math.abs(growth)}
          size={60}
          strokeWidth={10}
          strokeColor={color}
          format={() => (
            <span
              style={{
                color: color, // Sửa lại cách đặt màu
                fontWeight: "bold",
              }}
            >
              {isIncrease ? <CaretUpOutlined /> : <CaretDownOutlined />}{" "}
              {growth}%
            </span>
          )}
        />
        <div>
          <div className="font-thin text-[13px]">So với ngày hôm trước</div>
          <Statistic
            value={value}
            precision={0}
            valueStyle={{ fontSize: 18, fontWeight: "bold", color: color }}
            suffix={unit}
          />
        </div>
      </div>

      {/* <Text type="secondary" className="text-gray-500">
        Hôm qua: {previousValue.toLocaleString()} {unit}
      </Text> */}
    </Card>
  );
};

RevenueCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  previousValue: PropTypes.number.isRequired,
  growth: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default RevenueCard;
