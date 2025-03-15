import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Button variant="primary" onClick={() => navigate("/manage/usersList")}>
                View Users
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Manage Lands</Card.Title>
              <Button variant="primary" onClick={() => navigate("/manage/lands")}>
                View Lands
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Manage Feedbacks</Card.Title>
              <Button variant="primary" onClick={() => navigate("/admin/images")}>
                View Images
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
