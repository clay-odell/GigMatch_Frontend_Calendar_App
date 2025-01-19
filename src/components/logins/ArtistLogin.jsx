import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import GigMatchApi from "../../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const ArtistLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setCurrentUser, setToken } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await GigMatchApi.userLogin(formData);
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", token);
      GigMatchApi.token = token;
      navigate("/");
    } catch (error) {
      console.error("There was an error:", error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Title>Artist Login</Card.Title>
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

export default ArtistLogin;
