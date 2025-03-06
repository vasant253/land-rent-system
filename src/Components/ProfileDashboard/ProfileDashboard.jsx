import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
        const token = localStorage.getItem("access_token");
      
        console.log("Token being sent:", token);  // Debugging log
      
        if (!token) {
          setError("You are not logged in.");
          return;
        }
      
        try {
          const response = await fetch("http://127.0.0.1:8000/api/user/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,  // Make sure the token is here
            },
          });
      
          console.log("Response status:", response.status); // Log HTTP status
      
          if (response.ok) {
            const data = await response.json();
            console.log("User Data:", data); // Debugging log
            setUserData(data);
          } else {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            setError("Unauthorized access. Please log in again.");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setError("Error fetching user data.");
        }
      
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "450px", backgroundColor: "#f8f9fa" }}>
        <h3 className="text-center mb-3 text-primary fw-bold">Profile Dashboard</h3>

        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : userData ? (
          <div className="text-center">
            {/* Profile Image */}
            {userData.profilePicture && (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #007bff" }}
              />
            )}

            {/* User Details */}
            <div className="mb-2"><strong>Full Name:</strong> {userData.fullName || "N/A"}</div>
            <div className="mb-2"><strong>Username:</strong> {userData.username}</div>
            <div className="mb-2"><strong>Email:</strong> {userData.email}</div>
            <div className="mb-2"><strong>Phone:</strong> {userData.phone || "N/A"}</div>
            <div className="mb-2"><strong>Role:</strong> {userData.role || "User"}</div>
            <div className="mb-2"><strong>Join Date:</strong> {userData.joinDate || "N/A"}</div>
            <div className="mb-2"><strong>Address:</strong> {userData.address || "N/A"}</div>
          </div>
        ) : (
          <p className="text-center">Loading user data...</p>
        )}

        <button className="btn btn-danger w-100 fw-semibold mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDashboard;
