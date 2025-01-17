import { Container, Card } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import "../../styles/eventList.css";
import EventStatusButton from "../buttons/EventStatusButton";
import DeleteEventButton from "../buttons/DeleteEventButton";

const EventList = ({ events }) => {
  const { currentUser } = useUser();

  const sortedEvents = events.sort((a, b) => {
    const artistA = a.artistname ? a.artistname.toLowerCase() : "";
    const artistB = b.artistname ? b.artistname.toLowerCase() : "";

    if (artistA < artistB) return -1;
    if (artistA > artistB) return 1;
    return 0;
  });

  if (events.length === 0) {
    return (
      <Container>
        <h4>There are no events to display for {currentUser.artistname}</h4>
      </Container>
    );
  }

  return (
    <Card>
      <Card.Title className="event-list-title">
        Event List for {currentUser.artistname}:
      </Card.Title>

      <ul>
        {sortedEvents.map((event) => (
          <Card key={event.requestid}>
            <li>
              <Card.Title>
                {event.eventname}
                <br />
              </Card.Title>
              <strong>Artist Name:</strong> {event.artistname}
              <br />
              <strong>Status:</strong> {event.status}
              <br />
              <strong>Request Date:</strong> {formatDate(event.requestdate)}
              <br />
              <strong>Start Time:</strong> {formatTime(event.starttime)}
              <br />
              <strong>End Time: </strong> {formatTime(event.endtime)}
              <br />
              <strong>Amount of Payment: </strong> ${event.amount}
              <br />
              
              {currentUser.usertype === "Admin" && (
                <>
                  <EventStatusButton event={event} />
                </>
              )}
              <br />
              <div className="d-flex justify-content-center mt-3">
               <DeleteEventButton event={event} />
               </div>
            </li>
            
          </Card>
        ))}
      </ul>
    </Card>
  );
};

export default EventList;
