import { useEffect, useState } from "react";
import {
  Layout,
  Spin,
  Button,
  Menu,
  ConfigProvider,
  Image,
  message,
} from "antd";
import { PlusCircleFilled, TagOutlined } from "@ant-design/icons";
import { motion } from "framer-motion"; // Import Framer Motion
import Description from "./Description";
import Rating from "./Rating";
import { useHandlerClickUpdate } from "../../../../components/updateProduct/handlerClickUpdate";
import { useLocation } from "react-router-dom";
import History from "../../stockEntry/History";
import InsertStockEntry from "../../stockEntry/InsertStockEntry";
import { getProductById } from "../../../../services/ProductService";
const Detail = () => {
  const location = useLocation();
  const id = location.state?.productID;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState("Detail");
  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);

  const handlerClickUpdate = useHandlerClickUpdate();

  const openInsertStockEntry = (product) => {
    setIsStockEntryOpen(true);
    setProduct(product);
  };

  const reloadProduct = async (id) => {
    setLoading(true);
    try {
      const response = await getProductById(id); // Gọi API lấy sản phẩm theo ID

      if (response.error) {
        // Nếu có lỗi từ BE, hiển thị thông báo lỗi
        console.error("Lỗi từ BE:", response.error);
        message.error(response.error); // Hiển thị thông báo lỗi
      } else {
        // Nếu thành công, cập nhật sản phẩm
        setProduct(response);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      message.error("Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadProduct(id);
  }, [id]);

  if (loading)
    return <Spin size="large" className="flex justify-center mt-10" />;

  return (
    <Layout className="h-fit">
      <div className="w-full bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image.PreviewGroup
              items={
                Array.isArray(product?.imageUrl) && product.imageUrl.length > 0
                  ? product.imageUrl
                  : [product?.imageUrl]
              }
            >
              <Image
                width={65}
                height={65}
                src={
                  Array.isArray(product?.imageUrl) &&
                  product.imageUrl.length > 0
                    ? product.imageUrl[0]
                    : product?.imageUrl
                }
                alt={product?.name || "Product Image"}
                style={{
                  borderRadius: "50%",
                  width: "65px",
                  height: "65px",
                  objectFit: "cover",
                }}
              />
            </Image.PreviewGroup>

            <div>
              <div className="text-[20px] font-medium product_name">
                {product?.name}
              </div>
              <div className="text-[15px] font-normal text-[#808080]">
                Mã sản phẩm: {product?.productID}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="primary"
              className="bg-[#EAF3FE] text-[#689CF8] font-medium"
              icon={<PlusCircleFilled />}
              onClick={() => handlerClickUpdate(product)}
            >
              Chỉnh sửa
            </Button>

            <Button
              type="primary"
              className="bg-[#EAF3FE] text-[#689CF8] font-medium"
              icon={<TagOutlined />}
              onClick={() => openInsertStockEntry(product)}
            >
              Nhập hàng
            </Button>
          </div>
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
              items={[
                { label: "Thông tin chi tiết", key: "Detail" },
                { label: "Phản hồi của khách hàng", key: "Rate" },
                { label: "Lịch sử nhập hàng", key: "Stock" },
              ]}
              selectedKeys={[selectedKey]}
              onClick={(e) => setSelectedKey(e.key)}
              style={{ borderRadius: "8px" }}
            />
          </ConfigProvider>
        </div>
      </div>
      <motion.div
        key={selectedKey}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-6"
      >
        {selectedKey === "Detail" && <Description product={product} />}
        {selectedKey === "Rate" && <Rating product={product} />}
        {selectedKey === "Stock" && <History product={product} />}
      </motion.div>

      <InsertStockEntry
        isOpen={isStockEntryOpen}
        onClose={() => setIsStockEntryOpen(false)}
        productID={product?.productID}
        productName={product?.name}
        onStockUpdated={reloadProduct}
        entryPrice={product?.price}
      ></InsertStockEntry>
    </Layout>
  );
};

export default Detail;
