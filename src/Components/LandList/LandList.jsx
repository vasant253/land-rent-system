import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import './LandList.css';
import { useState, useEffect } from 'react';


const LandList = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/landapi/lands-fetch/") // Change URL if different
      .then(response => response.json())
      .then(data => {
        setLands(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching lands:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="text-center my-4 list-header">Land Listings</h2>
      <div className="row">
        {lands.map(land => (
          <LandCard key={land.id} land={land} />
        ))}
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary show-more-btn">Show More Lands</button>
      </div>
    </div>
  );
};

const LandCard = ({ land }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card land-card">
        <img src={land.img} alt={land.name} className="card-img-top land-image" />
        <div className="card-body">
          <h3 className="card-title">{land.name}</h3>
          <p className="card-text">Location: {land.location}</p>
          <p className="card-text">Price: {land.price}</p>
          <p className="card-text">Area: {land.area}</p>
          <Link to={`/land/${land.id}`}>
          <button className="btn btn-info view-details-btn">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandList;
