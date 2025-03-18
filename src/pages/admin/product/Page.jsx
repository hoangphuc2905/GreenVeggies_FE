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
import { getListProducts, updateProduct } from "../../../api/api";
import { useHandlerClickUpdate } from "../../../components/updateProduct/handlerClickUpdate";
// import InsertStockEntry from "../stockEntry/InsertStockEntry";
import UserRender from "../userRender/UserRender";
import FilterButton from "../../../components/filter/FilterButton";
import InsertStockEntry from "../stockEntry/InsertStockEntry";

const { Search } = Input;

const fetchProducts = async (key) => {
  try {
    const response = await getListProducts(key);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Page = () => {
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
  const [pageSize, setPageSize] = useState(5);
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
    { key: "productID", typeCol: "none", title: "Mã sản phẩm" },
    { key: "name", typeCol: "text", title: "Tên sản phẩm" },
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
    const fetchUsers = async () => {
      const data = await fetchProducts("products");
      setProducts(data);
      setFilteredProducts(data);
    };
    const fetchCategories = async () => {
      const data = await fetchProducts("categories");
      const formattedCategories = data.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setCategories([
        { value: "Tất cả", label: "Tất cả" },
        ...formattedCategories,
      ]);
    };
    fetchCategories();
    fetchUsers();
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

  const onSearch = (value) => {
    setSearchQuery(value);
    applyFilters(selectedOptions, value);
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

    setFilteredProducts(filteredProducts);
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
            const response = await updateProduct(value.productID, {
              status: "unavailable",
              name: value.name,
              origin: value.origin,
              description: value.description,
            });

            if (response) {
              setSuccessMessage("Đã ngừng bán sản phẩm thành công!");
              await reloadProducts(); // ✅ Cập nhật lại danh sách sản phẩm
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
    const data = await fetchProducts("products");
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
          <Table
            size="small"
            dataSource={filteredProducts}
            rowKey="productID"
            className="text-sm font-thin hover:cursor-pointer"
            pagination={{
              pageSize,
              current: currentPage,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            onRow={(record) => ({
              onClick: () => handlerClickProduct(record),
            })}
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
              />
            )}
            {columnsVisibility.name && (
              <Column
                title="Tên sản phẩm"
                dataIndex="name"
                ellipsis={true}
                key="name"
                align="center"
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
              />
            )}
            {columnsVisibility.price && (
              <Column
                title="Giá (VNĐ)"
                dataIndex="price"
                key="price"
                align="center"
                render={(text, record) =>
                  `${(record.price * 1.5).toLocaleString()} / ${record.unit}`
                }
              />
            )}
            {columnsVisibility.origin && (
              <Column
                title="Xuất xứ"
                dataIndex="origin"
                key="origin"
                align="center"
              />
            )}
            {columnsVisibility.quantity && (
              <Column
                title="Số lượng"
                dataIndex="quantity"
                key="quantity"
                align="center"
                render={(text, record) =>
                  `${text.toLocaleString()} ${record.unit}`
                }
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
              />
            )}
            {columnsVisibility.action && (
              <Column
                title="Tác vụ"
                key="action"
                align="center"
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
          <InsertStockEntry
            isOpen={isStockEntryOpen}
            onClose={() => setIsStockEntryOpen(false)}
            productID={selectedProduct?.productID}
            productName={selectedProduct?.name}
            onStockUpdated={reloadProducts}
          ></InsertStockEntry>
        </Flex>
      </div>
    </Layout>
  );
};

export default Page;
