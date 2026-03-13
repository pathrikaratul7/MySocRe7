import React, { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";

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
      setError("Email and Password are required");
      return;
    }

    try {

      setLoading(true);

      const result = await login(email, password);

      if (result?.success) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } 
      else {
        setError("Invalid credentials");
      }

    } 
    catch (error) {
      console.error("Login Error:", error);
      setError("Server error. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.leftPanel}>
        <h1 style={styles.brand}>My Enterprise App</h1>
        <p style={styles.subtitle}>
          Secure access to your dashboard and services.
        </p>
      </div>

      <div style={styles.loginPanel}>

        <div style={styles.card}>

          <h2 style={styles.title}>Sign In</h2>

          {error && <div style={styles.error}>{error}</div>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <div style={styles.passwordBox}>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
            />

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

          </div>

          <button
            style={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div style={styles.footer}>
            © 2026 Enterprise Corp
          </div>

        </div>

      </div>

    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI"
  },

  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg,#4F46E5,#9333EA)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px"
  },

  brand: {
    fontSize: "40px",
    marginBottom: "10px"
  },

  subtitle: {
    fontSize: "18px",
    opacity: 0.9
  },

  loginPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb"
  },

  card: {
    width: "380px",
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },

  passwordBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "15px"
  },

  passwordInput: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none"
  },

  eye: {
    padding: "0 10px",
    cursor: "pointer"
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    background: "#4F46E5",
    color: "white",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  },

  error: {
    background: "#ffe5e5",
    color: "#d8000c",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px"
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "12px",
    color: "#888"
  }

};

export default Login;