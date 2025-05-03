import { createContext, useContext, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

const NotesContext = createContext({});

let notes = {}

export const NotesProvider = ({ children }) => {
    const {user} = useContext(UserContext)
    // const [notes, setNotes] = useState({}); // Store notes by their IDs

    const fetchNoteById = async (noteId) => {
        console.log("fetching note by id")
        try {
            
            const res = await fetch("http://localhost:8080/note/get", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({noteId})
            })
            return await res.json();
        } catch (err) {
            console.error(`Failed to fetch note with ID ${noteId}:`, err);
            return null;
        }
    };

    const getNotes = async (noteIds) => {
        if(!noteIds || noteIds?.length === 0) return []
        const missingIds = noteIds.filter((id) => !notes[id]);
        const fetchedNotes = await Promise.all(
            missingIds.map((id) => fetchNoteById(id))
        );

        const validFetchedNotes = fetchedNotes.filter((note) => note !== null);
        const fetchedNotesMap = validFetchedNotes.reduce((acc, note) => {
            acc[note._id] = note;
            return acc;
        }, {});

        // setNotes((prevNotes) => {
        //     return {...prevNotes,...fetchedNotesMap}
        // })

        notes = {...notes, ...fetchedNotesMap}

        return noteIds.map((id) => notes[id] || fetchedNotesMap[id]);
    };

    return (
        <NotesContext.Provider value={{ notes, getNotes}}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    return useContext(NotesContext);
};
