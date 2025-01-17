import { Card, Button } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/");
  }

  return (
    <Card>
      <Card.Title>Logout</Card.Title>
      <Card.Body>Are you sure you want to logout?</Card.Body>
      <Button variant="danger" onClick={handleClick}>
        Logout
      </Button>
    </Card>
  );
};
export default Logout;