import React, { useState, useEffect } from "react";
import { getAccessToken } from "../../auth";
import { useParams,useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import "./LandDetails.css";
import { Link } from "react-router-dom";

const LandDetails = () => {
  const navigate= useNavigate();
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rentStatus, setRentStatus] = useState(null);

  useEffect(() => {
    const fetchLandDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/landapi/lands/${id}/`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Land not found");
        }

        const data = await response.json();
        setLand(data);
        setRentStatus(data.land_status || "Available");
        console.log(data.land_status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLandDetails();
  }, [id]);

  const handleRentRequest = async () => {
    const token = await getAccessToken();
  
    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/landapi/lands/${id}/rent/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setRentStatus("Pending");
      } else if (response.status === 400 && data.status === "Pending") {
        setRentStatus("Pending");
        alert(data.message); // "You already have a rent request"
      } else {
        alert(data.error || "Failed to send rent request");
      }
    } catch (error) {
      alert("An error occurred while sending the rent request.");
    }
  };
  

  if (loading) return <h2 className="text-center my-4">Loading...</h2>;
  if (error) return <h2 className="text-danger text-center my-4">{error}</h2>;

  return (
    <Container className="land-details mt-4">
      <Row className="align-items-center">
        <Col md={8}>
          <h2 className="fw-bold">{land.land_type} - {land.location}</h2>
          <p className="text-muted mb-1"><strong>State:</strong> {land.state}, <strong>District:</strong> {land.district}</p>
          <h4 className="text-primary">Price: ₹{land.price}</h4>
          <p className={`status ${land.land_status === "Available" ? "text-success fw-bold" : "text-danger fw-bold"}`}>
            {land.land_status}
          </p>
          <p className="text-muted"><strong>Available:</strong> {land.available_from} to {land.available_to}</p>
        </Col>
        <Col md={4} className="text-md-end text-center">
          <Button
            variant={rentStatus === "Pending" ? "warning" : rentStatus === "Accepted" ? "secondary" : "success"}
            className="rent-btn px-4 py-2"
            disabled={rentStatus !== "Available"}
            onClick={handleRentRequest}
          >
            {rentStatus === "Pending" ? "Pending Approval" : rentStatus === "Accepted" ? "Rented" : "Rent Now"}
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Carousel className="shadow rounded">
            {land.images.map((img, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100 rounded" src={`http://127.0.0.1:8000${img.image}`} alt={`Land ${index}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="p-3 shadow-sm">
            <h3 className="mb-3">Property Details</h3>
            <p><strong>Area:</strong> {land.area} sq. ft</p>
            <p><strong>Utilities:</strong> {land.utilities_available || "N/A"}</p>
            <p><strong>Soil Quality:</strong> {land.soil_quality || "N/A"}</p>
            <p><strong>Land Access:</strong> {land.land_access || "N/A"}</p>
            <p><strong>Description:</strong> {land.description || "No description available."}</p>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="p-3 shadow-sm">
            <h3 className="mb-3">Owner Details</h3>
            <Row className="align-items-center">
              <Col xs={3} className="text-center">
              <Link to={`/profile/${land.owner.id}`} className="text-primary fw-bold">
                <img
                  src={`http://127.0.0.1:8000${land.owner.profile_photo}`}
                  alt="Owner"
                  className="profile-image"
                />
              </Link>
              </Col>
              <Col xs={9}>
                <p><strong>Name:</strong> {land.owner.full_name}</p>
                <p><strong>Contact:</strong> +91 {land.owner.phone}</p>
                <p><strong>Email:</strong> {land.owner.email}</p>
                <p><strong>Listed on:</strong> {new Date(land.created_at).toDateString()}</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="p-3 shadow-sm">
            <h3 className="mb-3">User Reviews</h3>
            <ListGroup>
              <ListGroup.Item>
                <strong>John Doe:</strong> "Great land, well maintained! 🌿" ⭐⭐⭐⭐⭐
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Sarah Smith:</strong> "Good location but price is a bit high." ⭐⭐⭐⭐
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Amit Kumar:</strong> "Perfect for farming, highly recommended!" ⭐⭐⭐⭐⭐
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LandDetails;
