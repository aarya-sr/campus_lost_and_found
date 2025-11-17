import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">

            {/* logo */}
            <h2 className="text-2xl font-bold">locatr</h2>

            {/* links */}
            <div className="flex gap-6">
                <Link to={"/login"} className="text-lg hover:text-gray-300 transition">Login
                </Link>

                <Link to={"/signup"} className="text-lg bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition">Signup
                </Link>
            </div>
        </nav>


        // <nav className="navbar">
        //     <h2 className="navbar-logo">locatr</h2>
        //     <div className="navbar-links">
        //         <Link to="/login" className="nav-link-login">Login</Link>
        //         <Link to ="/signup" className="nav-link-signup">Signup</Link>
        //     </div>
        // </nav>
    )
}