import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card } from "react-bootstrap";
import GigMatchApi from "../../../utils/api";
import { useUser } from "../../contexts/UserContext";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    artistname: "",
    usertype: "",
    venuename: "",
  });
  const [error, setError] = useState("");
  const { setToken, setUser } = useUser();
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
    usertype: "Admin"
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (dataToSubmit.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const { password, ...dataToSubmit } = formData;
      const res = await GigMatchApi.registerAdmin(dataToSubmit);
      const { token, admin } = res;

      if (!token) {
        setError("Invalid or missing token.");
        return;
      }
      if (!admin) {
        setError("Invalid or missing admin information.");
        return;
      }
      console.log("Admin Register Token", token);
      setToken(token);
      setUser(admin);
      GigMatchApi.token = token;
      alert("Registration successful!");
      navigate("/master-calendar");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(`Registration failed: ${err.response.data.error}`);
      } else {
        setError("Registration failed. Please try again later.");
      }
      console.error("Registration failed:", err);
    }
  };

  return (
    <Card>
      <Card.Title>Venue Registration</Card.Title>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter user's name"
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
            placeholder="City, State"
            value={formData.location}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="venuename">
          <Form.Label>Venue Name</Form.Label>
          <Form.Control
            type="text"
            name="venuename" // Corrected name attribute
            placeholder="Enter venue name"
            value={formData.venuename}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
    </Card>
  );
};

export default AdminRegister;
