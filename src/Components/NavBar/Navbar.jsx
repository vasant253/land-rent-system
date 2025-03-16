import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate(); // ✅ Use for navigation

  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search state
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // ✅ Handle user state update from localStorage
    const handleStorageChange = () => {
        setUser(JSON.parse(localStorage.getItem("user"))); 
    };
    
    window.addEventListener("storage", handleStorageChange);

    // ✅ Fetch suggestions when searchQuery changes
    if (searchQuery.trim().length > 1) {
        fetchSuggestions();
    } else {
        setSuggestions([]);
    }

    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
}, [searchQuery]); // ✅ Now also listens to searchQuery changes

const fetchSuggestions = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/landapi/suggest/?q=${searchQuery}`);
    setSuggestions(response.data);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
};

const handleSuggestionClick = (suggestion) => {
  setSearchQuery(suggestion); // ✅ Fill input with clicked suggestion
  setSuggestions([]); // ✅ Hide suggestions
  navigate(`/search?q=${suggestion}`);
};

  const handleLogout = () => {
      localStorage.clear(); // Removes all stored data
      navigate("/login");
      window.location.reload(); // Refresh the page to update UI
      setUser(null);
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${searchQuery}`); // ✅ Redirect to search results page
      }
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
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>


          <div className="search-container position-relative">
            <form className="d-flex me-3" onSubmit={handleSearchSubmit}>
              <input
                className="form-control search-input"
                type="search"
                placeholder="Search lands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary search-btn" type="submit">🔍</button>
            </form>

            {/* ✅ Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, top: "100%" }}>
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{ cursor: "pointer" }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ul className="navbar-nav">
            {token ? (
             <> 
             <li className="nav-item me-3">
            <Link
              to={user?.is_verified ? "/landUpload" : "#"}
              className="btn btn-primary fw-bold px-4 py-2"
              onClick={(e) => {
                if (!user?.is_verified) {
                  e.preventDefault(); // Prevent navigation
                  alert("Your account is not verified yet! Please wait until admin verify your account!.");
                }
              }}
            >
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
