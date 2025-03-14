import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ✅ Get category from URL
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandList.css"; // ✅ Use same CSS as AllLands
import LandCard from "./LandCard";

const FilteredLands = () => {
  const { category } = useParams(); // ✅ Get category from URL
  const [lands, setLands] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLands();
  }, [category]);

  // ✅ Fetch lands based on category
  const fetchLands = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/landapi/lands-fetch/");
      const filtered = response.data.filter((land) => land.land_type === category);
      setLands(filtered);
    } catch (error) {
      setError("Failed to load lands. Please try again later.");
    }
  };

  if (error) return <div className="text-center text-danger my-4">{error}</div>;

  return (
    <div className="container">
      <h2 className="text-center my-4 list-header">{category} Lands</h2>
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

export default FilteredLands;
