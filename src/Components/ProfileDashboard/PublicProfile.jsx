import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // ✅ Get user ID from URL
import axios from "axios";
import { Container, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PublicProfile = () => {
  const { userId } = useParams(); // ✅ Get user ID from URL
  const [user, setUser] = useState(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, [userId]); // ✅ Fetch data when userId changes

  // ✅ Fetch User Data
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/`);
      setUser(response.data);
      fetchUserLands(userId);
    } catch (error) {
      setError("User not found or profile is private.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Lands Listed by User
  const fetchUserLands = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/landapi/lands/user/${id}/`);
      setLands(response.data);
    } catch (error) {
      console.error("Error fetching user lands:", error);
    }
  };

  if (loading) return <h2 className="text-center my-4">Loading...</h2>;
  if (error) return <h2 className="text-danger text-center my-4">{error}</h2>;

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">User Profile</h2>

      {/* ✅ User Profile Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <img
                src={`http://127.0.0.1:8000${user.profile_photo}` || "public\profile.jpg"} // ✅ Default profile image
                alt="Profile"
                className="rounded-circle img-fluid"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </Col>
            <Col md={8}>
              <Card.Title>{user.username}</Card.Title>
              <Card.Text><strong>Full Name:</strong> {user.full_name || "N/A"}</Card.Text>
              <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
              <Card.Text><strong>Phone:</strong> {user.phone || "N/A"}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ✅ User's Uploaded Lands */}
      <div className="container mt-4">
        <h3>{user.username}'s Land Listings</h3>
        <div className="row">
          {lands.length > 0 ? (
            lands.map((land) => (
              <div key={land.land_id} className="col-md-4">
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{land.name}</h5>
                    <p className="card-text">Area: {land.area} Sq.ft</p>
                    <p className="card-text">Location: {land.location}</p>
                    <p className="card-text">Land Type: {land.land_type}</p>
                    <p className="card-text">Price: {land.price}₹/month</p>
                    <Link to={`/land/${land.land_id}`}>
                        <button className="btn btn-info view-details-btn">View Details</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No lands listed by this user.</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PublicProfile;
