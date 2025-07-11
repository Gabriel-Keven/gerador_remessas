import './App.css';

//Components
import { Routes,BrowserRouter,Route } from 'react-router-dom';
import Home from './pages/Home/Home.js'
import Navbar from './components/Navbar';

//Pages
import Sobre from './pages/Sobre/Sobre';
import Footer from './components/Footer';
import Formulario from './pages/Formulario/Formulario.js';

function App() {
  const a = process.env.REACT_APP_FUNEC_CONTA;
  console.log(a);
  return (
    <div>
      <BrowserRouter>
          <Navbar/>
           <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/remessa' element={<Formulario/>} />
              <Route path='/sobre' element={<Sobre/>} />
           </Routes>
           <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
