import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import GigMatchApi from "../../../utils/api";

const DeleteEventButton = ({ event }) => {
  const { currentUser } = useUser();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    const requestId = event.requestid;
    const userType = currentUser.usertype;
    if (userType === "Admin" || currentUser.userid === event.userid) {
      try {
        await GigMatchApi.deleteEventRequestByRequestId(
          requestId,
          currentUser.userid
        );
        setToastMessage(
          `${event.artistname}'s event: ${event.eventname} deleted`
        );
        setShowToast(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        console.error("There was an error deleting that event", error);
        setToastMessage("Error deleting event. Please try again.");
        setShowToast(true);
      }
    } else {
      console.error("Unauthorized user cannot delete this event");
      setToastMessage("You are not authorized to delete this event.");
      setShowToast(true);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleClick}>
        Delete Event
      </Button>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto text-white bg-danger">Notification:</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default DeleteEventButton;
