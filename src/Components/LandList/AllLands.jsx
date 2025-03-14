import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandList.css";
import { getAccessToken } from "../../auth";

const AllLands = () => {
  const [lands, setLands] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllLands();
  }, []);

  const fetchAllLands = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.get("http://127.0.0.1:8000/landapi/lands-fetch/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLands(response.data);
    } catch (error) {
      setError("Failed to load lands. Please try again later.");
    }
  };

  if (error) return <div className="text-center text-danger my-4">{error}</div>;

  return (
    <div className="container">
      <h2 className="text-center my-4 list-header">All Lands</h2>
      <div className="row">
        {lands.length > 0 ? (
          lands.map((land) => <LandCard key={land.land_id} land={land} />)
        ) : (
          <p className="text-center">No lands available</p>
        )}
      </div>
    </div>
  );
};

const LandCard = ({ land }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card land-card">
        <img
          src={land.images.length > 0 ? `http://127.0.0.1:8000${land.images[0].image}` : "/default-land.jpg"}
          alt={land.name}
          className="card-img-top land-image"
        />
        <div className="card-body">
          <h3 className="card-title">{land.land_type || "Untitled Land"}</h3>
          <p className="card-text">Location: {land.location}</p>
          <p className="card-text">Price: ₹{land.price}</p>
          <p className="card-text">Area: {land.area} sq. ft</p>
          <Link to={`/land/${land.land_id}`}>
            <button className="btn btn-info view-details-btn">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllLands;
