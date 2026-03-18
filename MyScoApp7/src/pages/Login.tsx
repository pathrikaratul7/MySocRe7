import React, { useState } from "react";
import { login } from "../api/authApi";
// import { GetUserDetails } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/tokenStorage";
import "../styles/Login.css";
import loginImage from "../assets/SocietyLogin.png";
// import { StoreUserDetails } from "../utils/UserDetailsStore";


const Login: React.FC = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    setError("");

    if (!email || !password) {
      setError("📧🔒 Email and password are required");
      return;
    }

    try {

      setLoading(true);

      const result = await login(email, password);
     console.log("Login Result:", result.status);
     console.log("Login Result:", result);
      if (result?.status === "Success") {
        console.log("Login Result_1:", result.status);
          saveToken(result.token,email,password);

        //  const UserDetails = await GetUserDetails(result.token,email,password);
        //  console.log("User Details:", UserDetails);
        //  StoreUserDetails(UserDetails);

        navigate("/dashboard",{ replace: true });
      } 
      else {
        setError(result?.message || "❌ Invalid email or password");
      }

    } 
    catch (error) {
      console.error("Login Error:", error);
      setError("⚠️ Unable to connect to server. Try again later");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

  <div className="login-container">
    <img src={loginImage} alt="Society Login" style={{ width: "100%" , height: "auto" }} />
  
  </div>

  <div className="login-right">

    <div className="login-card">
  
   
      <h2 className="login-title">Sign In: My Society Enterprise App</h2>

      {error && <div className="login-error">{error}</div>}

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <div className="password-box">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />

        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>

      </div>

      <button
        className="login-button"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing in..." : "🔐 Login"}
      </button>

      <div className="login-footer">
         <p className="login-subtitle">
      Secure access to your dashboard and services.
    </p>
        {"@" + new Date().getFullYear() + " My Society Enterprise App. All rights reserved"}
      </div>

    </div>

  </div>

</div>
  );
};

// const styles: { [key: string]: React.CSSProperties } = {

//   container: {
//     display: "flex",
//     height: "100vh",
//     fontFamily: "Segoe UI"
//   },

//   leftPanel: {
//     flex: 1,
//     background: "linear-gradient(135deg,#4F46E5,#9333EA)",
//     color: "white",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     padding: "80px"
//   },

//   brand: {
//     fontSize: "40px",
//     marginBottom: "10px"
//   },

//   subtitle: {
//     fontSize: "18px",
//     opacity: 0.9
//   },

//   loginPanel: {
//     flex: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f5f7fb"
//   },

//   card: {
//     width: "380px",
//     background: "white",
//     padding: "40px",
//     borderRadius: "12px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
//   },

//   title: {
//     textAlign: "center",
//     marginBottom: "25px"
//   },

//   input: {
//     width: "100%",
//     padding: "12px",
//     marginBottom: "15px",
//     border: "1px solid #ccc",
//     borderRadius: "6px"
//   },

//   passwordBox: {
//     display: "flex",
//     alignItems: "center",
//     border: "1px solid #ccc",
//     borderRadius: "6px",
//     marginBottom: "15px"
//   },

//   passwordInput: {
//     flex: 1,
//     padding: "12px",
//     border: "none",
//     outline: "none"
//   },

//   eye: {
//     padding: "0 10px",
//     cursor: "pointer"
//   },

//   button: {
//     width: "100%",
//     padding: "12px",
//     border: "none",
//     background: "#4F46E5",
//     color: "white",
//     borderRadius: "6px",
//     fontSize: "16px",
//     cursor: "pointer"
//   },

//   error: {
//     background: "#ffe5e5",
//     color: "#d8000c",
//     padding: "10px",
//     marginBottom: "15px",
//     borderRadius: "5px"
//   },

//   footer: {
//     textAlign: "center",
//     marginTop: "20px",
//     fontSize: "12px",
//     color: "#888"
//   }

// };

export default Login;