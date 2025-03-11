import { Card, Progress, Statistic, Typography } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title } = Typography;

const OrderCard = ({ title, value, growth, unit, color }) => {
  return (
    <Card
      className="w-[41vh] h-[100px] rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:cursor-pointer p-0"
      bodyStyle={{ paddingTop: 10 }}
    >
      <Title level={5} className="text-gray-700">
        {title}
      </Title>

      <div className="flex items-center gap-3">
        {growth !== null ? (
          <Progress
            type="circle"
            percent={Math.abs(growth)}
            size={50}
            strokeWidth={10}
            strokeColor={color}
            format={() => (
              <span style={{ color: color, fontWeight: "bold" }}>
                {growth > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
                {growth}%
              </span>
            )}
          />
        ) : null}

        <div>
          <div className="text-gray-500 text-xs">
            {growth !== null ? "So với ngày hôm trước" : "Các đơn đang xử lý"}
          </div>
          <Statistic
            value={value}
            valueStyle={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
            suffix={unit}
          />
        </div>
      </div>
    </Card>
  );
};

OrderCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  growth: PropTypes.number,
  unit: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default OrderCard;
