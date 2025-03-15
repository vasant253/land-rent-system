import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { getAccessToken } from "../../auth";

const ManageLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const token = await getAccessToken();
      const res = await axios.get("http://localhost:8000/landapi/lands/pending/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLands(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lands:", error);
      setLoading(false);
    }
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
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : lands.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Location</th>
              <th>Price</th>
              <th>Land Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lands.map((land) => (
              <tr key={land.land_id}>
                <td>{land.land_id}</td>
                <td>{land.owner.full_name}</td>
                <td>{land.owner.email}</td>
                <td>{land.location}</td>
                <td>₹{land.price}</td>
                <td>{land.land_type}</td>
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
    </Container>
  );
};

export default ManageLands;
