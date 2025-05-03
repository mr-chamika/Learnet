import { createContext, useContext, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

const LinksContext = createContext({});

let links = {}

export const LinksProvider = ({ children }) => {
    const {user} = useContext(UserContext)
    // const [links, setLinks] = useState({}); // Store links by their IDs

    const fetchLinkById = async (linkId) => {
        console.log("fetching link by id")
        try {
            
            const res = await fetch("http://localhost:8080/link/get", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({linkId})
            })
            return await res.json();
        } catch (err) {
            console.error(`Failed to fetch link with ID ${linkId}:`, err);
            return null;
        }
    };

    const getLinks = async (linkIds) => {
        if(!linkIds || linkIds.length === 0) return []
        const missingIds = linkIds.filter((id) => !links[id]);
        const fetchedLinks = await Promise.all(
            missingIds.map((id) => fetchLinkById(id))
        );

        const validFetchedLinks = fetchedLinks.filter((link) => link !== null);
        const fetchedLinksMap = validFetchedLinks.reduce((acc, link) => {
            acc[link._id] = link;
            return acc;
        }, {});

        // setLinks((prevNotes) => {
        //     return {...prevNotes,...fetchedLinksMap}
        // })

        links = {...links, ...fetchedLinksMap}

        return linkIds.map((id) => links[id] || fetchedLinksMap[id]);
    };

    return (
        <LinksContext.Provider value={{ links, getLinks}}>
            {children}
        </LinksContext.Provider>
    );
};

export const useLinks = () => {
    return useContext(LinksContext);
};
