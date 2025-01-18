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
  const { currentUser, token, setCurrentUser } = useUser();
  const [formData, setFormData] = useState({
    email: currentUser.email,
    password: "",
    artistname: currentUser.artistname,
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [shouldReload, setShouldReload] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8){
      setError("Password must be a minimum of 8 characters.");
    }
    try {
      
      const updatedUser = await GigMatchApi.updateUser(
        currentUser.userid,
        formData
      );
      setCurrentUser(updatedUser);
      setToastMessage("Profile updated successfully");
      setShowToast(true);

      setShouldReload(true);
    } catch (error) {
      console.error("There was an error updating the profile", error);
      setToastMessage(`There was an error updating user profile: ${error}.`);
      setShowToast(true);
    }
  };

  const fetchEvents = async (status) => {
    try {
      let allEvents = await GigMatchApi.getEventRequestsByStatus(status);
      let userEvents = allEvents.filter(
        (event) => event.userid === currentUser.userid
      );
      return userEvents;
    } catch (error) {
      console.error(`There was an error fetching ${status} events`, error);
      return [];
    }
  };

  useEffect(() => {
    if (shouldReload) {
      const reload = async () => {
        const pendingEvents = await fetchEvents("Pending");
        const approvedEvents = await fetchEvents("Approved");
        const rejectedEvents = await fetchEvents("Rejected");

        setPendingEvents(pendingEvents);
        setApprovedEvents(approvedEvents);
        setRejectedEvents(rejectedEvents);
        setShouldReload(false);
      };

      reload();
    }
  }, [shouldReload]);

  useEffect(() => {
    const fetchData = async () => {
      setPendingEvents(await fetchEvents("Pending"));
      setApprovedEvents(await fetchEvents("Approved"));
      setRejectedEvents(await fetchEvents("Rejected"));
    };

    fetchData();
  }, [token, currentUser.userid]);

  return (
    <>
      <Card>
        <h1>{currentUser.artistname}'s Profile:</h1>
        <p>
          <strong>Username:</strong> {currentUser.email}
        </p>
        <p>
          <strong>Artist Name:</strong> {currentUser.artistname}
        </p>
        <Card.Title>Update User Account Information:</Card.Title>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formArtistName">
              <Form.Label>Artist Name</Form.Label>
              <Form.Control
                type="text"
                name="artistname"
                value={formData.artistname}
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
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit" className="mt-3">
                Update Profile
              </Button>
            </div>
          </Form>
        </Container>
        <ToastContainer position="top-end" className="p-3">
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
