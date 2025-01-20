import { Container, Card } from "react-bootstrap";
import DeleteUserButton from "../buttons/DeleteUserButton";
import { useUser } from "../../contexts/UserContext";

const UserCard = ({ user }) => {
  console.log("User object", user);
  return (
    <Card>
      <Container>
        <Card.Title>{user.name}</Card.Title>
        <p>
          <strong>Username:</strong> {user.email}
        </p>
        <p>
          <strong>User Type:</strong> {user.usertype}
        </p>
        {user.usertype === "Admin" ? (
          <p>
            <strong>Venue Name:</strong> {user.venuename}
          </p>
        ) : (
          <p>
            <strong>Artist Name:</strong> {user.artistname}
          </p>
        )}
        <div className="d-flex justify-content-center mt-3">
          <DeleteUserButton user={user} />
        </div>
      </Container>
    </Card>
  );
};

export default UserCard;
