import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    // Listen for local storage changes (Login or Logout)
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user"))); // Update user state
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "mr" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/login");
  };

  const handleUploadLand = () => {
    if (user) {
      navigate("/landUpload");
    } else {
      navigate("/register");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">LandRentSystem</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t("navbar.home")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">{t("navbar.about")}</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services">{t("navbar.services")}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">{t("navbar.contact")}</a>
            </li>
          </ul>

          <form className="d-flex me-3">
            <input className="form-control search-input" type="search" placeholder={t("navbar.searchPlaceholder")} />
            <button className="btn btn-primary search-btn" type="submit">🔍</button>
          </form>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="btn btn-outline-success me-2" onClick={handleUploadLand}>
                {t("navbar.uploadLand")}
              </button>
            </li>

            {user ? (
              <li className="nav-item dropdown">
                <button className="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                  <FaUserCircle size={20} /> {user.username}
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-outline-primary me-2">
                    {t("navbar.signIn")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-primary">
                    {t("navbar.logIn")}
                  </Link>
                </li>
              </>
            )}
          </ul>

          <button className="btn lang-btn ms-3" onClick={toggleLanguage}>
            🌍 {language === "en" ? "EN" : "MR"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
