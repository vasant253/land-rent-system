import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About LandRentSystem</h1>
        <p>Your trusted platform for renting and leasing land and farms.</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At LandRentSystem, we aim to bridge the gap between landowners and renters, offering a reliable and
            efficient platform for renting and leasing land and farms. Our mission is to provide landowners with
            the opportunity to generate revenue, while renters find the land they need for agricultural and business purposes.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Simple and intuitive interface</li>
            <li>Comprehensive land and farm listings</li>
            <li>Secure and transparent agreements</li>
            <li>24/7 customer support</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>How We Help</h2>
          <p>
            Whether you're a landowner looking to earn extra income or a renter searching for the perfect plot of land,
            LandRentSystem provides a seamless experience for both parties. We offer tools for farm management,
            crop yield prediction, and a clear rental process that benefits everyone.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
