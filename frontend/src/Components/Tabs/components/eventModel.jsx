import "./Calendar.css";

const EventModal = ({ event, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event?.date || "");
  const [time, setTime] = useState(event?.time || "");
  const [color, setColor] = useState(event?.color || "#ff0000");

  const handleSave = () => {
    onSave({ ...event, title, date, time, color });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{event ? "Edit Event" : "Add Event"}</h3>
        <div className="modal-field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
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
          {event && <button onClick={() => onDelete(event.id)}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
