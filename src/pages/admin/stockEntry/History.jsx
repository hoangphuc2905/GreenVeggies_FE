import { ConfigProvider, Table, message, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProductDetail, getStockEntry } from "../../../api/api";
import { formattedPrice } from "../../../components/calcSoldPrice/CalcPrice";
import { render } from "react-dom";

const History = () => {
  const location = useLocation();
  const id = location.state?.productID;
  const [stocks, setStocks] = useState([]);
  const [stockDetails, setStockDetails] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  // Lấy danh sách ID nhập hàng từ sản phẩm
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail(id);
        if (response?.stockEntries) {
          setStocks(response.stockEntries);
        } else {
          message.warning("Không có dữ liệu nhập hàng!");
        }
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu!");
        console.error("Lỗi API:", error);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Lấy chi tiết từng lần nhập hàng
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const stockPromises = stocks.map((stockID) => getStockEntry(stockID));
        const stockResults = await Promise.all(stockPromises);
        setStockDetails(stockResults.filter((stock) => stock !== null));
      } catch (error) {
        message.error("Lỗi khi lấy thông tin nhập hàng!");
        console.error("Lỗi API stockEntries:", error);
      }
    };

    if (stocks.length > 0) {
      fetchStockDetails();
    }
  }, [stocks]);

  // Xử lý sự kiện thay đổi filter và sort
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // Các chức năng bộ lọc
  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setQuantitySort = () => {
    setSortedInfo({ order: "descend", columnKey: "entryQuantity" });
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày Nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      filters: Array.from(
        new Set(
          stockDetails.map(
            (stock) => new Date(stock.createdAt).toLocaleDateString("vi-VN") // Chỉ lấy ngày
          )
        )
      ).map((date) => ({ text: date, value: date })), // Tạo danh sách lọc không trùng

      filteredValue: filteredInfo.createdAt || null,
      onFilter: (value, record) =>
        record.rawDate.toLocaleDateString("vi-VN") === value, // So sánh đúng định dạng

      sorter: (a, b) => a.rawDate - b.rawDate, // Sắp xếp theo Date Object
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Số Lượng",
      dataIndex: "entryQuantity",
      key: "entryQuantity",
      sorter: (a, b) => a.entryQuantity - b.entryQuantity,
      sortOrder:
        sortedInfo.columnKey === "entryQuantity" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Giá Nhập",
      dataIndex: "entryPrice",
      key: "entryPrice",
      sorter: (a, b) => a.entryPrice - b.entryPrice,
      sortOrder:
        sortedInfo.columnKey === "entryPrice" ? sortedInfo.order : null,
      ellipsis: true,
      render: (text) => <span>{formattedPrice(text)}</span>,
    },
    {
      title: "Tổng Tiền",
      key: "totalPrice",
      render: (text, record) => (
        <span>
          {formattedPrice(
            totalEntryPrice(record.entryQuantity, record.entryPrice)
          )}
        </span>
      ),
    },
  ];

  const totalEntryPrice = (quantity, price) => {
    return quantity * price;
  };

  const dataSource = stockDetails.map((stock, index) => ({
    key: index,
    id: index + 1,
    rawDate: new Date(stock.createdAt), // Lưu lại ngày gốc để lọc & sắp xếp
    createdAt: new Date(stock.createdAt).toLocaleString("vi-VN"), // Hiển thị có giờ phút giây
    entryQuantity: stock.entryQuantity,
    entryPrice: stock.entryPrice,
  }));

  return (
    <ConfigProvider>
      <div className="mt-8 h-full max-h-screen bg-white p-4 rounded-md shadow-xl">
        <div className="text-lg font-semibold mb-4 pb-2 ml-3">
          Lịch sử nhập hàng
        </div>

        {/* Các nút điều khiển */}
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={setQuantitySort}>Sắp xếp theo số lượng</Button>
          <Button onClick={clearFilters}>Xóa bộ lọc</Button>
          <Button onClick={clearAll}>Xóa bộ lọc & sắp xếp</Button>
        </Space>

        {/* Bảng hiển thị */}
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onChange={handleChange}
        />
      </div>
    </ConfigProvider>
  );
};

export default History;
