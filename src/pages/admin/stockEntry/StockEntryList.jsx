import { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, DatePicker, Spin } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import { getStockEntries, getProducts } from "../../../services/ProductService";
import { formattedPrice } from "../../../components/calcSoldPrice/CalcPrice";
import * as XLSX from "xlsx";

const StockEntryList = () => {
  const [stockEntries, setStockEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [entries, products] = await Promise.all([
        getStockEntries(),
        getProducts(),
      ]);
      // Sắp xếp mặc định theo ngày nhập giảm dần (mới nhất lên đầu)
      const sortedEntries = (entries || []).sort(
        (a, b) => new Date(b.entryDate) - new Date(a.entryDate)
      );
      setStockEntries(sortedEntries);
      setProducts(products || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Lấy tên sản phẩm từ id
  const getProductName = (productId) => {
    if (!productId) return "";
    const found = products.find(
      (p) =>
        p.productID === productId ||
        p._id === productId ||
        p._id === productId?._id
    );
    return found && typeof found.name === "string"
      ? found.name
      : String(productId);
  };

  // --- SEARCH/FILTER/SORT LOGIC giống ListOrder ---
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, sortable = false) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === "entryDate" ? (
          <DatePicker
            format="DD/MM/YYYY"
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            onChange={(date) =>
              setSelectedKeys(date ? [date.format("YYYY-MM-DD")] : [])
            }
            style={{ marginBottom: 8, display: "block", width: "100%" }}
            allowClear
            placeholder="Chọn ngày"
          />
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Tìm ${
              dataIndex === "product" ? "tên sản phẩm" : dataIndex
            }`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              if (dataIndex === "entryDate") setSearchText("");
              clearFilters && handleReset(clearFilters);
            }}
            size="small"
          >
            Xóa
          </Button>
          <Button type="link" size="small" onClick={close}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === "product") {
        const name = getProductName(record.product);
        return name.toLowerCase().includes(value.toLowerCase());
      }
      if (dataIndex === "entryDate" && value) {
        const recordDate = record.entryDate
          ? dayjs(record.entryDate).format("YYYY-MM-DD")
          : "";
        return recordDate === value;
      }
      if (dataIndex === "entryPrice") {
        return formattedPrice(record.entryPrice)
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    sorter: sortable
      ? (a, b) => {
          if (dataIndex === "product") {
            return getProductName(a.product).localeCompare(
              getProductName(b.product),
              "vi"
            );
          }
          if (dataIndex === "entryPrice") {
            return a.entryPrice - b.entryPrice;
          }
          if (dataIndex === "entryQuantity") {
            return a.entryQuantity - b.entryQuantity;
          }
          if (dataIndex === "entryDate") {
            return new Date(a.entryDate) - new Date(b.entryDate);
          }
          return (a[dataIndex] || "")
            .toString()
            .localeCompare((b[dataIndex] || "").toString(), "vi");
        }
      : undefined,
    render: (text, record) => {
      let displayText = text;
      if (dataIndex === "product") {
        displayText = getProductName(record.product);
      }
      if (dataIndex === "entryPrice") {
        displayText = formattedPrice(record.entryPrice);
      }
      if (dataIndex === "entryDate") {
        displayText = record.entryDate
          ? dayjs(record.entryDate).format("DD/MM/YYYY HH:mm")
          : "Không có";
      }
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={displayText ? displayText.toString() : ""}
        />
      ) : (
        displayText
      );
    },
  });

  // Reset tất cả filter/sort
  const handleResetAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText("");
    setSearchedColumn("");
  };

  // Xuất Excel danh sách phiếu nhập
  const handleExportExcel = () => {
    // Header
    const headers = [
      "STT",
      "Mã phiếu nhập",
      "Tên sản phẩm",
      "Giá nhập",
      "Số lượng nhập",
      "Ngày nhập",
    ];
    // Lấy dữ liệu đang hiển thị trên bảng (sau khi lọc, tìm kiếm, sắp xếp, PHÂN TRANG)
    const tableRows = document.querySelectorAll(".ant-table-tbody > tr");
    const displayedEntries = [];
    tableRows.forEach((row, idx) => {
      const rowKey = row.getAttribute("data-row-key");
      if (rowKey) {
        const found = (stockEntries || []).find((e) => e._id === rowKey);
        if (found) displayedEntries.push({ ...found, stt: idx + 1 });
      }
    });
    let dataToExport = displayedEntries;
    if (dataToExport.length === 0) {
      const startIdx = (pagination.current - 1) * pagination.pageSize;
      const endIdx = startIdx + pagination.pageSize;
      dataToExport = (stockEntries || [])
        .slice(startIdx, endIdx)
        .map((e, idx) => ({ ...e, stt: startIdx + idx + 1 }));
    }

    // Chuẩn hóa dữ liệu xuất
    const data = dataToExport.map((entry, idx) => [
      entry.stt || idx + 1,
      entry._id,
      getProductName(entry.product),
      formattedPrice(entry.entryPrice),
      entry.entryQuantity,
      entry.entryDate ? dayjs(entry.entryDate).format("DD/MM/YYYY HH:mm") : "",
    ]);

    // Tiêu đề và ngày tạo file
    const today = dayjs().format("DD-MM-YYYY HH:mm:ss");
    const excelCreatedRow = [`Ngày tạo file: ${today}`];
    const filterTitle = "DANH SÁCH PHIẾU NHẬP HÀNG";

    // Tạo worksheet với định dạng đẹp
    const ws_data = [
      excelCreatedRow, // Ngày tạo file
      [filterTitle], // Tiêu đề
      headers, // Header
      ...data,
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Định dạng: merge cells cho tiêu đề và ngày tạo file
    const totalCols = headers.length;
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }, // merge ngày tạo file
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } }, // merge tiêu đề
    ];

    // Đặt độ rộng cột tự động
    ws["!cols"] = headers.map(() => ({ wch: 22 }));

    // Tạo workbook và lưu file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DANH SÁCH PHIẾU NHẬP");
    XLSX.writeFile(
      wb,
      `DanhSachPhieuNhap_ngay${dayjs().format("DD-MM-YYYY")}.xlsx`
    );
  };

  // Cột cho bảng phiếu nhập
  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center",
      width: 60,
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Mã phiếu nhập",
      dataIndex: "_id",
      key: "_id",
      width: 180,
      ...getColumnSearchProps("_id", true),
      filteredValue: filteredInfo._id || null,
      sortOrder: sortedInfo.columnKey === "_id" ? sortedInfo.order : null,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product",
      width: 200,
      ...getColumnSearchProps("product", true),
      filteredValue: filteredInfo.product || null,
      sortOrder: sortedInfo.columnKey === "product" ? sortedInfo.order : null,
    },
    {
      title: "Giá nhập",
      dataIndex: "entryPrice",
      key: "entryPrice",
      width: 120,
      ...getColumnSearchProps("entryPrice", true),
      filteredValue: filteredInfo.entryPrice || null,
      sortOrder:
        sortedInfo.columnKey === "entryPrice" ? sortedInfo.order : null,
    },
    {
      title: "Số lượng nhập",
      dataIndex: "entryQuantity",
      key: "entryQuantity",
      width: 120,
      ...getColumnSearchProps("entryQuantity", true),
      filteredValue: filteredInfo.entryQuantity || null,
      sortOrder:
        sortedInfo.columnKey === "entryQuantity" ? sortedInfo.order : null,
    },
    {
      title: "Ngày nhập",
      dataIndex: "entryDate",
      key: "entryDate",
      width: 160,
      ...getColumnSearchProps("entryDate", true),
      filteredValue: filteredInfo.entryDate || null,
      sortOrder: sortedInfo.columnKey === "entryDate" ? sortedInfo.order : null,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="text-lg font-semibold mb-4 flex justify-between">
        <span>Danh sách các đơn nhập hàng</span>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleResetAll}
            type="default"
          >
            Tải lại
          </Button>
          <Button
            type="primary"
            className="bg-blue-500 text-white"
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
        </Space>
      </div>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          size="small"
          dataSource={stockEntries}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize,
              }));
            },
          }}
          onChange={(paginationObj, filters, sorter) => {
            setFilteredInfo(filters || {});
            setSortedInfo(sorter || {});
            setPagination({
              current: paginationObj.current,
              pageSize: paginationObj.pageSize,
            });
          }}
        />
      </Spin>
    </div>
  );
};

export default StockEntryList;
