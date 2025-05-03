import { useContext, useState } from "../../../../react_lite/createDOM";
import { formDataToObj } from "../../../Util/FormDataToObj";
import { routerContext } from "../../../Router/Router";
import { UserContext } from "../../../Contexts/UserContext"; 
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext";
//import "./CreateEvent.css";

const CreateEvent = () => {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const { goto } = useContext(routerContext);
    const { user } = useContext(UserContext);  
    const { setEvents } = useContext(SelectedTaskContext);  
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [visibility, setVisibility] = useState("PRIVATE");

    const createEventHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = formDataToObj(formData);

        const { title, date, description, location, visibility, image } = data;

        if (!title || !date || !description || !location) {
            setIsError(true);
            setError("All fields are required!");
            return;
        }

        console.log("Event Data:", title, date, description, location, image);

        fetch("http://localhost:8080/event/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ title, date, description, location, visibility }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setEvents(prev=> [...prev, data]);
                    goto("/user/personal-schedule");
                } else {
                    setIsError(true);
                    setError(data.error || "Error creating event.");
                }
            })
            .catch((err) => console.log(err));
    };
    
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        switch (name) {
            case "title":
                setTitle(value);                
                break;
            case "description":
                setDescription(value);                
                break;
            case "date":
                setDate(value);                
                break;
            case "location":
                setLocation(value);                
                break;        
            case "visibility":
                setVisibility(value);            
                break;        
            default:
                break;
        }
    }

    return (
        <div>
            <div className="event-create cont">
                <div className="box">
                    <div className="form">
                        <h2>Create Event</h2>
                        <form onSubmit={createEventHandler}>
                            <input value={title} name="title" type="text" onChange={handleChange} placeholder="Event Title" />
                            <input value={date} name="date" type="date" onChange={handleChange} placeholder="Event Date" />
                            <textarea value={description} name="description" onChange={handleChange} placeholder="Event Description" rows={4}></textarea>
                            <input value={location} name="location" type="text" onChange={handleChange} placeholder="Event Location" />
                            <select name="visibility" value={visibility} onChange={handleChange}>
                                <option value="PUBLIC" selected={visibility === "PUBLIC"}>Public</option>
                                <option value="PRIVATE" selected={visibility === "PRIVATE"}>Private</option>
                            </select>
                            <label htmlFor="image">
                                <span>Upload an event banner (optional)</span>
                                <input name="image" type="file" accept="image/jpg,image/jpeg,image/png" />
                            </label>
                            {isError && (<div className="error">{error}</div>)}
                            <input type="submit" value="Create Event" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
