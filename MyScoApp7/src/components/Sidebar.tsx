import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onNavigate?: () => void;
}

const Sidebar = ({ isOpen = false, onNavigate }: SidebarProps) => {
  return (
    <aside className={`sidebar${isOpen ? " open" : ""}`}>
      <h2 className="logo">🏢 My Society</h2>
      <nav>
        <NavLink to="/dashboard" className="menu" onClick={onNavigate}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/users" className="menu" onClick={onNavigate}>
          👥 Users
        </NavLink>
        <NavLink to="/Guestlist" className="menu" onClick={onNavigate}>
          🧑 Guest
        </NavLink>
        <NavLink to="/Flatlist" className="menu" onClick={onNavigate}>
          🏘️ Flat
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;