import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./LandList.css";
import { getAccessToken } from "../../auth";

const LandList = () => {
  const [lands, setLands] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLandsWithToken();
  }, []);

  const fetchLandsWithToken = async () => {
    try {
      const token=await getAccessToken();
      const response = await axios.get("http://127.0.0.1:8000/landapi/lands-fetch/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setLands(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) throw error;
      setError(error);
    }
  };


  if (error) return <div className="text-center text-danger my-4">{error}</div>;

  return (
    <div className="container">
      <h2 className="text-center my-4 list-header">Land Listings</h2>
      <div className="row">
        {lands.length > 0 ? (
          lands.map((land) => <LandCard key={land.land_id} land={land} />)
        ) : (
          <p className="text-center">No lands available</p>
        )}
      </div>
      <div className="text-center mt-4">
        <Link to="/all-lands">
        <button className="btn btn-primary show-more-btn">Show More Lands</button>
        </Link>
      </div>
    </div>
  );
};

const LandCard = ({ land }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card land-card">
        <img
          src={`http://127.0.0.1:8000${land.images[0].image}`}
          alt={land.name}
          className="card-img-top land-image"
        />
        <div className="card-body">
          <h3 className="card-title">{land.name}</h3>
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

export default LandList;
