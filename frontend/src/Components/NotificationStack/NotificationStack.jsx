import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { NotificationsContext } from "../../Contexts/NotificationsContext";
import "./NotificationStack.css"; // Import the styles

const NotificationStack = () => {
//   const [notifications, setNotifications] = useState([{ id: Date.now(), message: "Hello world" }, { id: Date.now(), message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae voluptas ab amet provident doloribus aperiam quaerat molestiae accusantium iure reprehenderit nobis ullam quod at vitae, enim qui consequatur porro sequi." }, ]);
const {notifications, setNotifications} = useContext(NotificationsContext)
  // Function to add a notification
//   const addNotification = (message) => {
//     setNotifications((prev) => [...prev, { id: Date.now(), message }]);
//   };

  // Automatically remove the oldest notification after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1)); // Remove the oldest notification
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Function to manually remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      {/* Button to trigger notifications */}
      {/* <button onClick={() => addNotification("New Notification!")} className="trigger-btn">
        Show Notification
      </button> */}

      {/* Notification Container */}
      <div className="notification-container">
        {notifications.slice(-3).map((notif) => (
          <div key={notif.id} className="notification">
            <p>{notif.message}</p>
            <button className="close-btn" onClick={() => removeNotification(notif.id)}>
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationStack;
