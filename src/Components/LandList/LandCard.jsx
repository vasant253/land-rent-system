import React from "react";
import { Link } from "react-router-dom";

export const LandCard = ({ land }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card land-card">
        <img
          src={`http://127.0.0.1:8000${land.images[0].image}`}
          alt={land.name}
          className="card-img-top land-image"
        />
        <div className="card-body">
          <h3 className="card-title">{land.land_type}</h3>
          <p className="card-text">Status: {land.land_status}</p>
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

export default LandCard;