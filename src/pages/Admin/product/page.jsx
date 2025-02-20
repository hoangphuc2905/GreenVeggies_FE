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
} from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import userRender from "../userRender/userRender";
import { useNavigate } from "react-router-dom";
import { getListProducts } from "../../../api/api";

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(["Tất cả"]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const statusMapping = {
    available: { text: "Còn hàng", color: "green" },
    unavailable: { text: "Ngừng bán", color: "red" },
    out_of_stock: { text: "Hết hàng", color: "orange" },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchProducts("products");
      setProducts(data);
    };
    const fetchCategories = async () => {
      const data = await fetchProducts("categories");
      const formattedCategories = data.map((category) => ({
        value: category._id, // Hoặc category.id tùy vào dữ liệu
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
    } else {
      setSelectedOptions(value);
    }
  };

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();

  const handlerClickProduct = (product) => {
    setSelectedProduct(product);
    navigate(`/admin/products/${product._id}`);
  };

  const handlerClickAddProduct = () => {
    navigate(`/admin/add-product`);
  };
  return (
    <Layout className="h-fit">
      <div className="bg-[#ffff] h-fit px-6 overflow-hidden rounded-[20px] shadow-md">
        <Flex gap="middle" vertical>
          <div className="text-2xl text-[#82AE46] font-bold mt-3">
            Danh sách sản phẩm
          </div>
          <Flex gap="middle">
            <Select
              mode="multiple"
              tagRender={userRender}
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
          </Flex>
          <Table
            size="large"
            dataSource={filteredProducts}
            rowKey="productID"
            pagination={{ pageSize: 5 }}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            onRow={(record) => ({
              onClick: () => handlerClickProduct(record),
            })}
          >
            <Column
              title="#"
              key="index"
              align="center"
              render={(_, __, index) => index + 1}
            />
            <Column
              title="Mã sản phẩm"
              dataIndex="productID"
              key="productID"
              align="center"
            />
            <Column
              title="Tên sản phẩm"
              dataIndex="name"
              key="name"
              align="center"
            />
            <Column
              title="Hình ảnh"
              dataIndex="imageUrl"
              key="imageUrl"
              align="center"
              render={(imageUrl) => {
                const firstImage = Array.isArray(imageUrl)
                  ? imageUrl[0]
                  : imageUrl;
                return (
                  <div className="flex justify-center items-center">
                    {firstImage ? (
                      <Image
                        width={65}
                        height={65} 
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
            <Column
              title="Danh mục"
              dataIndex="category"
              key="category"
              align="center"
              render={(category) => category?.name || "--|--"}
            />
            <Column
              title="Giá (VNĐ)"
              dataIndex="price"
              key="price"
              align="center"
              render={(text, record) =>
                `${text.toLocaleString()} / ${record.unit}`
              }
            />
            <Column
              title="Xuất xứ"
              dataIndex="origin"
              key="origin"
              align="center"
            />
            <Column
              title="Số lượng"
              dataIndex="quantity"
              key="quantity"
              align="center"
              render={(text, record) =>
                `${text.toLocaleString()} ${record.unit}`
              }
            />
            <Column
              title="Đã bán"
              dataIndex="sold"
              key="sold"
              align="center"
              render={(text, record) =>
                `${text.toLocaleString()} ${record.unit}`
              }
            />
            <Column
              title="Đánh giá"
              dataIndex="review"
              key="review"
              align="center"
              render={(text) => text || "-"}
            />
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
            <Column
              title="Tác vụ"
              key="action"
              align="center"
              render={() => (
                <Space size="middle">
                  <Button
                    type="primary"
                    icon={<EditFilled />}
                    className="bg-green-500 text-white"
                  />
                  <Button
                    type="primary"
                    icon={<DeleteFilled />}
                    className="bg-red-500 text-white"
                  />
                </Space>
              )}
            />
          </Table>
        </Flex>
      </div>
    </Layout>
  );
};

export default Products;
