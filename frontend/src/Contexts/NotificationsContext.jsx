import { createContext, useState } from "../../react_lite/createDOM";

export const NotificationsContext = createContext({})

const NotificationsContextProvider = ({children}) => {

    const [notifications, setNotifications] = useState([])

    const addNotification = (message) => {
        setNotifications((prev) => [...prev, { id: Date.now(), message }]);
      };

    return ( 
        <NotificationsContext.Provider value={{notifications, setNotifications, addNotification}}>
            {children}
        </NotificationsContext.Provider>
     );
}
 
export default NotificationsContextProvider;