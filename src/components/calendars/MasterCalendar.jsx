import { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import Card from "react-bootstrap/Card";
import { EventContext } from "../../contexts/EventContext";
import { useUser } from "../../contexts/UserContext";
import EventRequest from "../events/EventRequest";
import GigMatchApi from "../../../utils/api";
import EventTile from "../events/EventTile";
import "../../styles/calendar.css";

const MasterCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const { events, addEvent, setEvents } = useContext(EventContext);
  const { currentUser, token } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (token) {
          const approvedEvents = await GigMatchApi.getEventRequestsByStatus(
            "Approved"
          );
          setEvents(approvedEvents);
        } else {
          console.error("No token found, unable to fetch events.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [token, setEvents]);

  const handleChange = (nextValue) => {
    if (currentUser) {
      setValue(nextValue);
      setShowForm(true);
    } else {
      alert("You must be logged in to make an event request.");
    }
  };

  const hideForm = () => {
    setShowForm(false);
  };

  const handleEventSubmit = async (formData) => {
    try {
      const newEvent = {
        ...formData,
        artistName: currentUser.artistname,
        userId: currentUser.userid,
        status: "Pending",
        requestdate: value,
      };
      console.log("Form Data", formData);
      GigMatchApi.token = token;
      const createdEvent = await GigMatchApi.createEventRequest(newEvent);
      addEvent(createdEvent);
      hideForm();
    } catch (error) {
      console.error("Error creating event request:", error);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter((event) => {
        if (event.status !== "Approved") { 
          return false;
        }
        const eventDate = new Date(event.requestDate);
        return eventDate.toDateString() === date.toDateString();
      });
      if (dayEvents.length > 0) {
        return (
          <div className="events">
            {dayEvents.map((event) => (
              <EventTile key={event.requestid} event={event} /> 
            ))}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      <Card>
        <Card.Title>Main Calendar</Card.Title>
        <p>Select a date on the calendar then fill out event request form below:</p>
        <Calendar
          onChange={handleChange}
          value={value}
          tileContent={tileContent}

        />
      </Card>
      {showForm && (
        <EventRequest
          selectedDate={value}
          hideForm={hideForm}
          onSubmit={handleEventSubmit} 
        />
      )}
    </>
  );
};

export default MasterCalendar;
