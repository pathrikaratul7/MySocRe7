import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";


const Sidebar = () => {

  //const user = useUser();
  
  return (
    <div className="sidebar">
      <h2 className="logo">🏢 My Society</h2>
  
      <nav>
        <NavLink to="/dashboard" className="menu">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/users" className="menu">
          👥 Users
        </NavLink>

        <NavLink to="/Guestlist" className="menu">
        🧑 Guest 
        </NavLink>

        <NavLink to="/Flatlist" className="menu">
        🏘️ Flat
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;