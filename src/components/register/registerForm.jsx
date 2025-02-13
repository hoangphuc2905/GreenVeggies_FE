import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const SignupForm = ({ switchToLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        phone: "",
        dateOfBirth: "",
        password: "",
        image: null,
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
        formDataToSend.append("password", formData.password);
        if (formData.image) {
            formDataToSend.append("avatar", formData.image);
        }
        formDataToSend.append("address", formData.address);

        try {
            const response = await fetch("http://localhost:8009/api/auth/register", {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();
            console.log('Response data:', data); // Log the response data

            if (response.ok) {
                setSuccess("Đăng ký thành công!");
                setTimeout(() => {
                    switchToLogin(); // Chuyển sang LoginForm khi đăng ký thành công
                }, 2000);
            } else {
                setError(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            setError("Lỗi kết nối, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex w-full max-w-4xl min-h-[500px] relative z-20">
            <button
                onClick={switchToLogin}
                className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900 transition"
            >
                <ArrowLeft size={24} className="mr-2" />
                Back
            </button>

            <div className="w-1/2 hidden md:flex justify-center items-center">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPR4Rmg4qFHK7HJE9AYNqHBfG7mCkVgc0_EA&s"
                    alt="GreenVeggies"
                    className="rounded-lg w-full h-auto"
                />
            </div>

            <div className="w-full md:w-1/2 p-6">
                <h2 className="text-xl font-bold text-green-700 text-center">GREENVEGGIES</h2>
                <h3 className="text-xl font-bold mb-4 text-black text-center">Create Account</h3>

                {error && <div className="text-red-500 text-center mb-3">{error}</div>}
                {success && <div className="text-green-500 text-center mb-3">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Sign up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;