import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { getAccessToken } from "../../auth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

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
    <Container className="mt-4">
      <h2 className="text-center mb-4">Manage Users</h2>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    ❌ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManageUsers;
