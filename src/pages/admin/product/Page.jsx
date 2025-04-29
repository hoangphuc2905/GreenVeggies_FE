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
import { useEffect, useState } from "react";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
  TagFilled,
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

  const onSearch = (value) => {
    setSearchQuery(value);
    applyFilters(selectedOptions, value); // Gọi lại hàm lọc sản phẩm sau khi tìm kiếm
  };

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

  const handlerClickProduct = (product) => {
    navigate(`/admin/products/${product._id}`, {
      state: { productID: product.productID },
    });
  };

  const handlerClickAddProduct = () => {
    navigate(`/admin/add-product`);
  };

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

  return (
    <Layout className="over">
      <div className="bg-[#ffff] h-fit px-6 overflow-hidden rounded-[20px] shadow-md">
        <Flex gap="middle" vertical>
          <div className="text-2xl text-primary font-bold mt-3">
            Danh sách sản phẩm
          </div>
          <Flex gap="middle">
            <Select
              mode="multiple"
              tagRender={UserRender}
              value={selectedOptions}
              className="w-72"
              options={categories}
              onChange={handlerFilter}
            />
            <Search
              placeholder="Tìm kiếm sản phẩm"
              onSearch={onSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-2/3"
            />
            <Button
              type="primary"
              className="bg-[#EAF3FE] text-[#689CF8] font-medium"
              icon={<PlusCircleOutlined />}
              onClick={handlerClickAddProduct}
            >
              Thêm sản phẩm
            </Button>
            <FilterButton
              columnsVisibility={columnsVisibility}
              handleColumnVisibilityChange={handleColumnVisibilityChange}
              columnNames={columns}
              title="Ẩn"
              typeFilter="column"
            />
            {/* <FilterButton
              columnsVisibility={columnsVisibility}
              handleColumnVisibilityChange={handleColumnVisibilityChange}
              columnNames={columns}
              filters={filters}
              setFilters={setFilters}
              title="Lọc"
              typeFilter="filter"
            /> */}
          </Flex>
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <Table
              size="small"
              scroll={{ x: "max-content" }}
              dataSource={filteredProducts}
              rowKey="productID"
              className="text-sm font-thin hover:cursor-pointer"
              pagination={{
                pageSize, // Số lượng sản phẩm trên mỗi trang
                current: currentPage, // Trang hiện tại
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
              }}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              onRow={(record) => ({
                onClick: () => handlerClickProduct(record),
              })}
              onChange={(pagination, filters, sorter) => {
                const { order, columnKey } = sorter;
                const sortedData = [...filteredProducts];

                if (order === "ascend") {
                  sortedData.sort((a, b) =>
                    a[columnKey] > b[columnKey] ? 1 : -1
                  );
                } else if (order === "descend") {
                  sortedData.sort((a, b) =>
                    a[columnKey] < b[columnKey] ? 1 : -1
                  );
                }

                setFilteredProducts(sortedData);
              }}
            >
              <Column
                title="#"
                key="index"
                align="center"
                render={(_, __, index) =>
                  (currentPage - 1) * pageSize + index + 1
                }
              />
              {columnsVisibility.productID && (
                <Column
                  title="Mã sản phẩm"
                  dataIndex="productID"
                  key="productID"
                  align="center"
                  sorter={(a, b) => a.productID.localeCompare(b.productID)}
                />
              )}
              {columnsVisibility.name && (
                <Column
                  title="Tên sản phẩm"
                  dataIndex="name"
                  ellipsis={true}
                  key="name"
                  align="center"
                  fixed="left"
                  sorter={(a, b) => a.name.localeCompare(b.name)}
                />
              )}
              {columnsVisibility.imageUrl && (
                <Column
                  title="Hình ảnh"
                  dataIndex="imageUrl"
                  key="imageUrl"
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                  render={(imageUrl) => {
                    const firstImage = Array.isArray(imageUrl)
                      ? imageUrl[0]
                      : imageUrl;
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
                  }}
                />
              )}
              {columnsVisibility.category && (
                <Column
                  title="Danh mục"
                  dataIndex="category"
                  key="category"
                  align="center"
                  render={(category) => category?.name || "--|--"}
                  sorter={(a, b) =>
                    a.category?.name.localeCompare(b.category?.name)
                  }
                />
              )}
              {columnsVisibility.price && (
                <Column
                  title="Giá (VNĐ)"
                  dataIndex="price"
                  key="price"
                  align="center"
                  render={(text, record) =>
                    `${formattedPrice(CalcPrice(record.price))} / ${
                      record.unit
                    }`
                  }
                  sorter={(a, b) => a.price - b.price}
                />
              )}
              {columnsVisibility.origin && (
                <Column
                  title="Xuất xứ"
                  dataIndex="origin"
                  key="origin"
                  align="center"
                  render={(origin) => origin || "--|--"}
                />
              )}
              {columnsVisibility.quantity && (
                <Column
                  title="SL còn lại"
                  dataIndex="quantity"
                  key="quantity"
                  align="center"
                  render={(text, record) =>
                    `${text.toLocaleString()} ${record.unit}`
                  }
                  sorter={(a, b) => a.quantity - b.quantity}
                />
              )}
              {columnsVisibility.sold && (
                <Column
                  title="Đã bán"
                  dataIndex="sold"
                  key="sold"
                  align="center"
                  render={(text, record) =>
                    `${text.toLocaleString()} ${record.unit}`
                  }
                  sorter={(a, b) => a.sold - b.sold}
                />
              )}
              {columnsVisibility.reviews && (
                <Column
                  title="Đánh giá"
                  dataIndex="reviews"
                  key="reviews"
                  align="center"
                  render={(reviews) => (
                    <div>{calculateAverageRating(reviews)}</div>
                  )}
                  sorter={(a, b) =>
                    calculateAverageRating(a.reviews) -
                    calculateAverageRating(b.reviews)
                  }
                />
              )}
              {columnsVisibility.status && (
                <Column
                  title="Tình trạng"
                  dataIndex="status"
                  key="status"
                  align="center"
                  render={(status) => (
                    <Tag color={statusMapping[status]?.color}>
                      {statusMapping[status]?.text}
                    </Tag>
                  )}
                  filters={productStatuses.map((status) => ({
                    text: status.label,
                    value: status.value,
                  }))}
                  onFilter={(value, record) => record.status === value}
                />
              )}

              {columnsVisibility.action && (
                <Column
                  title="Tác vụ"
                  key="action"
                  align="center"
                  fixed="right"
                  render={(text, record) => (
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
                        <Button
                          size="small"
                          type="default"
                          icon={<EditFilled />}
                          className="bg-[#27A743] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlerClickUpdate(record);
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#15803d")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#15803d")
                          }
                        />
                        <Button
                          size="small"
                          type="default"
                          icon={<TagFilled />}
                          className="bg-[#138cff] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            openInsertStockEntry(record);
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#107bff")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#138cff")
                          }
                        />
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
                      </ConfigProvider>
                    </Space>
                  )}
                />
              )}
            </Table>
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
