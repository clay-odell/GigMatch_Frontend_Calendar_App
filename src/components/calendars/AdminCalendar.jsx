import { useEffect, useContext } from "react";
import Calendar from "react-calendar";
import Card from "react-bootstrap/Card";
import "../../styles/calendar.css";
import { EventContext } from "../context/EventContext";
import GigMatchApi from "../../utils/api";

const AdminCalendar = () => {
  const { events, setEvents, updateEvent } = useContext(EventContext);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventRequests = await GigMatchApi.getEventRequests();
      setEvents(eventRequests);
    };
    fetchEvents();
  }, [setEvents]);

  const handleEventClick = async (event) => {
    const updatedEvent = { ...event, status: "approved" };
    await GigMatchApi.updateEventRequest(event.requestId, updatedEvent);
    updateEvent(updatedEvent);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const event = events.find(
        (event) => new Date(event.date).toDateString() === date.toDateString() && event.status === "pending"
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
      <Calendar tileContent={tileContent} />
    </Card>
  );
};

export default AdminCalendar;
