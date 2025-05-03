import { createContext, useContext, useEffect, useReducer, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

export const FriendsContext = createContext({})

const friendsReducer = (state, action) => {
    console.log("firends object : ", { ...state })
    switch (action.type) {
        case "set-all":
            return action.payload
        case "send":
            state.friendRequestsSent.push(action.payload)
            console.log("firends object : ", { ...state })
            return { ...state }
        case "cancel":
            state.friendRequestsSent = state.friendRequestsSent.filter(v => v != action.payload)
            console.log("firends object : ", { ...state })
            return { ...state }
        case "accept":
            state.friendRequestsReceived = state.friendRequestsReceived.filter(v => v != action.payload)
            state.friends.push(action.payload)
            console.log("firends object : ", { ...state })
            return { ...state }
        case "reject":
            state.friendRequestsReceived = state.friendRequestsReceived.filter(v => v != action.payload)
            console.log("firends object : ", { ...state })
            return { ...state }

    }
}

const FriendsContextProvider = ({ children }) => {

    const [friends, friendsDispatcher] = useReducer(friendsReducer, {})
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (user) {
            fetch("http://localhost:8080/friends/get-user-friends", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
            })
                .then((res) => res.json())
                .then((data) => {

                    console.log("friends data : ", data)
                    if (data && !data.error) {
                        friendsDispatcher({ type: "set-all", payload: data })
                    }
                })
        }
    }, [user])

    console.log("friends object : ", friends)

    return (
        <FriendsContext.Provider value={{ friends: friends.friends, requestsSent: friends.friendRequestsSent, requestsReceived: friends.friendRequestsReceived, friendsDispatcher }}>
            {children}
        </FriendsContext.Provider>
    );
}

export default FriendsContextProvider;