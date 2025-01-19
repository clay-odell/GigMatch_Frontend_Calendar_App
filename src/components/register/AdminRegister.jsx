import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import GigMatchApi from "../../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    venueName: "",
    email: "",
    password: "",
    location: "",
    name: "",
  });
  const { setCurrentUser, setToken, currentUser } = useUser();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const dataToSubmit = {
    ...formData,
    userType: "Admin",
    artistName: formData.venueName,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    try {
      const res = await GigMatchApi.registerAdmin(dataToSubmit);
      const { admin, token } = res;

      if (!token) {
        setError("Invalid or missing token.");
      } else if (!admin) {
        setError("Invalid or missing admin information");
      } else {
        setToken(token);
        setCurrentUser(admin);
        navigate(`/users/${admin.userid}/profile`);
      }
    } catch (error) {
      console.error("There was an error submitting admin registration");
      setError("There was an error submitting admin registration");
    }
  };

  return (
    <Card>
      <Card.Title>Venue Registration</Card.Title>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="venueName">
          <Form.Label>Venue</Form.Label>
          <Form.Control
            type="text"
            name="venueName"
            placeholder="Enter venue name"
            value={formData.venueName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Venue Location"
            value={formData.location}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
    </Card>
  );
};

export default AdminRegister;
