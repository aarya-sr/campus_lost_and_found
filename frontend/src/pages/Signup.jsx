import { useState } from "react";
import axios from "axios";

export default function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5001/api/auth/signup", {
                username,
                email,
                password
            });

            alert(res.data.message);

        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Signup</h2>

                <form onSubmit={handleSignup}>
                    
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
                    >
                        Signup
                    </button>

                </form>
            </div>
        </div>
    );
}
