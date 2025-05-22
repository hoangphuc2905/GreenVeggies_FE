import {
  Button,
  Flex,
  Input,
  Layout,
  Table,
  Tag,
  Space,
  Select,
  Image,
  ConfigProvider,
  message,
  Modal,
  Spin,
} from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState, useRef } from "react";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
  TagFilled,
  CheckCircleOutlined,
  PoweroffOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useHandlerClickUpdate } from "../../../components/updateProduct/handlerClickUpdate";
import UserRender from "../userRender/UserRender";
import FilterButton from "../../../components/filter/FilterButton";
import InsertStockEntry from "../stockEntry/InsertStockEntry";
import {
  CalcPrice,
  formattedPrice,
} from "../../../components/calcSoldPrice/CalcPrice";
import {
  getProducts,
  getCategories,
  updateProductStatus,
} from "../../../services/ProductService";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { UNIT_OPTIONS } from "../../../constants/unitOptions";

const { Search } = Input;

const Page = () => {
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(["Tất cả"]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses] = useState([
    { value: "available", label: "Còn hàng" },
    { value: "unavailable", label: "Ngừng bán" },
    { value: "out_of_stock", label: "Hết hàng" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Số lượng sản phẩm trên mỗi trang

  useEffect(() => {
    // Hàm tính toán số lượng dòng hiển thị dựa trên chiều cao màn hình
    const calculatePageSize = () => {
      const screenHeight = window.innerHeight;
      if (screenHeight > 1200) return 15; // Màn hình lớn
      if (screenHeight > 800) return 10; // Màn hình trung bình
      return 5; // Màn hình nhỏ
    };

    // Cập nhật pageSize khi tải trang hoặc thay đổi kích thước màn hình
    const updatePageSize = () => {
      setPageSize(calculatePageSize());
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);

    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, []);

  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [warningMessage, setWarningMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filters] = useState({});
  const [columnsVisibility, setColumnsVisibility] = useState({
    productID: true,
    name: true,
    imageUrl: true,
    category: true,
    price: true,
    origin: true,
    quantity: true,
    sold: true,
    reviews: true,
    status: true,
    action: true,
  });

  const columns = [
    {
      key: "productID",
      typeCol: "none",
      title: "Mã sản phẩm",
    },
    {
      key: "name",
      typeCol: "text",
      title: "Tên sản phẩm",
    },
    { key: "imageUrl", typeCol: "none", title: "Hình ảnh" },
    {
      key: "category",
      typeCol: "select",
      title: "Danh mục",
      options: categories,
    },
    { key: "price", typeCol: "priceRange", title: "Giá (VNĐ)" },
    { key: "origin", typeCol: "select", title: "Xuất xứ", options: [] }, // Thêm options cho origin nếu có
    { key: "quantity", typeCol: "numRange", title: "Số lượng" },
    { key: "sold", typeCol: "numRange", title: "Đã bán" },
    { key: "reviews", typeCol: "numRange", title: "Đánh giá" },
    {
      key: "status",
      typeCol: "select",
      title: "Tình trạng",
      options: statuses,
    },
    { key: "action", typeCol: "none", title: "Tác vụ" },
  ];

  const openInsertStockEntry = (product) => {
    setIsStockEntryOpen(true);
    setSelectedProduct(product);
  };

  const statusMapping = {
    available: { text: "Còn hàng", color: "green" },
    unavailable: { text: "Ngừng bán", color: "red" },
    out_of_stock: { text: "Hết hàng", color: "orange" },
  };

  useEffect(() => {
    // Hàm lấy danh sách sản phẩm và danh mục từ API
    const fetchAndSetProducts = async () => {
      setLoading(true); // Bắt đầu loading
      const data = (await getProducts()).reverse(); // Lấy danh sách sản phẩm từ API
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false); // Kết thúc loading
    };

    const fetchAndSetCategories = async () => {
      const data = await getCategories();
      const formattedCategories = data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategories([
        { value: "Tất cả", label: "Tất cả" },
        ...formattedCategories,
      ]);
    };

    fetchAndSetProducts();
    fetchAndSetCategories();
  }, []);

  const handlerFilter = (value) => {
    if (selectedOptions.includes("Tất cả") && value.length > 1) {
      setSelectedOptions(value.filter((v) => v !== "Tất cả"));
    } else if (value.includes("Tất cả")) {
      setSelectedOptions(["Tất cả"]);
    } else if (value.length === 0) {
      setSelectedOptions(["Tất cả"]);
    } else {
      setSelectedOptions(value);
    }
    applyFilters(value.includes("Tất cả") ? ["Tất cả"] : value, searchQuery);
  };

  const [productStatuses] = useState([
    { value: "available", label: "Còn hàng" },
    { value: "unavailable", label: "Ngừng bán" },
    { value: "out_of_stock", label: "Hết hàng" },
  ]);

  <Select
    mode="multiple"
    tagRender={UserRender}
    value={selectedOptions}
    className="w-72"
    options={categories}
    onChange={handlerFilter}
  />;

  // Hàm chuyển đổi đơn vị sang tiếng Việt (dùng enum dùng chung)
  const getUnitVN = (unit) => {
    const found = UNIT_OPTIONS.find((u) => u.value === unit);
    return found ? found.label : unit || "";
  };

  /**
   * Hàm lọc sản phẩm theo danh mục và từ khóa tìm kiếm.
   * Nếu chọn "Tất cả" thì hiển thị toàn bộ sản phẩm.
   * Có thể lọc thêm theo các trường khác nếu cần.
   */
  const applyFilters = (categories, query) => {
    let filteredProducts = products;

    // Nếu chọn "Tất cả", hiển thị toàn bộ sản phẩm
    if (!categories.includes("Tất cả")) {
      filteredProducts = filteredProducts.filter((product) =>
        categories.includes(product.category?._id)
      );
    }

    // Lọc theo tên sản phẩm
    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Lọc theo các bộ lọc khác
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value) {
        if (Array.isArray(value)) {
          filteredProducts = filteredProducts.filter((product) =>
            value.includes(product[key])
          );
        } else {
          filteredProducts = filteredProducts.filter(
            (product) => product[key] === value
          );
        }
      }
    });

    setFilteredProducts(filteredProducts); // Cập nhật danh sách sản phẩm đã lọc
  };

  useEffect(() => {
    applyFilters(selectedOptions, searchQuery);
  }, [selectedOptions, searchQuery, filters]);

  const handleColumnVisibilityChange = (key) => {
    setColumnsVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigate = useNavigate();
  const handlerClickUpdate = useHandlerClickUpdate();

  /**
   * Hàm xử lý khi click vào một sản phẩm trong bảng.
   * Điều hướng sang trang chi tiết sản phẩm.
   */
  const handlerClickProduct = (product) => {
    navigate(`/admin/products/${product._id}`, {
      state: { productID: product.productID },
    });
  };

  const handlerClickAddProduct = () => {
    navigate(`/admin/add-product`);
  };

  /**
   * Hàm xử lý khi nhấn nút "Ngừng bán" sản phẩm.
   * Hiển thị xác nhận, cập nhật trạng thái sản phẩm nếu đồng ý.
   */
  const handlerStopSell = async (value) => {
    try {
      if (value.status === "unavailable") {
        setWarningMessage("Sản phẩm này đã ngưng bán");
        return;
      }

      Modal.confirm({
        title: "Xác nhận ngừng bán sản phẩm",
        content: "Bạn có chắc chắn muốn ngừng bán sản phẩm này?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            const response = updateProductStatus(
              value.productID,
              "unavailable"
            ); // Cập nhật trạng thái sản phẩm

            if (response) {
              setSuccessMessage("Đã ngừng bán sản phẩm thành công!");

              // Cập nhật trạng thái sản phẩm trong danh sách hiện tại
              setProducts((prevProducts) =>
                prevProducts.map((product) =>
                  product.productID === value.productID
                    ? { ...product, status: "unavailable" }
                    : product
                )
              );

              setFilteredProducts((prevFilteredProducts) =>
                prevFilteredProducts.map((product) =>
                  product.productID === value.productID
                    ? { ...product, status: "unavailable" }
                    : product
                )
              );
            }
          } catch (error) {
            setWarningMessage("Có lỗi xảy ra khi ngừng bán sản phẩm");
          }
        },
      });
    } catch (error) {
      setWarningMessage("Có lỗi xảy ra khi ngừng bán sản phẩm");
    }
  };

  // Thêm hàm mở bán lại sản phẩm
  const handlerOpenSell = async (product) => {
    let newStatus = "available";
    if (product.quantity <= 0) {
      newStatus = "out_of_stock";
    }
    Modal.confirm({
      title: "Xác nhận mở bán sản phẩm",
      content:
        newStatus === "available"
          ? "Bạn có chắc chắn muốn mở bán sản phẩm này?"
          : "Sản phẩm hết hàng, mở bán sẽ chuyển trạng thái thành 'Hết hàng'. Bạn có chắc chắn muốn tiếp tục?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await updateProductStatus(
            product.productID,
            newStatus
          );
          if (response) {
            setSuccessMessage(
              newStatus === "available"
                ? "Đã mở bán sản phẩm thành công!"
                : "Đã chuyển sản phẩm về trạng thái 'Hết hàng'!"
            );
            setProducts((prevProducts) =>
              prevProducts.map((p) =>
                p.productID === product.productID
                  ? { ...p, status: newStatus }
                  : p
              )
            );
            setFilteredProducts((prevFilteredProducts) =>
              prevFilteredProducts.map((p) =>
                p.productID === product.productID
                  ? { ...p, status: newStatus }
                  : p
              )
            );
          }
        } catch (error) {
          setWarningMessage("Có lỗi xảy ra khi mở bán sản phẩm");
        }
      },
    });
  };

  /**
   * Hàm tính điểm đánh giá trung bình của sản phẩm.
   * Nếu không có đánh giá thì trả về 0.
   */
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };
  const reloadProducts = async () => {
    const data = await getProducts("products");
    setProducts(data);
    setFilteredProducts(data);
  };

  useEffect(() => {
    if (warningMessage) {
      message.warning(warningMessage);
      setWarningMessage(null);
    }
    if (successMessage) {
      message.success(successMessage);
      setSuccessMessage(null);
    }
  }, [warningMessage, successMessage]);

  // --- SEARCH/FILTER/SORT LOGIC ---
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);

  /**
   * Hàm xử lý tìm kiếm theo từng cột trong bảng.
   * Khi nhấn Enter hoặc nút Tìm, sẽ lọc dữ liệu theo giá trị nhập vào.
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  /**
   * Hàm reset bộ lọc/tìm kiếm cho filterDropdown của từng cột.
   */
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  /**
   * Hàm xử lý khi nhấn nút Reset: Đưa bảng về trạng thái ban đầu,
   * xóa filter, sort, phân trang, và bỏ chọn các dòng.
   */
  const handleResetAll = () => {
    setSearchText("");
    setSearchedColumn("");
    setFilteredInfo({});
    setSortedInfo({});
    setCurrentPage(1);
    setSelectedRowKeys([]);
    setSelectedOptions(["Tất cả"]);
    setFilteredProducts(products);
    setSearchQuery("");
  };

  // Cấu hình filter/search cho từng cột
  const getColumnSearchProps = (dataIndex, sortable = false) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
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
            onClick={() => clearFilters && handleReset(clearFilters)}
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
      if (dataIndex === "price") {
        // So sánh giá đã chia cho 1.5 khi tìm kiếm (theo yêu cầu)
        const price = Number(record.price) * 1.5;
        return price.toString().toLowerCase().includes(value.toLowerCase());
      }
      if (dataIndex === "reviews") {
        // Tìm kiếm theo điểm đánh giá trung bình
        const avg = calculateAverageRating(record.reviews);
        return avg.toString().toLowerCase().includes(value.toLowerCase());
      }
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    sorter: sortable
      ? (a, b) =>
          a[dataIndex]?.toString().localeCompare(b[dataIndex]?.toString(), "vi")
      : undefined,
    sortDirections: ["ascend", "descend"],
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Cấu hình các cột cho bảng sản phẩm
  const productColumns = [
    {
      title: "STT",
      key: "index",
      align: "center",
      width: 60,
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      fixed: "left",
    },
    columnsVisibility.productID && {
      title: "Mã sản phẩm",
      dataIndex: "productID",
      key: "productID",
      align: "center",
      width: 120,
      ...getColumnSearchProps("productID", true),
      sorter: (a, b) => a.productID.localeCompare(b.productID),
      filteredValue: filteredInfo.productID || null,
      sortOrder: sortedInfo.columnKey === "productID" ? sortedInfo.order : null,
      render: (productID) => (
        <Tooltip placement="topLeft" title={productID}>
          {productID}
        </Tooltip>
      ),
    },
    columnsVisibility.name && {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 180,
      ...getColumnSearchProps("name", true),
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: filteredInfo.name || null,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
      fixed: "left",
    },
    columnsVisibility.imageUrl && {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      width: 80,
      render: (imageUrl) => {
        const firstImage = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
        return (
          <div className="flex justify-center items-center">
            {firstImage ? (
              <Image
                width={50}
                height={50}
                src={firstImage}
                alt="product"
                className="object-cover"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <span>Không có ảnh</span>
            )}
          </div>
        );
      },
    },
    columnsVisibility.category && {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      align: "center",
      width: 120,
      filters: categories
        .filter((cat) => cat.value !== "Tất cả")
        .map((cat) => ({
          text: cat.label,
          value: cat.value,
        })),
      onFilter: (value, record) => record.category?._id === value,
      sorter: (a, b) =>
        (a.category?.name || "").localeCompare(b.category?.name || ""),
      filteredValue: filteredInfo.category || null,
      sortOrder: sortedInfo.columnKey === "category" ? sortedInfo.order : null,
      render: (category) => category?.name || "--|--",
    },
    columnsVisibility.price && {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: 120,
      ...getColumnSearchProps("price", true),
      sorter: (a, b) => a.price - b.price,
      filteredValue: filteredInfo.price || null,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
      render: (text, record) =>
        `${formattedPrice(CalcPrice(record.price))} / ${getUnitVN(
          record.unit
        )}`,
    },
    columnsVisibility.origin && {
      title: "Xuất xứ",
      dataIndex: "origin",
      key: "origin",
      align: "center",
      width: 100,
      ...getColumnSearchProps("origin", true),
      filteredValue: filteredInfo.origin || null,
      sortOrder: sortedInfo.columnKey === "origin" ? sortedInfo.order : null,
      render: (origin) => origin || "--|--",
    },
    columnsVisibility.quantity && {
      title: "SL còn lại",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 100,
      ...getColumnSearchProps("quantity", true),
      sorter: (a, b) => a.quantity - b.quantity,
      filteredValue: filteredInfo.quantity || null,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
      render: (text, record) =>
        `${text.toLocaleString()} ${getUnitVN(record.unit)}`,
    },
    columnsVisibility.sold && {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      align: "center",
      width: 100,
      ...getColumnSearchProps("sold", true),
      sorter: (a, b) => a.sold - b.sold,
      filteredValue: filteredInfo.sold || null,
      sortOrder: sortedInfo.columnKey === "sold" ? sortedInfo.order : null,
      render: (text, record) =>
        `${text.toLocaleString()} ${getUnitVN(record.unit)}`,
    },
    columnsVisibility.reviews && {
      title: "Đánh giá",
      dataIndex: "reviews",
      key: "reviews",
      align: "center",
      width: 90,
      ...getColumnSearchProps("reviews", true),
      sorter: (a, b) =>
        calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews),
      filteredValue: filteredInfo.reviews || null,
      sortOrder: sortedInfo.columnKey === "reviews" ? sortedInfo.order : null,
      render: (reviews) => <div>{calculateAverageRating(reviews)}</div>,
    },
    columnsVisibility.status && {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 110,
      filters: productStatuses.map((status) => ({
        text: status.label,
        value: status.value,
      })),
      onFilter: (value, record) => record.status === value,
      filteredValue: filteredInfo.status || null,
      sortOrder: sortedInfo.columnKey === "status" ? sortedInfo.order : null,
      render: (status) => (
        <Tag color={statusMapping[status]?.color}>
          {statusMapping[status]?.text}
        </Tag>
      ),
    },
    columnsVisibility.action && {
      title: "Tác vụ",
      key: "action",
      align: "center",
      width: 180,
      fixed: "right",
      render: (text, record) => (
        <Space size="small">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "bg-opacity",
                  defaultHoverColor: "white",
                  defaultHoverBorderColor: "none",
                  onlyIconSize: "8px",
                },
              },
            }}
          >
            {/* Nút sửa */}
            <Button
              size="small"
              type="default"
              icon={<EditFilled />}
              className="bg-[#27A743] text-white"
              onClick={(e) => {
                e.stopPropagation();
                handlerClickUpdate(record);
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#15803d")}
            />
            {/* Nút nhập hàng */}
            <Button
              size="small"
              type="default"
              icon={<TagFilled />}
              className="bg-[#138cff] text-white"
              onClick={(e) => {
                e.stopPropagation();
                openInsertStockEntry(record);
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#107bff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#138cff")}
            />
            {/* Nút ngừng bán hoặc mở bán tùy trạng thái */}
            {record.status === "unavailable" && (
              <Button
                size="small"
                type="default"
                icon={<PoweroffOutlined />}
                className="bg-[#feca39] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handlerOpenSell(record);
                }}
              />
            )}
            {record.status === "available" && (
              <>
                <Button
                  size="small"
                  type="default"
                  icon={<DeleteFilled />}
                  className="bg-red-500 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlerStopSell(record);
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#991b1b")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#dc2626")
                  }
                />
              </>
            )}
          </ConfigProvider>
        </Space>
      ),
    },
  ].filter(Boolean);

  // Row selection giống ListOrder
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <Layout className="over">
      <div className="bg-[#ffff] h-fit px-6 overflow-hidden rounded-[20px] shadow-md">
        <Flex gap="middle" vertical>
          <div className="text-2xl text-primary font-bold mt-3">
            Danh sách sản phẩm
          </div>
          <Flex gap="middle">
            <Button
              type="primary"
              className="bg-[#EAF3FE] text-[#689CF8] font-medium"
              icon={<PlusCircleOutlined />}
              onClick={handlerClickAddProduct}
            >
              Thêm sản phẩm
            </Button>
            <Button
              onClick={handleResetAll}
              type="default"
              icon={<ReloadOutlined />}
            >
              Tải lại
            </Button>
            <FilterButton
              columnsVisibility={columnsVisibility}
              handleColumnVisibilityChange={handleColumnVisibilityChange}
              columnNames={columns}
              title="Ẩn"
              typeFilter="column"
            />
          </Flex>
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <Table
              size="small"
              scroll={{ x: productColumns.length * 120 }}
              dataSource={filteredProducts}
              rowKey="productID"
              className="text-sm font-thin hover:cursor-pointer"
              columns={productColumns}
              rowSelection={rowSelection}
              pagination={{
                pageSize,
                current: currentPage,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
              }}
              onChange={(pagination, filters, sorter) => {
                setCurrentPage(pagination.current);
                setPageSize(pagination.pageSize);
                setFilteredInfo(filters || {});
                setSortedInfo(sorter || {});
              }}
              filteredInfo={filteredInfo}
              sortedInfo={sortedInfo}
              onRow={(record) => ({
                onClick: () => handlerClickProduct(record),
              })}
            />
          </Spin>
          <InsertStockEntry
            isOpen={isStockEntryOpen}
            onClose={() => setIsStockEntryOpen(false)}
            productID={selectedProduct?.productID}
            productName={selectedProduct?.name}
            onStockUpdated={reloadProducts}
            entryPrice={selectedProduct?.price}
          ></InsertStockEntry>
        </Flex>
      </div>
    </Layout>
  );
};

export default Page;
