import React, { useState } from 'react';

function Pass() {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp");
        } else {
            console.log('Mật khẩu đã được cập nhật:', form);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Đặt lại mật khẩu</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác:
                <br />
                <span className="font-bold text-gray-900">Nguyenminhthuan250718@gmail.com</span>
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại:</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu mới:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 focus:outline-none"
                >
                    Cập nhật
                </button>
            </form>
        </div>
    );
}

export default Pass;
