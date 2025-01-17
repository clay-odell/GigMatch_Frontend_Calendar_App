import { useUser } from '../../contexts/UserContext';
import { formatTime } from '../../../utils/formatTime';

const EventTile = ({ event }) => {
  const { currentUser } = useUser();
  const formattedStartTime = formatTime(event.starttime);
  const formattedEndTime = formatTime(event.endtime);
 

  return (
    <div className="event-tile">
      <p><strong>"{event.eventname}"</strong><br />
      {event.artistname}<br />
      {formattedStartTime} - {formattedEndTime}</p> 
    </div>
  );
};

export default EventTile;
