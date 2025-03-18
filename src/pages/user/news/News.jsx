import { useState } from "react";
import { Link } from "react-router-dom"; // Sử dụng Link để điều hướng
import { newsData } from "./NewsData"; // Lấy dữ liệu tin tức

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
    <div className="px-[10%] py-6 mt-16">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Tin tức</h2>

        {/* Danh sách tin tức */}
        <div className="space-y-4">
          {currentNews.map((news) => (
            <div key={news.id} className="flex bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-32 h-32 object-cover"
              />
              <div className="p-4 flex flex-col justify-between">
                <h3 className="text-lg font-bold">
                  <Link to={`/news/${news.id}`}>{news.title}</Link> {/* Sử dụng Link để chuyển hướng */}
                </h3>
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