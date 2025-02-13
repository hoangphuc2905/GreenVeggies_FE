import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Spin, Breadcrumb, Button, Menu, ConfigProvider } from "antd";
import {
  HomeOutlined,
  PlusCircleFilled,
  ShopOutlined,
} from "@ant-design/icons";
import DetailProfile from "./detailProfile";
import { motion } from "framer-motion"; // Import Framer Motion

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState("Detail");

  const items = [
    { label: "Thông tin chi tiết", key: "Detail" },
    { label: "Phản hồi của khách hàng", key: "Rate" },
  ];

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8002/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading)
    return <Spin size="large" className="flex justify-center mt-10" />;

  return (
    <Layout className="-mt-9 h-fit">
      <Breadcrumb
        items={[
          { href: "", title: <HomeOutlined /> },
          {
            href: "/products",
            title: (
              <>
                <ShopOutlined />
                <span>Quản lý sản phẩm</span>
              </>
            ),
          },
          { href: "/products", title: "Danh sách sản phẩm" },
          { title: product?.name },
        ]}
        className="py-5"
      />
      <div className="w-full bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={product?.imageUrl}
              alt={product?.name}
              className="w-20 h-20 object-cover mt-4 rounded-full"
            />
            <div>
              <div className="text-[20px] font-medium"> {product?.name}</div>
              <div className="text-[15px] font-normal text-[#808080]">
                Mã sản phẩm: {product?.productID}
              </div>
            </div>
          </div>
          <Button
            type="primary"
            className="bg-[#EAF3FE] text-[#689CF8] font-medium"
            icon={<PlusCircleFilled />}
          >
            Chỉnh sửa
          </Button>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHoverColor: "#141515",
                itemSelectedColor: "#FF5722",
                itemHoverBg: "#388E3C",
                itemSelectedBg: "#1B5E20",
                horizontalItemSelectedColor: "#27A743",
              },
            },
          }}
        >
          <Menu
            mode="horizontal"
            items={items}
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            style={{ borderRadius: "8px" }}
          />
        </ConfigProvider>

        {/* Hiển thị nội dung với animation */}
      </div>
      <motion.div
        key={selectedKey} // Giúp animation chạy lại khi đổi tab
        initial={{ y: "-100%", opacity: 0 }} // Bắt đầu từ ngoài trái màn hình
        animate={{ y: 0, opacity: 1 }} // Trượt vào
        exit={{ x: "100%", opacity: 0 }} // Khi biến mất trượt sang phải
        transition={{ duration: 0.5, ease: "easeOut" }} // Tốc độ animation
        className="mt-6"
      >
        {selectedKey === "Detail" && <DetailProfile product={product} />}
        {selectedKey === "Rate" && <p>Phản hồi của khách hàng...</p>}
      </motion.div>
    </Layout>
  );
};

export default Detail;
