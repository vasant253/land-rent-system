import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

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
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      checkPasswordStrength(value);
    }

    if (["username", "email", "phone"].includes(name)) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/check-availability/?${name}=${value}`);
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // ✅ Clear error if available
        } catch (error) {
            if (error.response?.data[name]) {
                setErrors((prevErrors) => ({ ...prevErrors, [name]: error.response.data[name] })); // ✅ Show error if taken
            }
        }
    }
};


  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("Weak (At least 8 characters required)");
    } else if (!/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      setPasswordStrength("Medium (Use letters & numbers)");
    } else {
      setPasswordStrength("Strong ✅");
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
        const response = await axios.post(
            "http://127.0.0.1:8000/api/register/",
            formDataToSend, 
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
            setMessage("Registration Successful! ✅");
            setFormData({ username: "", full_name: "", email: "", phone: "", password: "", profile_photo: null });
        } else {
            setError(response.data.message || "Registration failed.");
        }
    } catch (error) {
        setError(error.response?.data?.message || "Something went wrong! Please try again.");
    }
};


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "450px", backgroundColor: "#f8f9fa" }}>
        <h3 className="text-center mb-3 text-primary fw-bold">Create an Account</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Username */}
          <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
              {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
          </div>
          {/* Email */}
          <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          {/* Phone */}
          <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
            <div className={`text-${passwordStrength.includes("Weak") ? "danger" : passwordStrength.includes("Medium") ? "warning" : "success"}`}>
              {passwordStrength}
            </div>
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
