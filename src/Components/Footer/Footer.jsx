import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const role=localStorage.getItem("role");

  if (role === "admin") {
    return (
      <footer className="bg-dark text-light mt-4 text-center py-3 fixed-bottom">
        <p className="mb-0">&copy; 2024 Admin Panel | LandRentSystem</p>
      </footer>
    );
  }

  return (
    <footer className="bg-dark mt-4 text-light py-4 footer">
      <div className="container">
        <div className="row">

          {/* ✅ About Section */}
          <div className="col-md-3">
            <h5>LandRentSystem</h5>
            <p>Find and rent land easily with our trusted platform.</p>
          </div>

          {/* ✅ Quick Links */}
          <div className="col-md-3">

            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to={user ? "/dashboard" : "/"} className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/all-lands" className="text-light text-decoration-none">Browse Lands</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* ✅ Contact Section */}
          <div className="col-md-3">
            <h5>Contact Us</h5>
            <p><FaMapMarkerAlt /> Mangaon Kudal, India</p>
            <p><FaPhone /> +91 8766541388</p>
            <p><FaEnvelope /> vasantgawade253@gmail.com</p>
          </div>

          {/* ✅ Social Media Links */}
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <div className="d-flex">
              <a href="https://facebook.com" className="text-light me-3"><FaFacebook size={22} /></a>
              <a href="https://twitter.com" className="text-light me-3"><FaTwitter size={22} /></a>
              <a href="https://instagram.com" className="text-light"><FaInstagram size={22} /></a>
            </div>
          </div>
          
        </div>

        {/* ✅ Copyright Section */}
        <div className="text-center mt-3 border-top pt-3">
          <p className="mb-0">&copy; 2024 LandRentSystem. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
