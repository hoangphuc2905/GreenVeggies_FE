import { Card, Col, Row, Tag } from "antd";
import PropTypes from "prop-types";

const DetailProfile = ({ product }) => {
  if (!product) return <p>Không có dữ liệu sản phẩm.</p>;

  // Mapping trạng thái thành text dễ hiểu
  const statusMapping = {
    available: { text: "Còn hàng", color: "green" },
    unavailable: { text: "Ngừng bán", color: "red" },
    out_of_stock: { text: "Hết hàng", color: "orange" },
  };

  // Tính toán tồn kho

  const stockQuantity = () => {
    const result = product.import - product.sold;
    if (result < 0) return 0;
    return result;
  };

  return (
    <div className="mt-8">
      <div>
        <Row
          gutter={[16, 16]}
          wrap={false}
          justify="space-between"
          className="text-center"
        >
          {/* Đánh giá */}
          <Col span={4}>
            <Card title="Đánh giá" bordered={false}>
              {product.quantity ? `${product.quantity} ⭐` : "Chưa có đánh giá"}
            </Card>
          </Col>

          {/* Giá bán */}
          <Col span={4}>
            <Card title="Giá bán" bordered={false}>
              {product.price
                ? `${product.price.toLocaleString()} VND`
                : "Chưa cập nhật"}
            </Card>
          </Col>

          {/* Tồn kho (Số lượng nhập - Đã bán) */}
          <Col span={4}>
            <Card title="Tồn kho" bordered={false}>
              {stockQuantity()} {product.unit}
            </Card>
          </Col>

          {/* Trạng thái */}
          <Col span={4}>
            <Card title="Trạng thái" bordered={false}>
              <Tag color={statusMapping[product.status]?.color}>
                {statusMapping[product.status]?.text || "Không xác định"}
              </Tag>
            </Card>
          </Col>

          {/* Số lượng nhập */}
          <Col span={4}>
            <Card title="Số lượng nhập" bordered={false}>
              {product.import} {product.unit}
            </Card>
          </Col>

          {/* Đã bán */}
          <Col span={4}>
            <Card title="Đã bán" bordered={false}>
              {product.sold} {product.unit}
            </Card>
          </Col>
        </Row>
      </div>
      <div>
        
      </div>
    </div>
  );
};

DetailProfile.propTypes = {
  product: PropTypes.shape({
    price: PropTypes.number,
    quantity: PropTypes.number,
    import: PropTypes.number,
    sold: PropTypes.number,
    unit: PropTypes.string,
    status: PropTypes.string,
    review: PropTypes.number,
  }),
};

export default DetailProfile;
