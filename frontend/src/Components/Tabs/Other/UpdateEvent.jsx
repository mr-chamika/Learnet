import { useContext, useState, useEffect } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext";
import { routerContext } from "../../../Router/Router";
import { formDataToObj } from "../../../Util/FormDataToObj";


const UpdateEvent = () => {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const { goto } = useContext(routerContext);
    const {user} = useContext(UserContext);
    const { setEvents, selectedEvent } = useContext(SelectedTaskContext);

    const [title,setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    //const [important, setImportant] = useState(false);
    
    useEffect(() => {
        if (!selectedEvent) {
            console.warn("No selected event found, redirecting...");
            goto("user/personal-schedule");
            return; 
          }
        
          setTitle(selectedEvent.title || "");
          setDescription(selectedEvent.description || "");
          setDate(selectedEvent.date?.slice(0, 10) || "");
          setLocation(selectedEvent.location || "");
          //setImportant(selectedEvent.isImportant || false);
    }, [selectedEvent]);

    const updateEventHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = formDataToObj(formData);
        
        const { title, date, description, location } = data;

        if (!title || !date || !description || !location) {
            setIsError(true);
            setError("Title, Date, Description and Location fields are required!");
            return;
        }

        console.log("Sending Event Data:",title, date, description, location );

        fetch(`http://localhost:8080/event/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ id: selectedEvent._id, title, date, description, location,}),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setEvents(prev=>{
                        return prev.map(event => {
                            if (event._id === data.event._id) {
                                return data.event;
                            }
                            return event;
                        })
                    })
                    goto("/user/personal-schedule");
                } else {
                    setIsError(true);
                    setError(data.error || "Error updating event.");
                }
            })
            .catch((err) => console.log(err));
            //.catch((err) => {
              //  console.error("Error during fetch:", err);
                //setIsError(true);
                //setError("Failed to connect to the server.");
           // });
    };

    
    
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const inputValue = type === "checkbox" ? checked : value;

        switch (name) {
            case "title":
                setTitle(inputValue);
                break;
            case "description":
                setDescription(inputValue);
                break;
            case "date":
                setDate(inputValue);
                break;
            case "completed":
                setCompleted(inputValue);
                break;                         
            default:
                break;
        }
    }

    return (
        <div>
            <div className="event-update cont">
                <div className="box">
                    <div className="form">
                        <h2>Update Event</h2>
                        <form onSubmit={updateEventHandler}>
                            <input  value={title} name="title" type="text" placeholder="Event Title" onChange={handleChange} />
                            <input value={date}  name="date" type="date" placeholder="Event Date" onChange={handleChange} />
                            <textarea value={description} name="description" placeholder="Event Description" rows={4} onChange={handleChange} ></textarea> 
                            <input value={location} name="location" type="text" placeholder="Event Location" onChange={handleChange} />                  
                            {isError && (<div className="error">{error}</div>)}
                            <input type="submit" value="Update Event" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEvent;
