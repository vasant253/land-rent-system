import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./LandList.css";
import { getAccessToken } from "../../auth";
import { LandCard } from "./LandCard";

export const LandList = () => {
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
            lands.slice(0, 3).map((land) => <LandCard key={land.land_id} land={land} />)  // ✅ Show only 3 recent lands
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

export default LandList;
