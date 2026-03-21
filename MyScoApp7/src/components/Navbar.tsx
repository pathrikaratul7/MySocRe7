import { useUser } from "../utils/useUser";
import "../styles/navbar.css";

const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace("/"); 
};


const Navbar: React.FC = () => {
  const user = useUser();

  return (
    <div className="navbar">
      <h3 className="nav-title">Dashboard</h3>

      <div className="nav-right">
        <div className="user-info">
          <span className="avatar">👤</span>
          <div>
            <div className="username">{user?.uName || "User"}</div>
            <div className="email">{user?.uEmail}</div>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;