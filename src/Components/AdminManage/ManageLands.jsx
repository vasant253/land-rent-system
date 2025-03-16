import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner, Modal } from "react-bootstrap";
import { getAccessToken } from "../../auth";

const ManageLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedLandDoc, setSelectedLandDoc] = useState(null);


  const [filter, setFilter] = useState("all");


  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const token = await getAccessToken();
      const res = await axios.get("http://localhost:8000/landapi/lands/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLands(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lands:", error);
      setLoading(false);
    }
  };

  const filteredLands = lands.filter((land) => {
    if (filter === "approved") return land.status === "Approved";
    if (filter === "pending") return land.status === "Pending";
    if (filter === "rejected") return land.status === "Rejected";
    return true; // Show all lands
  });
  

  const handleShowDocument = (land) => {
    setSelectedLandDoc(land.seven_twelve_doc);
    setShowDocModal(true);
  };
  

  const handleShowDetails = (land) => {
    setSelectedLand(land);
    setShowModal(true);
  };

  const handleLandAction = async (id, action) => {
    const confirmAction = window.confirm(`Are you sure you want to ${action} this land?`);
    if (!confirmAction) return;

    try {
      const token = await getAccessToken();
      const response = await axios.post(
        `http://localhost:8000/landapi/lands/${id}/status/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setLands(lands.filter((land) => land.land_id !== id)); // ✅ Remove land from UI
        alert(`Land ${action}d successfully.`);
      }
    } catch (error) {
      alert("Failed to process request. Try again.");
      console.error(`Error ${action}ing land:`, error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Manage Lands</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
  <span className="fw-bold">Filter Lands:</span>
  <select 
    className="form-select w-auto" 
    value={filter} 
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="all">All Lands</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>
</div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : lands.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Location</th>
              <th>Price</th>
              <th>Land Type</th>
              <th>7/12 Doc</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLands.map((land) => (
              <tr key={land.land_id}>
                  <td 
                  className="text-primary fw-bold text-decoration-underline"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowDetails(land)}  // ✅ Click ID to open modal
                >
                  {land.land_id}
                </td>
                <td>{land.owner.email}</td>
                <td>{land.location}</td>
                <td>₹{land.price}</td>
                <td>{land.land_type}</td>
                <td>
                {land.seven_twelve_doc ? (
                  <>
                    <img
                      src={`http://127.0.0.1:8000${land.seven_twelve_doc}`} // ✅ Show Image
                      alt="7/12 Document"
                      style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer", border: "1px solid #ddd", borderRadius: "5px" }}
                      onClick={() => handleShowDocument(land)}
                    />
                  </>
                ) : (
                  <span className="text-danger">There is no document.</span>
                )}
              </td>

                
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleLandAction(land.land_id, "approve")}
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleLandAction(land.land_id, "reject")}
                  >
                    ❌ Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No pending lands available.</p>
      )}
  {/* ✅ Land Details Modal */}
  <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Land Details</Modal.Title>
        </Modal.Header>
        
        {/* ✅ Scrollable Modal Body with Fixed Height */}
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          {selectedLand ? (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h5><strong>Owner:</strong> {selectedLand.owner.full_name}</h5>
              <p><strong>Email:</strong> {selectedLand.owner.email}</p>
              <p><strong>Location:</strong> {selectedLand.location}</p>
              <p><strong>State:</strong> {selectedLand.state}</p>
              <p><strong>District:</strong> {selectedLand.district}</p>
              <p><strong>Land Type:</strong> {selectedLand.land_type}</p>
              <p><strong>Area:</strong> {selectedLand.area} Sq.ft</p>
              <p><strong>Soil Quality:</strong> {selectedLand.soil_quality}</p>
              <p><strong>Utilities Available:</strong> {selectedLand.utilities_available}</p>
              <p><strong>Land Access:</strong> {selectedLand.land_access}</p>
              <p><strong>Price:</strong> ₹{selectedLand.price} per month</p>
              <p><strong>Description:</strong> {selectedLand.description}</p>
              <p><strong>Available From:</strong> {selectedLand.available_from}</p>
              <p><strong>Available To:</strong> {selectedLand.available_to}</p>

              {/* ✅ Display Images if Available */}
              {selectedLand.images && selectedLand.images.length > 0 && (
                <div>
                  <h5>Land Images</h5>
                  <div className="d-flex flex-wrap" style={{ maxHeight: "200px", overflowY: "auto" }}>
                
                      <img
                        key={selectedLand.land_id}
                        src={`http://127.0.0.1:8000${selectedLand.images[0].image}`}
                        alt={`Land ${selectedLand.land_id}`}
                        className="m-2"
                        style={{ width: "120px", height: "100px", objectFit: "cover", border: "1px solid #ddd", borderRadius: "5px" }}
                      />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading land details...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          {!selectedLand?.is_verified && (
            <>
              <Button variant="success" onClick={() => handleLandAction(selectedLand.land_id, "approve")}>
                ✅ Approve
              </Button>
              <Button variant="danger" onClick={() => handleLandAction(selectedLand.land_id, "reject")}>
                ❌ Reject
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showDocModal} onHide={() => setShowDocModal(false)} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>7/12 Document</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center">
    {selectedLandDoc ? (
      <>
        <a href={`http://127.0.0.1:8000${selectedLandDoc}`} target="_blank" rel="noopener noreferrer">
          <img
            src={`http://127.0.0.1:8000${selectedLandDoc}`}
            alt="7/12 Document"
            style={{ maxWidth: "100%", maxHeight: "500px", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer" }}
          />
        </a>
        <p className="mt-2">
          <a href={`http://127.0.0.1:8000${selectedLandDoc}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
            🔍 View Full Size
          </a>
        </p>
      </>
    ) : (
      <p>No document available</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDocModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>

    </Container>
  );
};

export default ManageLands;
