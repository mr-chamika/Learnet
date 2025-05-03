import "./Calendar.css";

const TaskModal = ({ task, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [date, setDate] = useState(task?.date || "");
  const [time, setTime] = useState(task?.time || "");
  //const [color, setColor] = useState(task?.color || "#ff0000");

  const handleSave = () => {
    onSave({ ...task, title, date, time });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{task ? "Edit task" : "Add task"}</h3>
        <div className="modal-field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="task Title"
          />
        </div>
        <div className="modal-field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
          {task && (<button onClick={() => onDelete(task.id)}>Delete</button>)}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
