import { createContext, useContext, useEffect, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

const VideoContext = createContext({});

let videos = {}

export const VideoProvider = ({ children }) => {
    const {user} = useContext(UserContext)
    // const [videos, setVideos] = useState({}); // Store videos by their IDs

    const fetchVideoById = async (videoId) => {
        console.log("fetching video by id")
        try {
            
            const res = await fetch("http://localhost:8080/video/get", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({videoId})
            })
            return await res.json();
        } catch (err) {
            console.error(`Failed to fetch video with ID ${videoId}:`, err);
            return null;
        }
    };

    const getVideos = async (videoIds) => {
        if(!videoIds || videoIds.length === 0) return []
        const missingIds = videoIds.filter((id) => !videos[id]);
        const fetchedVideos = await Promise.all(
            missingIds.map((id) => fetchVideoById(id))
        );

        const validFetchedVideos = fetchedVideos.filter((video) => video !== null);
        const fetchedVideosMap = validFetchedVideos.reduce((acc, video) => {
            acc[video._id] = video;
            return acc;
        }, {});

        // setVideos((prevNotes) => {
        //     return {...prevNotes,...fetchedVideosMap}
        // })

        videos = {...videos, ...fetchedVideosMap}

        return videoIds.map((id) => videos[id] || fetchedVideosMap[id]);
    };

    return (
        <VideoContext.Provider value={{ videos, getVideos}}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideos = () => {
    return useContext(VideoContext);
};
