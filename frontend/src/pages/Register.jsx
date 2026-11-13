import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../auth.css";

const API_URL = "http://localhost:5000/api/auth";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can contain only letters and spaces";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Za-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~;]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name field: allow only letters and spaces
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });

    // Remove error while user corrects the field
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    // Validate before sending request
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }
      );

      if (response.data.success) {
        setSuccess(
          "Registration successful! Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }

    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Registration failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Meeting Management</h1>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Register to manage your meetings
        </p>

        {errors.submit && (
          <div className="auth-error">
            {errors.submit}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="auth-group">

            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

            {errors.name && (
              <p className="field-error">
                {errors.name}
              </p>
            )}

          </div>

          {/* EMAIL */}
          <div className="auth-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="field-error">
                {errors.email}
              </p>
            )}

          </div>

          {/* PASSWORD */}
          <div className="auth-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <p className="field-error">
                {errors.password}
              </p>
            )}

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="auth-group">

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <p className="field-error">
                {errors.confirmPassword}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;