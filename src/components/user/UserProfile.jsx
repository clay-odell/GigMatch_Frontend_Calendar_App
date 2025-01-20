import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import {
  ToastContainer,
  Container,
  Card,
  Button,
  Form,
  Toast,
} from "react-bootstrap";
import GigMatchApi from "../../../utils/api";
import EventList from "../events/EventList";

const UserProfile = () => {
  const { currentUser, token } = useUser();
  const [formData, setFormData] = useState({
    email: currentUser.email,
    name: currentUser.name,
    artistname: currentUser.artistname,
    venuename: currentUser.venuename,
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [shouldReload, setShouldReload] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await GigMatchApi.updateUser(currentUser.userid, formData);
      setToastMessage("Profile updated successfully");
      setShowToast(true);
      setShouldReload(true);
    } catch (error) {
      console.error("There was an error updating the profile", error);
      setToastMessage("Error updating profile. Please try again.");
      setShowToast(true);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const allPendingEvents = await GigMatchApi.getEventRequestsByStatus(
        "Pending"
      );
      const userPendingEvents = allPendingEvents.filter(
        (event) => event.userid === currentUser.userid
      );
      setPendingEvents(userPendingEvents);
    } catch (error) {
      console.error("There was an error fetching pending events", error);
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      const allApprovedEvents = await GigMatchApi.getEventRequestsByStatus(
        "Approved"
      );
      const userApprovedEvents = allApprovedEvents.filter(
        (event) => event.userid === currentUser.userid
      );
      setApprovedEvents(userApprovedEvents);
    } catch (error) {
      console.error("There was an error fetching approved events", error);
    }
  };

  const fetchRejectedEvents = async () => {
    try {
      const allRejectedEvents = await GigMatchApi.getEventRequestsByStatus(
        "Rejected"
      );
      const userRejectedEvents = allRejectedEvents.filter(
        (event) => event.userid === currentUser.userid
      );
      setRejectedEvents(userRejectedEvents);
    } catch (error) {
      console.error("There was an error fetching rejected events", error);
    }
  };

  useEffect(() => {
    if (shouldReload) {
      fetchPendingEvents();
      fetchApprovedEvents();
      fetchRejectedEvents();
      setShouldReload(false);
    }
  }, [shouldReload, token, currentUser.userid]);

  return (
    <>
      <Card>
        <h1>
          {currentUser.artistname
            ? `${currentUser.artistname}'s Profile`
            : `${currentUser.venuename}'s Profile`}
        </h1>
        <p>
          <strong>Username:</strong> {currentUser.email}
        </p>
        <p>
          <strong>
            {currentUser.usertype === "Artist" ? "Artist Name" : "Venue Name"}:
          </strong>{" "}
          {currentUser.artistname || currentUser.venuename}
        </p>
        <Card.Title>Update User Account Information:</Card.Title>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formArtistName">
              <Form.Label>
                {currentUser.usertype === "Artist"
                  ? "Artist Name"
                  : "Venue Name"}
              </Form.Label>
              <Form.Control
                type="text"
                name={
                  currentUser.usertype === "Artist" ? "artistname" : "venuename"
                }
                value={
                  currentUser.usertype === "Artist"
                    ? formData.artistname
                    : formData.venuename
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username/Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit" className="mt-3">
                Update Profile
              </Button>
            </div>
          </Form>
        </Container>
        <ToastContainer position="top-start" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Card>
      <Card>
        <Card.Title>Pending Event Requests:</Card.Title>
        <EventList events={pendingEvents} />
      </Card>
      <Card>
        <Card.Title>Approved Event Requests:</Card.Title>
        <EventList events={approvedEvents} />
      </Card>
      <Card>
        <Card.Title>Rejected Event Requests:</Card.Title>
        <EventList events={rejectedEvents} />
      </Card>
    </>
  );
};

export default UserProfile;
