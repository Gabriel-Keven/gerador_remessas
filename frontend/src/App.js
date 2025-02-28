import './App.css';

//Components
import { Routes,BrowserRouter,Route } from 'react-router-dom';
import Home from './pages/Home/Home.js'
import Navbar from './components/Navbar';

//Pages
import Remessa from './pages/Remessa/Remessa'
import Sobre from './pages/Sobre/Sobre';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <BrowserRouter>
          <Navbar/>
           <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/remessa' element={<Remessa/>} />
              <Route path='/sobre' element={<Sobre/>} />
           </Routes>
           <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
