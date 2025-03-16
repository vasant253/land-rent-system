import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner,Modal, Dropdown } from "react-bootstrap";
import { getAccessToken } from "../../auth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getAccessToken();
      const res = await axios.get("http://127.0.0.1:8000/api/usersList/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleShowDocument = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleVerifyUser = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8000/api/admin/users/${userId}/verify/`,
        { is_verified: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update the user state after verification
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_verified: true } : user
      ));
      alert("Verification Successful!");
      setShowModal(false); // ✅ Close the modal
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "verified") return user.is_verified;
    if (filter === "not_verified") return !user.is_verified;
    return true; // Show all users
  });

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return; // ⛔ Stop if user cancels
  
    try {
      const token = await getAccessToken();
      await axios.delete(`http://localhost:8000/api/usersList/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUsers(users.filter((user) => user.id !== id)); // ✅ Remove user from UI
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.detail || "You cannot delete your own account!");
      } else {
        alert("Failed to delete user. Please try again.");
      }
      console.error("Error deleting user:", error);
    }
  };
  

  return (
    <Container className="mt-4 mb-4">
    <h2 className="text-center mb-4">Manage Users</h2>
    {/* ✅ Dropdown for Sorting */}
    <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold">Filter Users:</span>
        <Dropdown>
          <Dropdown.Toggle variant="primary">
            {filter === "all" ? "All Users" : filter === "verified" ? "Verified Users" : "Not Verified Users"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFilter("all")}>All Users</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("verified")}>Verified Users</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter("not_verified")}>Not Verified Users</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    {loading ? (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    ) : (
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Verification</th>
            <th>Aadhaar/PAN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td className={user.is_verified ? "text-success" : "text-danger"}>
                {user.is_verified ? "Verified" : "Not Verified"}
              </td>
              
              {/* ✅ Aadhaar/PAN Document Column */}
              <td>
                  {user.aadhaar_pan_doc ? (
                    <img
                      src={user.aadhaar_pan_doc}
                      alt="Aadhaar/PAN"
                      style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => handleShowDocument(user)} // ✅ Open modal on click
                    />
                  ) : (
                    <span className="text-muted">No Document</span>
                  )}
                </td>
  
              {/* ✅ Delete Button */}
              <td>
                <Button variant="danger" size="sm" onClick={() => deleteUser(user.id)}>
                  ❌ Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify Aadhaar/PAN</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedUser && selectedUser.aadhaar_pan_doc ? (
            <>
            <a href={selectedUser.aadhaar_pan_doc} target="_blank" rel="noopener noreferrer">
            <img
                        src={selectedUser.aadhaar_pan_doc}
                        alt="Aadhaar/PAN Document"
                        style={{ 
                            width: "300px",  // ✅ Fixed width 
                            height: "400px", // ✅ Fixed height 
                            objectFit: "contain", // ✅ Maintain aspect ratio without cropping
                            borderRadius: "5px", 
                            border: "1px solid #ddd", 
                            cursor: "pointer" 
                        }}
                    />
            </a>
            <p className="mt-2">
              <a href={selectedUser.aadhaar_pan_doc} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                🔍 View Full Size
              </a>
            </p>
          </>
          ) : (
            <p>No document available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          {!selectedUser?.is_verified && (
            <Button variant="success" onClick={() => handleVerifyUser(selectedUser.id)}>
              ✅ Verify User
            </Button>
          )}
        </Modal.Footer>
      </Modal>
  </Container>  
  );
};

export default ManageUsers;
