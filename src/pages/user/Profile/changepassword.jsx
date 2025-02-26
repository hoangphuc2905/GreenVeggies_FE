const ChangePassword = () => {
    return (
      <>
        <h2 className="text-xl font-bold text-center mb-4">Đặt lại mật khẩu</h2>
  
        {/* Change Password Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu cũ:</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300" required />
          </div>
  
          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu mới:</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300" required />
          </div>
  
          <div>
            <label className="block text-gray-700 mb-1">Nhập lại mật khẩu mới:</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300" required />
          </div>
  
          <button type="submit" className="mt-4 w-full py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600 transition">
            Đặt lại mật khẩu
          </button>
        </form>
      </>
    );
  };
  
  export default ChangePassword;
  