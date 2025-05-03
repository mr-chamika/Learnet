import "./taskDisplay.css";
import editIcon from "../../../Assets/icons/edit.svg";
import deleteIcon from "../../../Assets/icons/delete.svg";
import Link from "../../../Router/Link";
import { useContext } from "../../../../react_lite/createDOM";
import {SelectedTaskContext} from "../../../Contexts/SelectedTaskContext";
import { routerContext } from "../../../Router/Router";

function TaskDisplay({ task, toggleComplete,updatedTask, deleteTask}) {
  const { title, date, description, isCompleted, _id } = task;

  const formattedDate = new Date(date).toLocaleDateString();
  const label = isCompleted ? "Completed" : "Not Completed";
  const className = isCompleted ? "completed" : "incompleted";

  const { setSelectedTask } = useContext(SelectedTaskContext);
  const { goto } = useContext(routerContext);

  const handleEdit = () => {
    setSelectedTask(task);
    goto("/user/personal-schedule/update-task")
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h2 className="task-title">{title}</h2>
        <p className="task-date">{formattedDate}</p>
      </div>

      <div className="task-body">
        <p className="task-description">{description}</p>
      </div>

      <div className="task-footer">
        <button className={`task-button ${className}`} onClick={() => toggleComplete(task)}>
          {label}
        </button>
        <button className="task-button icon" onClick={handleEdit}><img src={editIcon} alt="Edit" /></button>
        <button className=" task-button icon" onClick={() => deleteTask(_id)}><img src={deleteIcon} alt="Delete" /></button>

      </div>
    </div>
  );
}

export default TaskDisplay;


