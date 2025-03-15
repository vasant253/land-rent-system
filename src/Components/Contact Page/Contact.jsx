import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ success: null, message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, message: "" });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/contact/", formData);
      if (response.status === 200) {
        setStatus({ success: true, message: "Message sent successfully!" });
        setFormData({ name: "", email: "", message: "" }); // Clear form
      }
    } catch (error) {
      setStatus({ success: false, message: "Failed to send message. Please try again." });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-3 text-primary fw-bold">Contact Us</h2>
              <p className="text-muted text-center mb-4">
                Have a question or concern? Feel free to reach out to us.
              </p>

              {/* ✅ Success/Error Message */}
              {status.message && (
                <div className={`alert ${status.success ? "alert-success" : "alert-danger"}`}>
                  {status.message}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Name */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                {/* Message */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here..."
                  />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button type="submit" variant="primary" className="fw-semibold">
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
