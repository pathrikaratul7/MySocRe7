import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div style={styles.container}>
 
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={styles.main}>

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <div style={styles.content}>
          <Outlet />
        </div>

      </div>

    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f5f7fb",
    fontFamily: "Segoe UI, sans-serif"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const
  },

  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto" as const
  }
};

export default Layout;