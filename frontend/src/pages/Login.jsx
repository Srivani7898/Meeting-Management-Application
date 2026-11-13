import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../auth.css";

const API_URL = "http://localhost:5000/api/auth";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  // =========================================================
  // CHECK IF USER IS ALREADY LOGGED IN
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/meetings", { replace: true });
    }
  }, [navigate]);


  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: ""
    }));
  };


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: formData.email.trim(),
          password: formData.password
        }
      );

      if (response.data.success) {

        // Store JWT token
        localStorage.setItem(
          "token",
          response.data.token
        );

        // Store logged-in user information
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        // Redirect to dashboard
        navigate("/meetings", {
          replace: true
        });
      }

    } catch (error) {

      setErrors({
        submit:
          error.response?.data?.message ||
          "Login failed. Please try again."
      });

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Meeting Management</h1>

        <h2>Login</h2>

        <p className="auth-subtitle">
          Login to manage your meetings
        </p>


        {/* =================================================
            SERVER ERROR
        ================================================= */}

        {errors.submit && (
          <div className="auth-error">
            {errors.submit}
          </div>
        )}


        <form onSubmit={handleSubmit}>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="auth-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {errors.email && (
              <p className="field-error">
                {errors.email}
              </p>
            )}

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="auth-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            {errors.password && (
              <p className="field-error">
                {errors.password}
              </p>
            )}

          </div>


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =================================================
            REGISTER LINK
        ================================================= */}

        <p className="auth-switch">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;