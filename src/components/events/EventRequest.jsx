import { Container, Card, Button, Form } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";
import "../../styles/eventRequest.css";

const EventRequest = ({ selectedDate, hideForm, onSubmit }) => {
  const { currentUser } = useUser();
    
  const [formData, setFormData] = useState({
    artistname: currentUser.artistname,
    status: "Pending",
    requestdate: selecteddate ? formatDate(selecteddate) : "",
    starttime: "19:00", 
    endtime: "22:00", 
    amount: "",
    userid: currentUser?.userid || "",
    eventname: "",
  });

  const isSubmitting = useRef(false);

  useEffect(() => {
    if (selecteddate) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requestdate: formatDate(selecteddate),
      }));
    }
  }, [selecteddate]);

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
      const displayEndTime = formData.endtime < formData.starttime
        ? `${formData.endtime} (next day)`
        : formData.endtime;

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
              name="artistname"
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
              value={formData.eventname}
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
              value={formData.requestdate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start Time:</Form.Label>
            <Form.Control
              as="select"
              name="starttime"
              value={formData.starttime}
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
              name="endtime"
              value={formData.endtime}
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
