import { useEffect, useState } from "../../../../react_lite/createDOM";
import Link from "../../../Router/Link";
import TaskDisplay from "./taskDisplay";
import { UserContext } from "../../../Contexts/UserContext";
import { useContext } from "../../../../react_lite/createDOM";
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext";

function TasksComponent ()  {
  // const [tasks, setTasks] = useState([]);
  //const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const {tasks, setTasks} = useContext(SelectedTaskContext);
  
  // const fetchTasks = () => {
  //   //if (!user?.token) return;
  //   //setLoading(true);

  //   fetch("http://localhost:8080/task/all", {
  //     method: "POST",
  //     headers:{
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${user.token}`,
  //     },
  //   })
  //   .then((res) => res.json())
  //   .then((data)=>{
  //     console.log("Tasks fetched:",data);
  //     const taskList = Array.isArray(data) ? data : [];
  //     setTasks(taskList);
  //   })
  //   .catch((err) => {
  //     console.error("Fetch tasks error",err);
  //     setTasks([]);
  //   })
  //   //.finally(() => {setLoading(false)});
  // };

  // useEffect(() => {
  //   fetchTasks();
  // }, [user]);
  
  const toggleTaskComplete = (task) => {
    fetch(`http://localhost:8080/task/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ id: task._id, isCompleted: !task.isCompleted }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((t) => {
            console.log("Task:",t,"Data:",data, t._id === data.task._id);
            if (t._id === data.task._id) {
              return data.task;
            }
            return t;
          });
          return [...updatedTasks];
        })
      })
      .catch((err) => console.error("Toggle complete failed:", err));
  }; 

  const updatedTask = (updated) => {
    fetch(`http://localhost:8080/task/update?id=${updated._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updated),
    })
    .then((res) => res.json())
    .then(() =>{
      fetchTasks()
      .catch((err) => console.error("Update task failed:", err));
    });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/task/delete`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ id }),
    })
    .then((res) => res.json())
    .then(() => {
      // fetchTasks()
      // TODO : remove the task from the state instead of refetching
      setTasks((prevTasks) => {
        const x = [...prevTasks.filter((task) =>task._id !== id)];
        console.log(prevTasks,x);
        return x
      });
    })
    .catch((err) => console.error("Delete task failed:", err));
  };

  return (
    <div>
      <div>
      <div className="topbar">
          <div className="right">
            <Link className="icon-button" to="/user/personal-schedule/create-task" label="Create Task" />
          </div>
        </div>
        <div className="component-inner-container tasks-container component-scroll">
          {
              tasks.map((task)=>{
                  return (
                      <TaskDisplay task={task} key={task._id} updatedTask={updatedTask} deleteTask={deleteTask} toggleComplete={toggleTaskComplete}  />
                  )
              })
          }
        </div>
  </div>
  </div>
  );
};

export default TasksComponent;

/*

  
  
  
  
  
  
  <div className="topbar">
          <div className="right">
            <Link className="icon-button" to="/user/personal-schedule/create-task" label="Create Task" />
          </div>
        </div>
        <div className="component-inner-container tasks-container component-scroll">
        {loading ? (
          <div>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          tasks.map((task, i) => (
            <TaskDisplay
              key={i}
              task={task}
              updatedTask={updatedTask}
              deleteTask={deleteTask}
              toggleTaskComplete={toggleTaskComplete}
            />
          ))
        )}
        </div>
  */