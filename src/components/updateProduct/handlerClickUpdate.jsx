import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useHandlerClickUpdate = () => {
  const navigate = useNavigate();

  const handlerClickUpdate = useCallback((product) => {
    navigate(`/admin/products/update-product/${product._id}`, { state: { product } });
  }, [navigate]);

  return handlerClickUpdate;
};