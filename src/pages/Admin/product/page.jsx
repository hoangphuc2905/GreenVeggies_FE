import {
  Breadcrumb,
  Button,
  Flex,
  Input,
  Layout,
  Table,
  Tag,
  Space,
  Select,
} from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DeleteFilled,
  EditFilled,
  HomeOutlined,
  PlusCircleOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import userRender from "../userRender/userRender";

const { Search } = Input;

const fetchProducts = async (key) => {
  try {
    const response = await axios.get(`http://localhost:8002/api/${key}`);
    return response.data;
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

  const options = [
    {
      value: "Tất cả",
    },
    {
      value: "Admin",
    },
    {
      value: "User",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchProducts("products");
      setProducts(data);
    };

    fetchUsers();
  }, []);

  const onSearch = (value) => {
    setSearchQuery(value);
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  return (
    <Layout className="-mt-9 h-fit">
      <Breadcrumb
        items={[
          {
            href: "",
            title: <HomeOutlined />,
          },
          {
            href: "/products",
            title: (
              <>
                <ShopOutlined />
                <span>Quản lý sản phẩm</span>
              </>
            ),
          },
          {
            title: "Danh sách sản phẩm",
          },
        ]}
        className="py-5"
      />
      <div className="bg-[#ffff] h-fit px-6 overflow-hidden rounded-[20px]">
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
              options={options}
            />
            <Search
              placeholder="Tìm kiếm sản phẩm"
              onSearch={onSearch}
              className="w-2/3"
            />
            <Button
              type="primary"
              className="bg-blue-500 text-white font-bold"
              icon={<PlusCircleOutlined />}
            >
              Thêm sản phẩm
            </Button>
          </Flex>
          <Table
            size="large"
            dataSource={products}
            rowKey="productID"
            pagination={{ pageSize: 5 }}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          >
            <Column
              title="#"
              key="index"
              align="center"
              render={(_, __, index) => index + 1}
            />
            <Column title="Mã sản phẩm" dataIndex="productID" key="productID" align="center" />
            <Column title="Tên sản phẩm" dataIndex="name" key="name" align="center" />
            <Column
              title="Hình ảnh"
              dataIndex="imageUrl"
              key="imageUrl"
              align="center"
              render={(imageUrl) => {
                const firstImage = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
                return (
                  <div className="flex justify-center items-center">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt="product"
                        className="rounded-full w-11 h-11 object-cover"
                      />
                    ) : (
                      <span>Không có ảnh</span>
                    )}
                  </div>
                );
              }}
            />
            <Column title="Danh mục" dataIndex="category" key="category" align="center" render={(category) => category?.name || "--|--"} />
            <Column title="Giá (VNĐ)" dataIndex="price" key="price" align="center" render={(text, record) => `${text.toLocaleString()} / ${record.unit}`} />
            <Column title="Xuất xứ" dataIndex="origin" key="origin" align="center" />
            <Column title="Số lượng" dataIndex="quantity" key="quantity" align="center" render={(text, record) => `${text.toLocaleString()} ${record.unit}`} />
            <Column title="Đã bán" dataIndex="sold" key="sold" align="center" render={(text, record) => `${text.toLocaleString()} ${record.unit}`} />
            <Column title="Đánh giá" dataIndex="review" key="review" align="center" render={(text) => text || "-"} />
            <Column
              title="Tình trạng"
              dataIndex="status"
              key="status"
              align="center"
              render={(status) => {
                let color = status === "available" ? "green" : status === "out_of_stock" ? "red" : "gray";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
              }}
            />
            <Column
              title="Tác vụ"
              key="action"
              align="center"
              render={() => (
                <Space size="middle">
                  <Button type="primary" icon={<EditFilled />} className="bg-green-500 text-white" />
                  <Button type="primary" icon={<DeleteFilled />} className="bg-red-500 text-white" />
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
