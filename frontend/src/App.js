// // import {BrowserRouter,Routes,Route} from 'react-router-dom';
// // import Login from './pages/Login';
// // import Signup from './pages/Signup';
// // import Navbar from './components/Navbar';

// // function App(){
// //   return(
// //     <BrowserRouter>
// //     <Navbar/>
// //     <Routes>

// //       <Route path="/login" element={<Login/>}/>
// //       <Route path="/signup" element={<Signup/>}/>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }


// // export default App;





// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Navbar from "./components/Navbar";
// import Products from "./pages/Products"; // 👈 new CRUD page

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Navigate to="/products" />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route path="/products" element={<Products />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 👉 default page */}
        <Route path="/" element={<Products />} />

        {/* you can also go explicitly to /products */}
        <Route path="/products" element={<Products />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

