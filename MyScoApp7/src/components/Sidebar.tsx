import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
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
      </nav>
    </div>
  );
};

export default Sidebar;