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
    profile_photo: null , // File upload
  });

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Handle input changes
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "profile_photo") {
      setFormData({ ...formData, profile_photo: e.target.files[0] });
      return;
    }

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

  // ✅ Send OTP
  const sendOtp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/send-otp/", { email: formData.email });
      setOtpSent(true);
      setError(null);
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send OTP");
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify-otp/", { email: formData.email, otp });
      setOtpVerified(true);
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP");
    }finally {
      setIsSendingOtp(false);  // ✅ Stop loading
  }
  };

  // ✅ Check Password Strength
  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("Weak (At least 8 characters required)");
    } else if (!/\d/.test(password) || !/[A-Za-z]/.test(password)) {
      setPasswordStrength("Medium (Use letters & numbers)");
    } else {
      setPasswordStrength("Strong ✅");
    }
  };

  // ✅ Submit Registration Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!otpVerified) {
      setError("Please verify your OTP before registering.");
      return; // ❌ Block form submission
    }

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
          {/* ✅ Username */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>

          {/* ✅ Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
          </div>

          {/* ✅ Profile Photo */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Profile Photo</label>
            <input type="file" name="profile_photo" className="form-control" onChange={handleChange} />
          </div>

          {/* ✅ Phone */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>

          {/* ✅ Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          {/* ✅ Send OTP Button */}
          {!otpSent && (
    <button 
        type="button" 
        className="btn btn-primary w-100" 
        onClick={sendOtp} 
        disabled={isSendingOtp} // ✅ Disable button when loading
    >
        {isSendingOtp ? (
            <>
                <span className="spinner-border spinner-border-sm me-2"></span> 
                Sending...
            </>
        ) : "Send OTP"}
    </button>
)}
          {/* ✅ OTP Input */}
          {otpSent && !otpVerified && (
            <>
              <div className="mb-3">
                <label className="form-label">Enter OTP</label>
                <input type="text" name="otp" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <button type="button" className="btn btn-success w-100" onClick={verifyOtp}>Verify OTP</button>
            </>
          )}

          {/* ✅ Password Input (Only Show If OTP Verified) */}
          {otpVerified && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                <div className={`text-${passwordStrength.includes("Weak") ? "danger" : passwordStrength.includes("Medium") ? "warning" : "success"}`}>
                  {passwordStrength}
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-semibold">Register</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
