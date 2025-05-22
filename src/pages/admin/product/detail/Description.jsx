import { Card, Col, Rate, Row, Table, Tag } from "antd";
import PropTypes from "prop-types";
import {
  CalcPrice,
  formattedPrice,
} from "../../../../components/calcSoldPrice/CalcPrice";
import { UNIT_OPTIONS } from "../../../../constants/unitOptions";

const Description = ({ product }) => {
  if (!product) return <p>Không có dữ liệu sản phẩm.</p>;

  const statusMapping = {
    available: { text: "Còn hàng", color: "green" },
    unavailable: { text: "Ngừng bán", color: "red" },
    out_of_stock: { text: "Hết hàng", color: "orange" },
  };

  const stockQuantity = () => {
    const result = product.quantity;
    if (result < 0) return 0;
    return result;
  };

  // Hàm lấy tên đơn vị tiếng Việt từ value
  const getUnitLabel = (unitValue) => {
    const found = UNIT_OPTIONS.find((u) => u.value === unitValue);
    return found ? found.label : unitValue;
  };

  const dataSource = [
    {
      key: "1",
      label: "Giá nhập",
      value: `${formattedPrice(product.price)} / KG`,
    },
    {
      key: "2",
      label: "Danh mục",
      value: product.category?.name || "Không có danh mục",
    },
    {
      key: "3",
      label: "Mô tả",
      value: (
        <div>
          <p>
            <strong>Nguồn gốc:</strong>{" "}
            {product.origin || "Không có thông tin nguồn gốc"}.
          </p>
          <p className="mt-2 font-medium">Đặc điểm sản phẩm:</p>
          <p>{product.description || "Không có mô tả"}</p>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "",
      dataIndex: "label",
      key: "label",
      width: 200,
      className: "font-medium text-[#808080]",
    },
    {
      title: "",
      dataIndex: "value",
      key: "value",
    },
  ];
  return (
    <div className="mt-8 z-0 h-full">
      <div>
        <Row
          gutter={[16, 16]}
          wrap={false}
          justify="space-between"
          className="text-center"
        >
          {/* Đánh giá */}
          <Col span={4}>
            {product && product.reviews.length > 0 ? (
              <Card
                className="text-[#808080] shadow-md"
                title={
                  <span className="">
                    Đánh giá:{" "}
                    <span className="font-bold">
                      {(
                        product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        product.reviews.length
                      ).toFixed(1)}
                    </span>{" "}
                  </span>
                }
              >
                <Rate
                  allowHalf
                  disabled
                  value={
                    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    product.reviews.length
                  }
                  style={{
                    marginTop: "-10px",
                  }}
                />
              </Card>
            ) : (
              <Card className="text-[#808080] shadow-md" title="Đánh giá">
                Chưa có đánh giá
              </Card>
            )}
          </Col>

          {/* Giá bán */}
          <Col span={4}>
            <Card className="text-[#808080] shadow-md" title="Giá bán">
              {product.price
                ? `${formattedPrice(CalcPrice(product.price))}`
                : "Chưa cập nhật"}
            </Card>
          </Col>

          {/* Tồn kho (Số lượng nhập - Đã bán) */}
          <Col span={4}>
            <Card className="text-[#808080] shadow-md" title="Tồn kho">
              {stockQuantity()} {getUnitLabel(product.unit)}
            </Card>
          </Col>

          {/* Trạng thái */}
          <Col span={4}>
            <Card className="text-[#808080] shadow-md" title="Trạng thái">
              <Tag color={statusMapping[product.status]?.color}>
                {statusMapping[product.status]?.text || "Không xác định"}
              </Tag>
            </Card>
          </Col>

          {/* Số lượng nhập */}
          <Col span={4}>
            <Card className="text-[#808080] shadow-md" title="Số lượng nhập">
              {product.import} {getUnitLabel(product.unit)}
            </Card>
          </Col>

          {/* Đã bán */}
          <Col span={4}>
            <Card className="text-[#808080] shadow-md" title="Đã bán">
              {product.sold} {getUnitLabel(product.unit)}
            </Card>
          </Col>
        </Row>
      </div>
      <div className="mt-8 h-full max-h-screen bg-white p-4 rounded-md shadow-xl">
        <div className="text-lg font-semibold mb-4 pb-2 ml-3">
          Thông tin cơ bản
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          showHeader={false}
        />
      </div>
    </div>
  );
};

Description.propTypes = {
  product: PropTypes.shape({
    price: PropTypes.number,
    quantity: PropTypes.number,
    import: PropTypes.number,
    sold: PropTypes.number,
    unit: PropTypes.string,
    status: PropTypes.string,
    review: PropTypes.number,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    description: PropTypes.string,
    origin: PropTypes.string,
    imageUrl: PropTypes.array,
    reviews: PropTypes.array,
  }),
};

export default Description;
