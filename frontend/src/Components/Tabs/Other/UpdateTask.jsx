import { useContext, useState, useEffect } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext";
import { routerContext } from "../../../Router/Router";
import { formDataToObj } from "../../../Util/FormDataToObj";


const UpdateTask = () => {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const { goto } = useContext(routerContext);
    const {user} = useContext(UserContext);
    const { selectedTask, setTasks } = useContext(SelectedTaskContext);

    const [title,setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [completed, setCompleted] = useState(false);
    const [important, setImportant] = useState(false);
    
    useEffect(() => {
        if (!selectedTask) {
            console.warn("No selected task found, redirecting...");
            goto("user/personal-schedule");
            return; 
          }
        
          setTitle(selectedTask.title || "");
          setDescription(selectedTask.description || "");
          setDate(selectedTask.date?.slice(0, 10) || "");
          setCompleted(selectedTask.isCompleted || false);
          setImportant(selectedTask.isImportant || false);
    }, [selectedTask]);

    const updateTaskHandler = (e) => {
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

        fetch(`http://localhost:8080/task/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ id: selectedTask._id, title, date, description, isCompleted:completed, isImportant:important,}),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setTasks(prev=>{
                        return prev.map(task => {
                            if (task._id === data.task._id) {
                                return data.task;
                            }
                            return task;
                        })
                    })
                    goto("/user/personal-schedule");
                } else {
                    setIsError(true);
                    setError(data.error || "Error updating task.");
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
            case "important":
                setImportant(inputValue);
                break;                            
            default:
                break;
        }
    }

    return (
        <div>
            <div className="task-update cont">
                <div className="box">
                    <div className="form">
                        <h2>Update Task</h2>
                        <form onSubmit={updateTaskHandler}>
                            <input  value={title} name="title" type="text" placeholder="Task Title" onChange={handleChange} />
                            <input value={date}  name="date" type="date" placeholder="Task Date" onChange={handleChange} />
                            <textarea value={description} name="description" placeholder="Task Description" rows={4} onChange={handleChange} ></textarea> 
                            <label htmlFor="completed">Task Completed</label>
                            <input type="checkbox" name="completed" checked={completed} onChange={handleChange} />   
                            <label htmlFor="important">Important</label>
                            <input type="checkbox" name="important" checked={important} onChange={handleChange} />                  
                            {isError && (<div className="error">{error}</div>)}
                            <input type="submit" value="Update Task" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateTask;
