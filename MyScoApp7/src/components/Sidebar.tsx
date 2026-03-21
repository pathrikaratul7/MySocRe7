import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>

      <h2 style={styles.logo}>My Society App 7</h2>

      <nav>
        <Link style={styles.menu} to="/dashboard">🏠 Dashboard</Link>
        <Link style={styles.menu} to="/users">👥 Users</Link>
        {/* <Link style={styles.menu} to="/reports">📊 Reports</Link>
        <Link style={styles.menu} to="/settings">⚙ Settings</Link> */}
      </nav>

    </div>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    background: "#1e293b",
    color: "white",
    padding: "25px",
    display: "flex",
    flexDirection: "column" as const
  },

  logo: {
    marginBottom: "40px"
  },

  menu: {
    display: "block",
    padding: "12px 15px",
    marginBottom: "10px",
    color: "#e2e8f0",
    textDecoration: "none",
    borderRadius: "6px"
  }
};

export default Sidebar;