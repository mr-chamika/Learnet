import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { useVideos } from "../../Contexts/VideosContext";
import Link from "../../Router/Link";

const Video = () => {

    const {goto, params} = useContext("router")
    const {id} = params
    const {fetchVideoById, videos} = useVideos()
    const [url, setUrl] = useState("")
    console.log("url : ", url)
    // useEffect(()=>{
    //     setTimeout(() => { // goto canot be used directly inside the useEffect callback
    //         if(!url){
    //             goto("/user/personal-folder")
    //         }
    //     }, 10);
    // }, [url])

    const convertToEmbedUrl = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return null; // Return null if the URL is not valid
    };
    
    const getWatchUrl = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/watch?v=${match[1]}`;
        }
        return null; // Return null if the URL is not valid
    };

    useEffect(()=>{
        async function get(){
            const video = await fetchVideoById(id)
            console.log('video : ', id, video)
            if(video){
                setUrl(video.link)
            }
        }

        get()
    }, [id])

    const embedUrl = convertToEmbedUrl(url);
    const watchUrl = getWatchUrl(url);

    return (
        <div className="body">
            video
            { url && embedUrl &&
                (
                    <div>
                        <iframe
                            width="560"
                            height="315"
                            src={embedUrl}
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                        >
                        </iframe>
                        <Link to="/user/personal-folder" label="go back" />
                    </div>
                )
            }
            { url && watchUrl &&
                (
                    <div>
                        <p>Embedding not supported for this video. <a href={watchUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
                    </div>
                )
            }
            {
                !url && (
                    <div className="error">
                        <span>Did you refresh the page? Go back to the personal folder and click on the video again</span>
                        <br />
                        <Link to="/user/personal-folder" label="go back" />
                    </div>
                )
            }
        </div>
    );
}

export default Video;