import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
    profile_photo: null, // File upload
  });

  // State for validation errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "profile_photo") {
      setFormData({ ...formData, profile_photo: e.target.files[0] });
      return;
    }

    setFormData({ ...formData, [name]: value });

    // **Real-time validation for username, email, and phone**
    if (name === "username" || name === "email" || name === "phone") {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/check-user/?${name}=${value}`);
        const data = await response.json();

        if (!response.ok) {
          if (name === "username") setUsernameError(data.error || "Username already taken!");
          if (name === "email") setEmailError(data.error || "Email already registered!");
          if (name === "phone") setPhoneError(data.error || "Phone number already in use!");
        } else {
          if (name === "username") setUsernameError("");
          if (name === "email") setEmailError("");
          if (name === "phone") setPhoneError("");
        }
      } catch (err) {
        console.error("Validation error:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration Successful! ✅");
        setFormData({ username: "", full_name: "", email: "", phone: "", password: "", profile_photo: null });
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      setError("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "450px", backgroundColor: "#f8f9fa" }}>
        <h3 className="text-center mb-3 text-primary fw-bold">Create an Account</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            {usernameError && <div className="text-danger">{usernameError}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            {emailError && <div className="text-danger">{emailError}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            {phoneError && <div className="text-danger">{phoneError}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Profile Photo</label>
            <input type="file" name="profile_photo" className="form-control" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
