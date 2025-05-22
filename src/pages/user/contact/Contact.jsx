import contac1 from "../../../assets/pictures/thuan2.png";
import contac2 from "../../../assets/pictures/lienhe.jpg";

const Lienhe = () => {
  return (
    <div className="px-[10%]">
      <div className="container mx-auto relative">
        <img src={contac2} alt="Background" className="w-full h-[550px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-white text-8xl font-bold shadow-md font-amatic">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-2 text-lg text-white">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn! 
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container w-full mx-auto py-12">
        <div className="grid md:grid-cols-2 gap-8 justify-between w-full">
          {/* Thay khung "Gửi tin nhắn" bằng 1 hình ảnh */}
          <div className="flex justify-center ">
            <img
              src={contac1}
              alt="Hỗ trợ khách hàng"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Văn bản trợ giúp của shop */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
              📢 Vegefoods - Đồng hành cùng sức khỏe gia đình bạn!
            </h2>
            <p className="text-gray-700">
              Chào mừng bạn đến với <strong>Vegefoods</strong>, nơi cung cấp{" "}
              <strong>thực phẩm sạch, tươi ngon</strong> mỗi ngày. Chúng tôi cam
              kết mang đến <strong>rau củ quả chất lượng cao</strong>, đảm bảo{" "}
              <strong>an toàn sức khỏe</strong> cho mọi gia đình. Với mong muốn
              phục vụ tốt nhất, Vegefoods luôn tuyển chọn kỹ lưỡng từng sản
              phẩm, đảm bảo nguồn gốc rõ ràng và đạt tiêu chuẩn an toàn thực
              phẩm.
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                📍 <strong>Địa chỉ:</strong> 12 Phạm Văn Bảo, P.1, Gò Vấp,
                TP.HCM
              </p>
              <p>
                📞 <strong>Hotline hỗ trợ:</strong> (+84) 987-654-321
              </p>
              <p>
                📧 <strong>Email liên hệ:</strong> smileshopptit@gmail.com
              </p>
            </div>
            <p className="mt-4 text-gray-700">
              Nếu bạn có bất kỳ câu hỏi nào về sản phẩm hoặc cần tư vấn,{" "}
              <strong>đừng ngần ngại liên hệ với chúng tôi</strong>! Vegefoods
              luôn sẵn sàng hỗ trợ và đồng hành cùng bạn.
            </p>
            <p className="mt-4 text-green-600 font-bold text-center">
              🌿 Đặt hàng ngay hôm nay để nhận <strong>ưu đãi đặc biệt</strong>{" "}
              và cùng Vegefoods xây dựng một{" "}
              <strong>lối sống xanh, lành mạnh!</strong> 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Google Maps - Đặt gần footer và mở rộng kích thước */}
      <div className="container mx-auto pb-12">
        <div className="w-full h-[450px] rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31349.66356226036!2d106.64666935971026!3d10.833647667504824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1712550958598!5m2!1svi!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default Lienhe;
