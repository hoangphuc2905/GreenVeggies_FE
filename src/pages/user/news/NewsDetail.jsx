import { useParams } from "react-router-dom";
import { newsData } from "./NewsData"; // Import dữ liệu tin tức

const NewsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL (id là chỉ số của tin tức trong mảng)
  const news = newsData.find((item) => item.id === parseInt(id)); // Truy cập thông tin chi tiết của tin tức

  if (!news) {
    return <div className="text-center mt-8">Không tìm thấy tin tức.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 mt-16">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Hình ảnh tin tức */}
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-96 object-cover"
        />
        
        <div className="p-6">
          {/* Tiêu đề tin tức */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h2>
          <p className="text-sm text-gray-500 mb-6">{news.date}</p>

          {/* Nội dung chi tiết */}
          <div className="mt-4 text-gray-700 text-base leading-relaxed">
            <p>{news.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;