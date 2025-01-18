import { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import Card from "react-bootstrap/Card";
import "../../styles/calendar.css";
import { EventContext } from "../context/EventContext";
import GigMatchApi from "../../utils/api";

const AdminCalendar = () => {
  const { events, setEvents, updateEvent } = useContext(EventContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventRequests = await GigMatchApi.getEventRequests();
        setEvents(eventRequests);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Error fetching events. Please try again later.");
      }
    };
    fetchEvents();
  }, [setEvents]);

  const handleEventClick = async (event) => {
    try {
      const updatedEvent = { ...event, status: "Approved" };
      await GigMatchApi.updateEventRequest(event.requestId, updatedEvent);
      updateEvent(updatedEvent);
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Error updating event. Please try again later.");
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const event = events.find(
        (event) => new Date(event.date).toDateString() === date.toDateString() && event.status === "Pending"
      );
      if (event) {
        return (
          <div onClick={() => handleEventClick(event)}>
            <p>{event.title}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card>
      <Card.Title>Admin Calendar</Card.Title>
      {error && <p className="text-danger">{error}</p>}
      <Calendar tileContent={tileContent} />
    </Card>
  );
};

export default AdminCalendar;
