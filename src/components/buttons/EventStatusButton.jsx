import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import GigMatchApi from "../../../utils/api";
import { Form, Button, Container } from "react-bootstrap";

const EventStatusButton = ({ event }) => {
  const [status, setStatus] = useState("" || event.status);
  const { currentUser, token } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  const requestId = event.requestid;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser.usertype !== "Admin") {
        navigate("/");
        return;
      }
      if (requestId) {
        GigMatchApi.token = token;
        const userId = currentUser.userid;
        await GigMatchApi.updateEventRequest(
          requestId,
          { status },
          userId
        );
        navigate(`/users/${currentUser.artistname}/calendar`);
      }
    } catch (error) {
      console.error("There was an error", error);
    }
  };

  const buttonColor = (status) => {
    if (status === "Pending") {
      return "warning";
    } else if (status === "Approved") {
      return "success";
    } else if (status === "Rejected") {
      return "danger";
    } else {
      return "primary";
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="handle-status">
        <Container>
          <Form.Label><strong>Select Status Below & Click Button to Submit Status Update:</strong></Form.Label>
          <Form.Control as="select" value={status} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Control>
        </Container>
      </Form.Group>
      <br />
      <Button variant={buttonColor(status)} type="submit">Update Status</Button>
    </Form>
  );
};

export default EventStatusButton;
