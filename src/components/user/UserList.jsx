import { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import GigMatchApi from "../../../utils/api";
import UserCard from "./UserCard";
import { useUser } from "../../contexts/UserContext";

const UserList = () => {
  const { currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useUser();

  const fetchUsers = async () => {
    try {
      GigMatchApi.token = token;
      const allUsers = await GigMatchApi.getAllUsers(currentUser);

      if (allUsers.length === 0) {
        setError("No users to fetch...");
      } else {
        setUsers(allUsers);
        setError(null);
      }
    } catch (error) {
      console.error("There was an error fetching users", error);
      setError("There was an error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  return (
    <div className="mt-4">
      <h1>User List:</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item key={user.email}>
              <UserCard user={user} fetchUpdatedUsers={fetchUsers} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default UserList;
