import { useUser } from "../utils/useUser";
import "../styles/navbar.css";
import UserImage from "../pages/UserImage";
import "../styles/Image.css";

const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace("/"); 
};


const Navbar: React.FC = () => {
  const user = useUser();

  return (
    <div className="navbar">
      <h3 className="nav-title">Welcome To My Society React App7</h3>

      <div className="nav-right">
        <div className="user-info">
      
  <UserImage src={user?.imagePath || ""} />

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