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




import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Home from "./pages/Home";
import About from "./pages/About";
import Support from "./pages/Support";
import Claims from "./pages/Claims";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Products />} />
        <Route path="/report" element={<Products startWithForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/products" element={<Navigate to="/browse" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
