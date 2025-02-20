import { useState } from 'react';

function ProfileForm() {
    const [profile, setProfile] = useState({
        name: 'Nguyễn Minh Thuận',
        phone: '0977041860',
        email: 'nguyenminhthuan250718@gamil.com',
        dob: '2003-09-09',
        address: 'Long An'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(profile);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 max-w-md">
            <div className="text-center mb-6">
                <img src="https://via.placeholder.com/150" alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto" />
                <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600">
                    Chọn ảnh
                </button>
                <p className="text-sm text-gray-600 mt-2">Dung lượng file tối đa 1 MB Định dạng .JPEG .PNG</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Họ và tên:</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh:</label>
                    <input
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 focus:outline-none">
                    Cập nhật thông tin
                </button>
            </form>
        </div>
    );
}

export default ProfileForm;
