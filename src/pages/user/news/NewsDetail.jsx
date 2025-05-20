import { useParams } from "react-router-dom";
import { newsData } from "./NewsData"; // Lấy dữ liệu tin tức

const NewsDetail = () => {
  const { id } = useParams(); // Lấy id từ URL

  // Tìm bài viết tương ứng với id
  const news = newsData.find((item) => item.id === parseInt(id));

  if (!news) {
    return <div className="text-center mt-8">Không tìm thấy tin tức.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 mt-24"> {/* Thêm lớp mt-24 để tạo khoảng cách phía trên */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h2>
          <p className="text-sm text-gray-500 mb-6">{news.date}</p>

          <div className="mt-4 text-gray-700 text-base leading-relaxed">
            <p>{news.content}</p>

            {/* Quy trình chuẩn tạo nên chất lượng */}
            {id === "1" && (
              <>
                {/* Thêm ảnh phía trên mô tả */}
                <h3 className="font-semibold text-xl mt-6 mb-2">Quy trình chuẩn tạo nên chất lượng</h3>
                <ul className="list-inside list-disc">
                  <li>Thu hoạch táo đúng tuổi với độ chín chuẩn và kỹ thuật trồng hữu cơ.</li>
                  <li>Sàng lọc các loại táo theo tiêu chuẩn kích thước, màu sắc, chất lượng.</li>
                  <li>Rửa sạch các loại táo bằng nước sạch và thực phẩm an toàn.</li>
                  <li>Luộc táo để quả mềm và dẻo hơn.</li>
                  <li>Làm lạnh sau khi luộc để giữ nguyên dinh dưỡng và độ giòn.</li>
                  <li>Sấy khô táo dưới 55°C để bảo tồn hương vị, dưỡng chất.</li>
                  <li>Sàng lọc loại bỏ những quả không đạt yêu cầu và tiến hành đóng gói.</li>
                  <li>Kiểm tra lại sản phẩm trước khi đóng gói và xuất xưởng.</li>
                  <li>Xuất xưởng và vận chuyển đến người tiêu dùng.</li>
                </ul>
              </>
            )}

            {id === "2" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Hướng dẫn bảo quản bơ hiệu quả</h3>
                <ul className="list-inside list-disc">
                  <li>Giữ bơ ở nhiệt độ phòng cho đến khi bơ chín hoàn toàn.</li>
                  <li>Sử dụng giấy báo để bao bọc bơ khi bảo quản trong tủ lạnh.</li>
                  <li>Đặt bơ vào túi ziplock và bảo quản trong ngăn rau quả của tủ lạnh.</li>
                  <li>Tránh để bơ tiếp xúc trực tiếp với không khí để tránh bị thâm đen.</li>
                </ul>
              </>
            )}

            {id === "3" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Lợi ích của táo đỏ đối với sức khỏe</h3>
                <ul className="list-inside list-disc">
                  <li>Táo đỏ giúp cải thiện hệ miễn dịch nhờ lượng vitamin C dồi dào.</li>
                  <li>Chứa nhiều chất chống oxy hóa, giúp chống lại quá trình lão hóa.</li>
                  <li>Tăng cường chức năng tiêu hóa và hỗ trợ sức khỏe tim mạch.</li>
                </ul>
              </>
            )}

            {id === "4" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Nước ép lựu giúp làm đẹp da từ thiên nhiên</h3>
                <ul className="list-inside list-disc">
                  <li>Lựu là nguồn vitamin C tuyệt vời, giúp da sáng mịn và tươi trẻ.</li>
                  <li>Cung cấp nhiều chất chống oxy hóa, giúp chống lại các dấu hiệu lão hóa.</li>
                  <li>Giúp da luôn khỏe mạnh và ngăn ngừa các vấn đề về da như mụn hoặc nám.</li>
                </ul>
              </>
            )}

            {id === "5" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Vitamin C từ cam - nguồn bổ sung tuyệt vời cho cơ thể</h3>
                <ul className="list-inside list-disc">
                  <li>Cam giúp nâng cao hệ miễn dịch và bảo vệ cơ thể khỏi các bệnh tật.</li>
                  <li>Cung cấp vitamin C giúp tăng cường sức đề kháng và làm đẹp da.</li>
                  <li>Cung cấp nhiều chất xơ tốt cho hệ tiêu hóa.</li>
                </ul>
              </>
            )}

            {id === "6" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Tết này tặng nhau quà gì?</h3>
                <ul className="list-inside list-disc">
                  <li>Chọn các món quà sức khỏe như thực phẩm hữu cơ, vitamin C từ trái cây.</li>
                  <li>Các bộ quà tặng thiết thực và ý nghĩa cho mùa Tết.</li>
                  <li>Những món quà tinh thần giúp gắn kết tình cảm gia đình và bạn bè.</li>
                </ul>
              </>
            )}

            {id === "7" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Nên ăn chuối vào lúc nào là tốt nhất?</h3>
                <ul className="list-inside list-disc">
                  <li>Ăn chuối vào buổi sáng giúp cung cấp năng lượng cho cả ngày dài.</li>
                  <li>Chuối rất tốt cho tiêu hóa và giúp giảm căng thẳng.</li>
                  <li>Ăn chuối sau khi tập luyện giúp phục hồi cơ bắp và bổ sung kali.</li>
                </ul>
              </>
            )}

            {id === "8" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Những lợi ích không ngờ của xoài chín</h3>
                <ul className="list-inside list-disc">
                  <li>Xoài giúp tăng cường thị lực nhờ hàm lượng vitamin A dồi dào.</li>
                  <li>Cải thiện hệ tiêu hóa và giúp giảm táo bón hiệu quả.</li>
                  <li>Giàu chất xơ và giúp làm đẹp da từ bên trong.</li>
                </ul>
              </>
            )}

            {id === "9" && (
              <>
                <h3 className="font-semibold text-xl mt-6 mb-2">Dâu tây – Loại trái cây chống lão hóa tuyệt vời</h3>
                <ul className="list-inside list-disc">
                  <li>Dâu tây chứa nhiều vitamin C giúp chống lại các dấu hiệu lão hóa.</li>
                  <li>Giúp cải thiện làn da, làm sáng mịn và chống oxy hóa mạnh mẽ.</li>
                  <li>Dâu tây có tác dụng giảm căng thẳng và tốt cho hệ tiêu hóa.</li>
                </ul>
              </>
            )}

            <p className="mt-4">
              Trải nghiệm ngay để cảm nhận sự khác biệt của sản phẩm hữu cơ, chất lượng cho sức khỏe của bạn!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;