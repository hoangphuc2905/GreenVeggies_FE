import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Spin, Button, Menu, ConfigProvider } from "antd";
import {
  PlusCircleFilled,
} from "@ant-design/icons";
import { motion } from "framer-motion"; // Import Framer Motion
import { getProductDetail } from "../../../api/api";
import Description from "./description";
import Rating from "./rating";

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState("Detail");
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    { label: "Thông tin chi tiết", key: "Detail" },
    { label: "Phản hồi của khách hàng", key: "Rate" },
  ];

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail(id);
        setProduct(response);
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
    <Layout className="h-fit">
     
      <div className="w-full bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={product?.imageUrl}
              alt={product?.name}
              className="w-20 h-20 object-cover mt-4 rounded-full"
            />
            <div>
              <div className="text-[20px] font-medium product_name"> {product?.name}</div>
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
        <div className="mt-7">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemHoverColor: "#141515",
                  itemSelectedColor: "#FF5722",
                  itemHoverBg: "#388E3C",
                  itemSelectedBg: "#1B5E20",
                  horizontalItemSelectedColor: "#27A743",
                  colorText: "#7A8699",
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
        </div>
      </div>
      <motion.div
        key={selectedKey} // Giúp animation chạy lại khi đổi tab
        initial={{ y: "-100%", opacity: 0 }} // Bắt đầu từ ngoài trái màn hình
        animate={{ y: 0, opacity: 1 }} // Trượt vào
        exit={{ x: "100%", opacity: 0 }} // Khi biến mất trượt sang phải
        transition={{ duration: 0.5, ease: "easeOut" }} // Tốc độ animation
        className="mt-6"
      >
        {selectedKey === "Detail" && <Description product={product} />}
        {selectedKey === "Rate" && <Rating />}
      </motion.div>
    </Layout>
  );
};

export default Detail;
