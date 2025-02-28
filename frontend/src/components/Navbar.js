import Styles from './Navbar.module.css';
//Router
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className={Styles.menu}>
        <NavLink to="/"><h1>Gerador de remessa para o Banco do Brasil.</h1></NavLink>
        <ul className={Styles.links_list}>
          <li>
            <NavLink 
                to="/" 
                className={({ isActive })=>(isActive ? Styles.active :"")}>
                Home
              </NavLink>
          </li>
          <li>
            <NavLink 
                to="/remessa" 
                className={({ isActive })=>(isActive ? Styles.active :"")}>
                Remessa
              </NavLink>
          </li>
          <li>
            <NavLink 
                to="/sobre" 
                className={({ isActive })=>(isActive ? Styles.active :"")}>
                Sobre
              </NavLink>
          </li>
        </ul>
    </nav>
  )
}

export default Navbar