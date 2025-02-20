import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import { Divider } from "antd";

const Wishlist = ({ wishlist }) => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Header />
      <div className="container mx-auto mt-20">
        <Divider style={{ borderColor: "#7cb305" }}></Divider>
        <h2 className="text-3xl font-bold text-center">Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {wishlist.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <img
                src={
                  Array.isArray(item.imageUrl)
                    ? item.imageUrl[0]
                    : item.imageUrl
                }
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl font-bold mt-2">{item.name}</h3>
              <p className="text-gray-700">{item.price}đ</p>
              <p className="text-gray-700">Số lượng: {item.quantity}</p>
              <Link
                to={`/product/${item._id}`}
                className="text-blue-500 mt-2 inline-block">
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

Wishlist.propTypes = {
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      imageUrl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
    })
  ).isRequired,
};

export default Wishlist;
