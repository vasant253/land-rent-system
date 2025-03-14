import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState(""); // For handling errors
  const navigate = useNavigate(); // Redirect after login

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); // Clear error message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending credentials:", credentials);
      const response = await axios.post("http://127.0.0.1:8000/api/login/", credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log(response.data);
        alert("Login Successful! ✅");
        
        const { access, refresh, role } = response.data;
        
        // Store tokens in localStorage
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("role", role); // Save role in localStorage
        localStorage.setItem("user", JSON.stringify(response.data));

        // Fetch user details
    const userResponse = await axios.get("http://127.0.0.1:8000/api/user/", {
      headers: { Authorization: `Bearer ${access}` }, // Send token
    });

    if (userResponse.status === 200) {
      localStorage.setItem("user", JSON.stringify(userResponse.data)); // Store user info
    }

              if (response.data.role === "admin") {
                console.log("admin redirect");
                  window.location.href = "/admin";
              } else {
                console.log("user redirect");
                  window.location.href = "/dashboard";
              }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px", backgroundColor: "#f8f9fa" }}>
        <h3 className="text-center mb-3 text-primary fw-bold">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="identifier"
              className="form-control"
              value={credentials.identifier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary fw-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
