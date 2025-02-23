import { useEffect, useState } from "react";
import { Layout, Spin, Button, Menu, ConfigProvider, Image } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion"; // Import Framer Motion
import { getProductDetail } from "../../../../api/api";
import Description from "./description";
import Rating from "./rating";
import { useHandlerClickUpdate } from "../../../../components/updateProduct/handlerClickUpdate";
import { useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState("Detail");
  const handlerClickUpdate = useHandlerClickUpdate();

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
          <Button
            type="primary"
            className="bg-[#EAF3FE] text-[#689CF8] font-medium"
            icon={<PlusCircleFilled />}
            onClick={() => handlerClickUpdate(product)}
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
              items={[
                { label: "Thông tin chi tiết", key: "Detail" },
                { label: "Phản hồi của khách hàng", key: "Rate" },
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
      </motion.div>
    </Layout>
  );
};

export default Detail;
