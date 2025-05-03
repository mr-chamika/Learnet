import Link from "../../../Router/Link";
import EventDisplay from "./eventDisplay";
import { useState, useEffect } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import { useContext } from "../../../../react_lite/createDOM";
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext";

function EventsComponent() {
    // const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext);
    const { events, setEvents } = useContext(SelectedTaskContext);

    // const fetchEvents = () => {
    //     fetch("http://localhost:8080/events/all", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             authorization: `Bearer ${user.token}`,
    //         },
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log("Events fetched:", data);
    //             const eventList = Array.isArray(data) ? data : [];
    //             setEvents(eventList);
    //         })
    //         .catch((err) => {
    //             console.error("Fetch events error", err);
    //             setEvents([]);
    //         });
    // }
    
    // useEffect(() => {
    //     fetchEvents();
    // }, [user]);

  return (
    <div>
        <div className="topbar">
          <div className="right">
            <Link className="icon-button" to="/user/personal-schedule/create-event" label="Create Event" />
          </div>
        </div>
        <div className="component-inner-container events-container component-scroll">
          {
              events.map((event)=>{
                  return (
                      <EventDisplay event={event} key={event._id}/>
                  )
              })
          }
        </div>
      
    </div>
  );
}

export default EventsComponent;

