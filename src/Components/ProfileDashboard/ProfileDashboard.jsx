import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";
import { getAccessToken } from "../../auth";

const ProfileDashboard = () => {
    
    const [user, setUser] = useState(null);
    const [lands, setLands] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLand, setSelectedLand] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        state: "",
        district: "",
        price: "",
        area: "",
        land_type: "Agricultural",
        land_status: "Available",  // Default value
        soil_quality: "",
        utilities_available: "",
        land_access: "",
        available_from: "",
        available_to: "",
        description: "",
    });
    

    useEffect(() => {
        fetchUserData();
        fetchLands();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await getAccessToken(); // Get JWT Token
            if (!token) {
                console.error("No token found, user not authenticated.");
                return;
            }

            const response = await axios.get("http://127.0.0.1:8000/api/user/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchLands = async () => {
      try {
        const token = await getAccessToken();
          const response = await axios.get("http://127.0.0.1:8000/landapi/user/lands", {
              headers: { Authorization: `Bearer ${token}` }
          });
          setLands(response.data);
      } catch (error) {
          console.error("Error fetching lands", error);
      }
  };

  const handleEdit = (land) => {
      setSelectedLand(land);
      setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
      try {
        console.log(formData);
        const token = await getAccessToken();
          await axios.put(`http://127.0.0.1:8000/landapi/lands/${selectedLand.land_id}/edit`, formData, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchLands();
          setShowEditModal(false);
      } catch (error) {
          console.error("Error updating land", error);
      }
  };

  const handleDelete = async (landId) => {
    if (window.confirm("Are you sure you want to delete this land?")) {
        try {
          const token = await getAccessToken();
            await axios.delete(`http://127.0.0.1:8000/landapi/lands/${landId}/delete`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLands();
        } catch (error) {
            console.error("Error deleting land", error);
        }
    }
};

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Profile Dashboard</h2>

            {/* User Details Section */}
            {user ? (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Row>
                            <Col md={4} className="text-center">
                                <img
                                    src={user.profile_photo}
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
            ) : (
                <p className="text-muted">Loading user data...</p>
            )}
                    <div className="container mt-4">
            <h3>My Lands</h3>
            <div className="row">
                {lands.map((land) => (
                    <div key={land.id} className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{land.name}</h5>
                                <p className="card-text">Location: {land.location}</p>
                                <p className="card-text">Available From : {land.available_from}</p>
                                <p className="card-text">Available To : {land.available_to}</p>
                                <p className="card-text">Land Type : {land.land_type}</p>
                                <p className="card-text">Price: {land.price}₹</p>
                                <Button variant="primary" onClick={() => handleEdit(land)}>Edit</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleDelete(land.land_id)}>Delete</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Edit Land</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.state} 
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.district} 
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Area (sq ft)</Form.Label>
                <Form.Control 
                    type="number" 
                    value={formData.area} 
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Land Type</Form.Label>
                <Form.Select   
                    value={formData.land_type} 
                    onChange={(e) => setFormData({ ...formData, land_type: e.target.value })} 
                    >
                    <option value="Agricultural">Agricultural</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Land Status</Form.Label>
                <Form.Select 
                    value={formData.land_status} 
                    onChange={(e) => setFormData({ ...formData, land_status: e.target.value })}
                >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="Sold">Sold</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Soil Quality</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.soil_quality} 
                    onChange={(e) => setFormData({ ...formData, soil_quality: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Utilities Available</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.utilities_available} 
                    onChange={(e) => setFormData({ ...formData, utilities_available: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Land Access</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formData.land_access} 
                    onChange={(e) => setFormData({ ...formData, land_access: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Available From</Form.Label>
                <Form.Control 
                    type="date" 
                    value={formData.available_from} 
                    onChange={(e) => setFormData({ ...formData, available_from: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Available To</Form.Label>
                <Form.Control 
                    type="date" 
                    value={formData.available_to} 
                    onChange={(e) => setFormData({ ...formData, available_to: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
        <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
    </Modal.Footer>
</Modal>

        </div>
        </Container>
        
    );
};

export default ProfileDashboard;
