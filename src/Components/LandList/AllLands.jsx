import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandList.css";
import { getAccessToken } from "../../auth";
import LandCard from "./LandCard";

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

export default AllLands;
