import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';

function App(){
  return(
    <BrowserRouter>
    <Navbar/>
    <Routes>

      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
