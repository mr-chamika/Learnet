import "./EventDisplay.css";
import thumbnail from "../../../Assets/grp.jpg"
import Link from "../../../Router/Link";
import { useContext } from "../../../../react_lite/createDOM";
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext";
import { routerContext } from "../../../Router/Router";

function EventDisplay({ event }) {
  const { title, date, description, location, _id } = event;
  const {setSelectedEvent} = useContext(SelectedTaskContext);
  const {goto} = useContext(routerContext);

  const handleUpdate = () => { 
    setSelectedEvent(event);
    goto("/user/personal-schedule/update-event")
  }

  return (
    <div className="event-card">
      <div className="event-header">
        <h2 className="event-title">{event.title}</h2>
        <p className="event-date">{event.date}</p>
      </div>
      <div className="event-thumbnail-container">
          <img className="event-thumbnail" src={thumbnail} />
      </div>
      <div className="event-body">
        <p className="event-description">{event.description}</p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-location">{event.visibility}</p>
      </div>
      <div className="event-footer">
        <button className="event-button" onClick={handleUpdate}>update Event</button>
        <button className="event-button" onClick={handleUpdate}>Cancel Event</button>
        <button className="event-button" onClick={handleUpdate}>Postpone Event</button>
        {/* <button className="event-button">Join Event</button> */}
        {/* <button className="event-button secondary">More Info</button> */}
      </div>
    </div>
  );
}

export default EventDisplay;
