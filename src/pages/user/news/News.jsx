import { useState } from "react";

const newsData = [
  {
    title: "TÁO ĐEN HỮU CƠ ORGANICLIFE",
    date: "14/02/2025",
    content: "Táo đen hữu cơ OrganicLife quy trình chuẩn tạo nên chất lượng...",
    image: "src/assets/tao-den.webp",
  },
  {
    title: "LÀM THẾ NÀO ĐỂ BẢO QUẢN BƠ LÂU HƠN?",
    date: "25/03/2025",
    content: "Bơ là loại trái cây bổ dưỡng nhưng dễ hỏng nếu không bảo quản đúng cách...",
    image: "src/assets/bo.jpg",
  },
  {
    title: "LỢI ÍCH CỦA TÁO ĐỎ ĐỐI VỚI SỨC KHỎE",
    date: "05/03/2025",
    content: "Táo đỏ chứa nhiều chất chống oxy hóa và giúp tăng cường hệ miễn dịch...",
    image: "src/assets/2e38c1cb-4723-4e90-b871-c58d21e6ba9e.webp",
  },
  {
    title: "LỰU – BÍ QUYẾT GIÚP LÀM ĐẸP DA TỪ THIÊN NHIÊN",
    date: "02/04/2025",
    content: "Nước ép lựu giúp chống lão hóa và mang lại làn da sáng mịn...",
    image: "src/assets/luu.webp",
  },
  {
    title: "CAM – NGUỒN VITAMIN C TỰ NHIÊN TUYỆT VỜI",
    date: "15/04/2025",
    content: "Cam giúp tăng cường sức đề kháng và giảm căng thẳng hiệu quả...",
    image: "src/assets/cam.webp",
  },
  {
    title: "TẾT NÀY TẶNG NHAU QUÀ GÌ?",
    date: "27/12/2024",
    content: "Tết này tặng nhau quà gì? Không chỉ đơn giản là tặng một món quà...",
    image: "src/assets/thuan2.png",
  },
  {
    title: "NÊN ĂN CHUỐI VÀO LÚC NÀO LÀ TỐT NHẤT?",
    date: "12/03/2025",
    content: "Chuối giúp cung cấp năng lượng và hỗ trợ tiêu hóa hiệu quả...",
    image: "src/assets/Chuoi.webp",
  },
  {
    title: "XOÀI CHÍN VÀ NHỮNG LỢI ÍCH KHÔNG NGỜ",
    date: "10/04/2025",
    content: "Xoài không chỉ ngon mà còn giúp cải thiện tiêu hóa và tăng cường thị lực...",
    image: "src/assets/xoai.jpg",
  },
  {
    title: "DÂU TÂY – LOẠI TRÁI CÂY CHỐNG LÃO HÓA TUYỆT VỜI",
    date: "18/03/2025",
    content: "Dâu tây giàu vitamin C giúp da luôn tươi trẻ và sáng mịn...",
    image: "src/assets/Strawberry1.png",
  },
];

const News = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính tổng số trang
  const totalPages = Math.ceil(newsData.length / itemsPerPage);
  const currentNews = newsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-[10%] py-6 mt-16"> {/* Thêm lớp mt-16 để tạo khoảng cách phía trên */}
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Tin tức</h2>

        {/* Danh sách tin tức */}
        <div className="space-y-4">
          {currentNews.map((news, index) => (
            <div key={index} className="flex bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-32 h-32 object-cover"
              />
              <div className="p-4 flex flex-col justify-between">
                <h3 className="text-lg font-bold">{news.title}</h3>
                <p className="text-sm text-gray-500">{news.date}</p>
                <p className="text-sm text-gray-700">{news.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 border rounded ${currentPage === i + 1 ? "bg-green-500 text-white" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;