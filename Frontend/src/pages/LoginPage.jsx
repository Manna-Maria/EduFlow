import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
    setError("");
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginForm
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName: registerForm.fullName,
          email: registerForm.email,
          password: registerForm.password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* Left Side */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-icon">🎓</div>
            <h1>EduFlow</h1>
            <p>The Future of Learning</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-right">
          <div className="auth-form-container">

            <button onClick={handleLogout} style={{ marginBottom: "10px" }}>
              Logout (Test)
            </button>

            {error && <div className="error-message">{error}</div>}

            {isLogin ? (

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <h2>Welcome Back! 👋</h2>
                <p className="form-subtitle">
                  Sign in to continue your learning journey
                </p>

                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <a href="#forgot" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className="social-button google"
                  disabled={loading}
                >
                  <span>🔍</span> Continue with Google
                </button>

              </form>

            ) : (

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <h2>Create Account 🚀</h2>
                <p className="form-subtitle">
                  Join EduFlow and start learning today
                </p>

                <div className="form-group">
                  <label htmlFor="register-name">Full Name</label>
                  <input
                    id="register-name"
                    type="text"
                    name="fullName"
                    value={registerForm.fullName}
                    onChange={handleRegisterChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Email Address</label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="At least 6 characters"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm">
                    Confirm Password
                  </label>

                  <div className="password-input-wrapper">
                    <input
                      id="register-confirm"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <label className="terms-check">
                  <input type="checkbox" required />
                  I agree to the Terms & Conditions
                </label>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

              </form>

            )}

            <div className="auth-footer">
              {isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="switch-auth"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="switch-auth"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;