import { useContext, useState } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import { routerContext } from "../../../Router/Router";
import { formDataToObj } from "../../../Util/FormDataToObj";
//import "./CreateEvent.css";

const CreateTask = () => {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const { goto } = useContext(routerContext);
    const {user} = useContext(UserContext);

    const [title,setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [completed, setCompleted] = useState(false);
    const [important, setImportant] = useState(false);    

    const createTaskHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = formDataToObj(formData);

        const completed = data.completed === "on";
        const important = data.important === "on";

        const { title, date, description } = data;

        if (!title || !date || !description ) {
            setIsError(true);
            setError("Title, Date and Description fields are required!");
            return;
        }

        console.log("Sending Task Data:",title, date, description, completed, important );

        fetch("http://localhost:8080/task/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ title, date, description, completed, important}),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data._id) {
                    goto("/user/personal-schedule");
                } else {
                    setIsError(true);
                    setError(data.error || "Error creating task.");
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
            case "completed":
                setCompleted(checked);
                break;
            case "important":
                setImportant(checked);
                break;                            
            default:
                break;
        }
    }

    return (
        <div>
            <div className="task-create cont">
                <div className="box">
                    <div className="form">
                        <h2>Create Task</h2>
                        <form onSubmit={createTaskHandler}>
                            <input  value={title} name="title" type="text" placeholder="Task Title" onChange={handleChange} />
                            <input value={date}  name="date" type="date" placeholder="Task Date" onChange={handleChange} />
                            <textarea value={description} name="description" placeholder="Task Description" rows={4} onChange={handleChange} ></textarea> 
                            <label htmlFor="completed">Task Completed</label>
                            <input type="checkbox" name="completed" checked={completed} onChange={handleChange} />   
                            <label htmlFor="important">Important</label>
                            <input type="checkbox" name="important" checked={important} onChange={handleChange} />                  
                            {isError && (<div className="error">{error}</div>)}
                            <input type="submit" value="Create Task" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
