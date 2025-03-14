import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user"))); // Update user state
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
      localStorage.clear(); // Removes all stored data
      window.location.reload(); // Refresh the page to update UI
      setUser(null);
    };
  
  
  if (role === "admin") {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">Admin Panel</Link>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to={user ? "/dashboard" : "/"}>LandRentSystem</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to={user ? "/dashboard" : "/"}>Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/all-lands">Lands</Link></li>
            <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
          </ul>

          <form className="d-flex me-3">
            <input className="form-control search-input" type="search" placeholder="Search" />
            <button className="btn btn-primary search-btn" type="submit">🔍</button>
          </form>

          <ul className="navbar-nav">
            {token ? (
             <> 
             <li className="nav-item me-3">
              <Link to="/landUpload" className="btn btn-primary fw-bold px-4 py-2">                  
                    <i className="bi bi-cloud-upload"></i> Upload Land
                </Link>
                </li>
              <li className="nav-item dropdown">
                <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                  <FaUserCircle size={20} /> {user.username}
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
              </>
              
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-outline-primary me-2">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-primary">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
