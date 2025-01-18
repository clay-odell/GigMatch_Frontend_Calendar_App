import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import GigMatchApi from "../../../utils/api";

const DeleteUserButton = ({ user, fetchUpdatedUsers }) => {
  const { currentUser } = useUser();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [shouldReload, setShouldReload] = useState(false);
  const userId = user.userid;
  const userType = currentUser.usertype;

  const handleClick = async (e) => {
    e.preventDefault();

    if (userType === "Admin" || currentUser.userid === userId) {
      try {
        await GigMatchApi.deleteUser(userId, currentUser.userid);
        setToastMessage(`${user.name}'s account has been deleted`);
        setShowToast(true);
        setShouldReload(true); // Trigger re-fetching or state updates
      } catch (error) {
        console.error("There was an error deleting that user", error);
        setToastMessage("Error deleting user. Please try again.");
        setShowToast(true);
      }
    } else {
      console.error("Unauthorized user cannot delete this user");
      setToastMessage("You are not authorized to delete this user.");
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (shouldReload) {
      fetchUpdatedUsers();
      setShouldReload(false);
    }
  }, [shouldReload, fetchUpdatedUsers]);

  return (
    <>
      <Button variant="danger" onClick={handleClick}>
        Delete User
      </Button>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto text-white bg-danger">
              Notification:
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default DeleteUserButton;
