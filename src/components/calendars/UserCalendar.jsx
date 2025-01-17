import { useEffect, useContext, useState } from "react";
import Calendar from "react-calendar";
import Card from "react-bootstrap/Card";
import "../../styles/calendar.css";
import { EventContext } from "../../contexts/EventContext";
import GigMatchApi from "../../../utils/api";
import { useUser } from "../../contexts/UserContext";
import EventRequest from "../events/EventRequest";
import EventTile from "../events/EventTile";
import EventList from "../events/EventList";

const UserCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const { events, setEvents } = useContext(EventContext);
  const { currentUser, token } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (token) {
          setLoading(true);
          
          let userRequests = [];
          if (currentUser.usertype === "Admin") {
            // Fetch all events if admin
            GigMatchApi.token = token;
            const allEventRequests = await GigMatchApi.getAllEventRequests();            
            userRequests = allEventRequests;           
          } else {
            // Fetch user-specific events for this user
            const userEventRequests = await GigMatchApi.getEventRequestsByUserId(currentUser.userid);
            userRequests = userEventRequests.eventRequests;
          }
          setEvents(userRequests);
          setLoading(false);
        } else {
          setError("No token found, unable to fetch events.");
        }
      } catch (error) {
        setError("Unable to fetch events.");
        console.error("Unable to fetch events.", error);
      }
    };
    fetchEvents();
  }, [setEvents, token, currentUser.userid, currentUser.usertype]);

  const hideForm = () => {
    setShowForm(false);
    setInitialData(null);
  };

  const handleEventUpdate = async (formData) => {
    try {
      const updatedEvent = {
        ...formData,
        userId: currentUser.userid,
      };
      await GigMatchApi.updateEventRequest(updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.requestid === updatedEvent.requestid ? updatedEvent : event
        )
      );
      hideForm();
    } catch (error) {
      console.error("Error updating event request:", error);
    }
  };
  

  const tileContent = ({ date, view }) => {
    
    if (view === "month") {
      
      const dayEvents = events.filter((event) => {
        
        if (event.userid !== currentUser.userid && currentUser.usertype !== "Admin") {
          return false;
        }
        const eventDate = new Date(event.requestdate);
       
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
  

  if (!currentUser) {
    return <p>Please log in to see your event requests.</p>;
  }

  return (
    <>
      <Card>
        {currentUser.usertype === "Artist" ? (
          <>
          <Card.Title>{currentUser.artistname}'s Calendar</Card.Title>
          </>) : (
            <>
            <Card.Title>Admin View</Card.Title>
            </>

          )}
          
        <Calendar value={value} tileContent={tileContent} />
      </Card>
      <EventList events={events} />
      {showForm && (
        <EventRequest
          selectedDate={value}
          hideForm={hideForm}
          onSubmit={handleEventUpdate}
        />
      )}
    </>
  );
};

export default UserCalendar;
