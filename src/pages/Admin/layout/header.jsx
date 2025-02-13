import logo from "../../../assets/Green.png"; // Đảm bảo đường dẫn tới logo đúng

const AdminHeader = () => {
  return (
    <div className="flex content-between items-center h-16 px-11 bg-[#82AE46] fixed w-full z-[1000]">
      <div className="flex items-center">
        <img src={logo} alt="logo" className="h-10 mx-4" />
        <span className="text-lg font-bold text-white">GreenVeggies</span>{" "}
      </div>
    </div>
  );
};

export default AdminHeader;
