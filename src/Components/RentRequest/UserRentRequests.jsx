import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import { getAccessToken } from "../../auth";
import { Link } from "react-router-dom";

const UserRentRequests = () => {
  const [rentRequests, setRentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentRequests();
  }, []);

  const fetchRentRequests = async () => {
    try {
      const token = await getAccessToken();
      const response = await axios.get("http://127.0.0.1:8000/landapi/user/rent-requests/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRentRequests(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rent requests:", error);
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this request?");
    if (!confirmCancel) return; // ✅ Prevent cancellation if user cancels
  
    try {
      const token = await getAccessToken();
      await axios.delete(`http://127.0.0.1:8000/landapi/rent-requests/${requestId}/cancel/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // ✅ Remove the canceled request from the UI
      setRentRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
  
      alert("Request canceled successfully.");
    } catch (error) {
      console.error("Error canceling rent request:", error);
      alert("Failed to cancel the request. Please try again.");
    }
  };
  

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">My Rent Requests</h2>
      {loading ? (
        <p className="text-center">Loading requests...</p>
      ) : rentRequests.length > 0 ? (
        <Row>
          {rentRequests.map((request) => (
            <Col key={request.id} md={4}>
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  {/* ✅ Owner Username */}
                  <Link to={`/profile/${request.owner.id}`}>
                  <h5 className="card-title text-primary">@{request.owner.username}</h5>
                  </Link>
                  
                  {/* ✅ Rent Status */}
                  <Badge 
                    bg={request.status === "Pending" ? "warning" : request.status === "Accepted" ? "success" : "danger"}
                    className="mb-2"
                  >
                    {request.status}
                  </Badge>

                  {/* ✅ Land Details */}
                  <p><strong>Location:</strong> {request.land.location}</p>
                  <p><strong>Area:</strong> {request.land.area} Sq.ft</p>
                  <p><strong>Land Type:</strong> {request.land.land_type}</p>
                  <p><strong>Price:</strong> ₹{request.land.price}/month</p>
                  <p><strong>Requested On:</strong> {new Date(request.request_date).toLocaleDateString()}</p>

                  {/* ✅ Conditional Message if Accepted */}
                  {request.status === "Accepted" && (
                    <>
                    <p className="text-success">Your request has been accepted! Contact the owner for further steps.</p>
                    <button className="btn btn-success" >
                        💳 Make Payment
                    </button>
                    </>
                  )}
                  {/* ✅ Show "Cancel Request" button for Pending requests */}
                  {request.status === "Pending" && (
                    <button className="btn btn-danger mt-2" onClick={() => handleCancelRequest(request.id)}>
                      ❌ Cancel Request
                    </button>
                  )}

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">You haven't requested any land rentals yet.</p>
      )}
    </Container>
  );
};

export default UserRentRequests;
