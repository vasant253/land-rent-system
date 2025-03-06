import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LandDetails.css";

const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLandDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/landapi/lands/${id}/`);
        if (!response.ok) {
          throw new Error("Land not found");
        }
        const data = await response.json();
        setLand(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLandDetails();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="land-details">
      {/* TOP SECTION */}
      <div className="top-section">
        <div>
          <p className="price">₹{land.price}</p>
          <p className="land-type">{land.name}</p>
          <p className="location">{land.location}</p>
          <p className={`status ${land.available ? "available" : "unavailable"}`}>
            {land.available ? "Available" : "Not Available"}
          </p>
        </div>
        <button className="rent-btn">Rent</button>
      </div>

      {/* SECOND SECTION - IMAGE & ATTRIBUTES */}
      <div className="details-section">
        <img src={`http://127.0.0.1:8000${land.image}`} alt={land.name} className="land-details-image" />
        <div className="attributes">
          <p><strong>Area:</strong> {land.area}</p>
          <p><strong>Utilities:</strong> {land.utilities || "N/A"}</p>
          <p><strong>Ownership:</strong> {land.ownership}</p>
          <p><strong>Land Access:</strong> {land.landAccess || "N/A"}</p>
          <p><strong>Soil Quality:</strong> {land.soilQuality || "N/A"}</p>
        </div>
      </div>

      {/* THIRD SECTION - PROPERTY DETAILS */}
      <div className="property-section">
        <h3>Property Details</h3>
        <p><strong>Description:</strong> {land.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default LandDetails;
