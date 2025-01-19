import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Button, Form, Card } from "react-bootstrap";
import GigMatchApi from "../../../utils/api";

const VenueLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setCurrentUser, setToken, currentUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!currentUser) {
      try {
        const { token, admin } = await GigMatchApi.adminLogin(formData);
        console.log("Admin", admin);
        setCurrentUser(admin);
        setToken(token);
        localStorage.setItem("currentUser", JSON.stringify(admin));
        localStorage.setItem("token", token);
        navigate("/master-calendar");
      } catch (error) {
        setError("Login failed. Please check your credentials and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <Card.Title>Venue Login</Card.Title>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email address"
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
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </Card>
  );
};

export default VenueLogin;
