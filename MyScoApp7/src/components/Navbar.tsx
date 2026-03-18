import { useUser } from "../utils/useUser";


const logout = () => {
 localStorage.clear();
 sessionStorage.clear();
  window.location.href = "/";
};

const Navbar: React.FC = () => {

  const user  = useUser();
  return (
    <div style={styles.navbar}>

      <h3 style={styles.title}>Dashboard</h3>

      <div style={styles.userContainer}>
        <span style={styles.userIcon}>👤</span>
        <span style={styles.userText} color="purple">
          Logged In: {user?.uName || "User"}
        </span>
        <span style={styles.userText} color="purple">
         : ({user?.uEmail || " email not available"})
        </span>
      </div>
      <div>
        <button onClick={logout} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", alignItems:"right" }}>
          Logout
        </button>
      </div>

    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  navbar: {
    height: "70px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },

  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#374151"
  },

  userContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  userIcon: {
    fontSize: "18px"
  },

  userText: {
    fontWeight: 500,
    color: "purple"
  }

};

export default Navbar;