import { Container, Card } from "react-bootstrap";
import DeleteUserButton from "../buttons/DeleteUserButton";
import { useUser } from "../../contexts/UserContext";

const UserCard = ({ user, fetchUpdatedUsers }) => {
  const { currentUser } = useUser();

  return (
    <Card>
      <Container>
        <Card.Title>{user.name}</Card.Title>
        <>
          <p>
            <strong>Username:</strong> {user.email}
          </p>
          <p>
            <strong>Artist Name: </strong> {user.artistname}
          </p>
          <p>
            <strong>User Type: </strong> {user.usertype}
          </p>
        </>
        <div className="d-flex justify-content-center mt-3">
          <DeleteUserButton user={user} fetchUpdatedUsers={fetchUpdatedUsers} />
        </div>
      </Container>
    </Card>
  );
};

export default UserCard;
