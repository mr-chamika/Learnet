// src/Contexts/SelectedTaskContext.jsx
import { createContext, useContext, useEffect, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

const SelectedTaskContext = createContext({});

export const SelectedTaskProvider = ({ children }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if(user?.token){
            fetch("http://localhost:8080/task/all", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => res.json())
            .then((data)=>{
                console.log("Tasks fetched:",data);
                const taskList = Array.isArray(data) ? data : [];
                setTasks(taskList);
            })
            .catch((err) => {
                console.error("Fetch tasks error",err);
                setTasks([]);
            })

            fetch("http://localhost:8080/event/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Events fetched:", data);
                const eventList = Array.isArray(data) ? data : [];
                setEvents(eventList);
            })
            .catch((err) => {
                console.error("Fetch events error", err);
                setEvents([]);
            });
        }
    }, [user]);

    return (
        <SelectedTaskContext.Provider value={{ events, setEvents, tasks, setTasks, selectedTask, setSelectedTask, selectedEvent, setSelectedEvent }}>
            {children} 
        </SelectedTaskContext.Provider>
    );
};

// export const useSelectedTask = () => {
//     return useContext(SelectedTaskContext);
// };

export {SelectedTaskContext};