import { useState } from "react";

interface User {
  uName?: string;
}

const Navbar: React.FC = () => {

  const [user] = useState<User>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  return (
    <div style={styles.navbar}>

      <h3 style={styles.title}>Dashboard</h3>

      <div style={styles.userContainer}>
        <span style={styles.userIcon}>👤</span>
        <span style={styles.userText}>
          Logged In: {user.uName || "User"}
        </span>
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
    color: "#374151"
  }

};

export default Navbar;