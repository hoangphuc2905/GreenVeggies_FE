import { handleProductApi } from "../../api/api";

const updateStatus = (id, status) => {
  // handleProductApi.updateProductStatus(id, status)
  return handleProductApi.updateProductStatus(id, status).then((res) => {
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update product status");
    }
  });
};

export default updateStatus;
