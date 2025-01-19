import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GigMatchApi from "../../../utils/api";
import { Button, Form, Card } from "react-bootstrap";
import { UserContext } from "../../contexts/UserContext";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    artistname: "",
    usertype: "Artist",
  });
  const [error, setError] = useState("");

  const { setCurrentUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    try {
      const res = await GigMatchApi.registerUser(formData);
      const { token, user } = res;

      setToken(token);
      setCurrentUser(user);
      GigMatchApi.token = token;

      alert("Registration successful!");
      navigate("/master-calendar");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(`Registration failed: ${error.response.data.error}`);
      } else {
        setError("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <Card>
      <Card.Title>Artist Registration</Card.Title>
      <Form onSubmit={handleSubmit}>
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
        <Form.Group controlId="artistname">
          <Form.Label>Name of Artist or Group</Form.Label>
          <Form.Control
            type="text"
            name="artistname"
            placeholder="Enter artist's name"
            value={formData.artistname}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Register
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </Card>
  );
};

export default UserRegister;
