import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";
import { getAccessToken } from "../../auth";
import { Link } from "react-router-dom";

const ProfileDashboard = () => {
    
    //user data
    const [user, setUser] = useState(null);

    //land data
    const [lands, setLands] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLand, setSelectedLand] = useState(null);
    const [formData, setFormData] = useState({
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

    //profile data
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        profile_photo: null
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
          const response = await axios.get("http://127.0.0.1:8000/landapi/user/lands/", {
              headers: { Authorization: `Bearer ${token}` }
          });
          setLands(response.data);
      } catch (error) {
          console.error("Error fetching lands", error);
      }
  };

  const handleEdit = (land) => {
    setSelectedLand(land);
    setFormData({ 
        location: land.location || "", 
        state: land.state || "",
        district: land.district || "",
        price: land.price || "",
        area: land.area || "",
        land_type: land.land_type || "Agricultural",
        land_status: land.land_status || "Available",
        soil_quality: land.soil_quality || "",
        utilities_available: land.utilities_available || "",
        land_access: land.land_access || "",
        available_from: land.available_from || "",
        available_to: land.available_to || "",
        description: land.description || ""
    });
    setShowEditModal(true);
};

const handleEditSubmit = async () => {
    try {
        const token = await getAccessToken();
        
        // ✅ Ensure comparison works even if selectedLand has missing fields
        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
            if ((formData[key] || "") !== (selectedLand[key] || "")) { 
                updatedFields[key] = formData[key]; 
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert("No changes detected.");
            return;
        }

        await axios.put(
            `http://127.0.0.1:8000/landapi/lands/${selectedLand.land_id}/edit/`, 
            updatedFields, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Update response:", updatedFields);
        fetchLands();  // Refresh land list
        setShowEditModal(false);
    } catch (error) {
        console.error("Error updating land:", error.response?.data || error);
        alert("Failed to update land: " + JSON.stringify(error.response?.data || error));
    }
};

  const handleDelete = async (landId) => {
    if (window.confirm("Are you sure you want to delete this land?")) {
        try {
          const token = await getAccessToken();
            await axios.delete(`http://127.0.0.1:8000/landapi/lands/${landId}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLands();
        } catch (error) {
            console.error("Error deleting land", error);
        }
    }
};

const handleEditProfile = () => {
    setProfileData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        profile_photo: null  // Keep photo optional
    });
    setShowProfileEditModal(true);
};

const handleProfileUpdate = async () => {
    try {
        const token = await getAccessToken();
        const formData = new FormData();

        // ✅ Send only fields that have changed
        if (profileData.full_name !== user.full_name) {
            formData.append("full_name", profileData.full_name);
        }
        if (profileData.email !== user.email) {
            formData.append("email", profileData.email);
        }
        if (profileData.phone !== user.phone) {
            formData.append("phone", profileData.phone);
        }
        if (profileData.profile_photo) {
            formData.append("profile_photo", profileData.profile_photo);
        }

        // ✅ Check if any field is actually changed
        if (!formData.has("full_name") && !formData.has("email") && !formData.has("phone") && !formData.has("profile_photo")) {
            alert("No changes detected.");
            return;
        }

        await axios.put(
            "http://127.0.0.1:8000/api/user/update/", 
            formData, 
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );

        alert("Profile updated successfully!");
        setShowProfileEditModal(false);
        fetchUserData(); // Refresh user details
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error);
        alert("Failed to update profile.");
    }
};

const [selectedLandRequests, setSelectedLandRequests] = useState([]);  // ✅ Store requests for selected land
const [showRequestsModal, setShowRequestsModal] = useState(false);
const [selectedLandName, setSelectedLandName] = useState("");

const fetchLandRequests = async (landId) => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(`http://127.0.0.1:8000/landapi/get-land-requests/${landId}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setSelectedLandRequests(response.data); // ✅ Store requests in state
        setSelectedLandName(lands.find((land) => land.land_id === landId)?.name || "Selected Land");
        setShowRequestsModal(true); // ✅ Open modal
    } catch (error) {
        console.error("Error fetching rent requests:", error);
    }
};

const handleRentRequestAction = async (id)=>{
    return id;
}




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
                                <Button variant="primary" onClick={() => handleEditProfile()}>Edit</Button>
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
                                <h4 className={`card-text text-${land.status === "Pending" ? "warning" : land.status === "Approved" ? "success" : "danger"}`}>{land.status}</h4>
                                <p className="card-text">Area: {land.area} Sq.ft</p>
                                <p className="card-text">Location: {land.location}</p>
                                <p className="card-text">Available From : {land.available_from}</p>
                                <p className="card-text">Available To : {land.available_to}</p>
                                <p className="card-text">Land Type : {land.land_type}</p>
                                <p className="card-text">Price: {land.price}₹/month</p>
                                <Button variant="primary" onClick={() => handleEdit(land)}>Edit</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleDelete(land.land_id)}>Delete</Button>
                                <Button variant="info" className="ms-2"onClick={() => fetchLandRequests(land.land_id)}>Requests</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                {/* request Modal */}
                <Modal show={showRequestsModal} onHide={() => setShowRequestsModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Rent Requests</Modal.Title>
    </Modal.Header>

    {/* ✅ Fixed Size & Scrollable Modal Body */}
    <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        {selectedLandRequests.length > 0 ? (
            <div className="list-group">

                {/* ✅ Table-Like Header (Aligned) */}
                <div className="list-group-item bg-light fw-bold d-flex align-items-center" 
                     style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="col-4 text-start">Renter</div>
                    <div className="col-3 text-center">Status</div>
                    <div className="col-5 text-end">Actions</div>
                </div>

                {/* ✅ Requests List */}
                {selectedLandRequests.map((request) => (
                    <div key={request.id} className="list-group-item d-flex align-items-center"
                         style={{ display: "flex", justifyContent: "space-between" }}>
                        {/* ✅ Fixed Username Column */}
                        <div className="col-4 text-truncate" style={{ maxWidth: "120px" }} title={request.renter_name}>
                            <Link to={`/profile/${request.renter}`} className="text-primary fw-bold">
                                {request.renter_name}
                            </Link>
                        </div>

                        {/* ✅ Status Badge */}
                        <div className="col-3 text-center">
                            <span className={`badge 
                                ${request.status === "Pending" ? "bg-warning text-dark" : ""}
                                ${request.status === "Accepted" ? "bg-success" : ""}
                                ${request.status === "Rejected" ? "bg-danger" : ""}`}>
                                {request.status}
                            </span>
                        </div>

                        {/* ✅ Action Buttons */}
                        <div className="col-5 text-end">
                            {request.status === "Pending" && (
                                <>
                                    <Button size="sm" variant="success" className="me-2"
                                        onClick={() => handleRentRequestAction(request.id, "accept")}>
                                        Accept
                                    </Button>
                                    <Button size="sm" variant="danger"
                                        onClick={() => handleRentRequestAction(request.id, "reject")}>
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center">No requests for this land.</p>
        )}
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowRequestsModal(false)}>Close</Button>
    </Modal.Footer>
</Modal>



            {/* Edit Modal */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Edit Land</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
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

{/* Edit Profile Modal */}
<Modal show={showProfileEditModal} onHide={() => setShowProfileEditModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={profileData.full_name} 
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control 
                    type="text" 
                    value={profileData.phone} 
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Profile Photo</Form.Label>
                <Form.Control 
                    type="file" 
                    onChange={(e) => setProfileData({ ...profileData, profile_photo: e.target.files[0] })} 
                />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowProfileEditModal(false)}>Close</Button>
        <Button variant="primary" onClick={handleProfileUpdate}>Save Changes</Button>
    </Modal.Footer>
</Modal>
        </div>
        </Container>
        
    );
};

export default ProfileDashboard;
