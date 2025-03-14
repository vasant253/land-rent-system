import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LandCard from "./LandCard";

const SearchResults = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);  // ✅ Fetch results when the search query changes

    const fetchSearchResults = async () => {
        if (!searchQuery) return;
        setLoading(true);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/landapi/search/?q=${searchQuery}`);
            setLands(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Search Results for "{searchQuery}"</h2>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="row">
                    {lands.length > 0 ? (
                        lands.map((land) => <LandCard key={land.land_id} land={land} />)
                    ) : (
                        <p className="text-center">No lands found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
