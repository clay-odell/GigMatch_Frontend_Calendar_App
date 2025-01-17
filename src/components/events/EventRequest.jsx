import { Container, Card, Button, Form } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";
import "../../styles/eventRequest.css";

const EventRequest = ({ selectedDate, hideForm, onSubmit }) => {
  const { currentUser } = useUser();
    
  const [formData, setFormData] = useState({
    artistName: currentUser.artistname,
    status: "Pending",
    requestDate: selectedDate ? formatDate(selectedDate) : "",
    startTime: "19:00", 
    endTime: "22:00", 
    amount: "",
    userId: currentUser?.userid || "",
    eventName: "",
  });

  const isSubmitting = useRef(false);

  useEffect(() => {
    if (selectedDate) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requestDate: formatDate(selectedDate),
      }));
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;

    try {
      const displayEndTime = formData.endTime < formData.startTime
        ? `${formData.endTime} (next day)`
        : formData.endTime;

      const dataToSubmit = {
        ...formData,
        endTimeDisplay: displayEndTime,
      };

      await onSubmit(dataToSubmit);
      hideForm(true);
    } catch (err) {
      console.error("Error occurred during form submission:", err);
    } finally {
      isSubmitting.current = false;
    }
  };

  //Time Options for the dropdown

  const timeOptions = [];
  const periods = ["AM", "PM"];

  for (let period of periods) {
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const valueHour =
          period === "PM" && hour !== 12
            ? hour + 12
            : hour === 12 && period === "AM"
            ? 0
            : hour;
        const timeValue = `${valueHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const timeDisplay = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;
        timeOptions.push({ value: timeValue, display: timeDisplay });
      }
    }
  }

  return (
    <Card>
      <Container>
        <Card.Title>Event Request Form</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Artist's Name:</Form.Label>
            <Form.Control
              name="artistName"
              type="text"
              value={currentUser.artistname}
              placeholder="Enter artist's name..."
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Event Name:</Form.Label>
            <Form.Control
              name="eventName"
              type="text"
              value={formData.eventName}
              placeholder="Solo or Band Show"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Request Date:</Form.Label>
            <Form.Control
              name="requestDate"
              type="date"
              value={formData.requestDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start Time:</Form.Label>
            <Form.Control
              as="select"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            >
              {timeOptions.map((time, idx) => (
                <option key={idx} value={time.value}>
                  {time.display}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>End Time:</Form.Label>
            <Form.Control
              as="select"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            >
              {timeOptions.map((time, idx) => (
                <option key={idx} value={time.value}>
                  {time.display}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Requested Pay Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              value={formData.amount}
              placeholder="$100/member..."
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    </Card>
  );
};

// Helper function for formatting the date for backend
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default EventRequest;
