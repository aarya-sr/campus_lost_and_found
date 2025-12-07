// import { useState } from "react";
// import axios from "axios";

// export default function Login() {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
//                 email,
//                 password
//             });

//             alert(res.data.message);
//             localStorage.setItem("token", res.data.token);

//         } catch (err) {
//             alert(err.response?.data?.message || "Login failed");
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
//             <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
//                 <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

//                 <form onSubmit={handleLogin}>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         className="w-full p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />

//                     <input
//                         type="password"
//                         placeholder="Password"
//                         className="w-full p-3 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
//                     >
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }







import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";   // only if you really want to call backend

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 simplest version: ALWAYS go to products after login
    // (works for your project even if auth is not mandatory)
    navigate("/products");

    /*
    // If you want real backend login instead, use this:

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/products");   // only on success
    } catch (err) {
      console.log(err);
      // show error message if you want
    }
    */
  };

  // ⬇️ KEEP YOUR ORIGINAL STYLED JSX HERE ⬇️
  // only change: add value/onChange + onSubmit
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
