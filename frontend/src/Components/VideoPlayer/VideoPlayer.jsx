import { useContext, useEffect, useLayoutEffect, useRef, useState } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";

const VideoPlayer = ({ videoUrl2 }) => {
    // const videoUrl = "http://localhost:8080/user/video"
    // const videoRef = useRef()
    // const mediaSourceRef = useRef()
    // const sourceBufferRef = useRef()
    // const currentChunk = useRef()

    // const [chunkSize] = useState(1024 * 1024); // 1 MB chunk size
    // const [totalFileSize, setTotalFileSize] = useState(0);
    // const [url, setUrl] = useState("")
    

    

    // const ms = new MediaSource();
    // ms.addEventListener("sourceopen", async () => {
    //     console.log('MediaSource is now open, and sourceBuffer is ready to accept data');
    //     const sourceBuffer = ms.addSourceBuffer("video/mp4; codecs=\"avc1.42E01E\"");
    //     const response = await fetch("http://localhost:8080/user/video");
    //     const data = await response.arrayBuffer();
    //     sourceBuffer.appendBuffer(data);
    // });

    // document.querySelector("video").src = URL.createObjectURL(mediaSource)
    // const sb = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"')
    // const response = await fetch("http://localhost:8080/user/video");
    // const data = await response.arrayBuffer();


    //2
    // const video = document.querySelector('video');
    // const mediaSource = new MediaSource();
    // video.src = URL.createObjectURL(mediaSource);

    // mediaSource.addEventListener('sourceopen', async () => {
    //     const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
    //     const url = 'http://localhost:8080/user/video'; // Your backend endpoint

    //     // Fetch the first chunk
    //     const response = await fetch(url, {
    //         headers: { range: 'bytes=0-999999' }, // Adjust range as needed
    //     });
    //     const data = await response.arrayBuffer();

    //     // Append data to the SourceBuffer
    //     sourceBuffer.appendBuffer(data);

    //     sourceBuffer.addEventListener('updateend', () => {
    //         // Fetch and append more chunks as needed
    //     });
    // });
    // useEffect(()=>{
    //     const mediaSource = new MediaSource();
        
    //     mediaSourceRef.current = mediaSource;

    //     mediaSource.addEventListener("sourceopen", async () => {
    //         console.log('MediaSource is now open, and sourceBuffer is ready to accept data');
    //         const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
    //         sourceBufferRef.current = sourceBuffer;

    //         sourceBuffer.addEventListener('error', (event) => {
    //             console.error('SourceBuffer encountered an error:', event);
            
    //             // Log detailed information about the SourceBuffer
    //             console.error('SourceBuffer state:', sourceBuffer.readyState);
    //             console.error('SourceBuffer updating:', sourceBuffer.updating);
    //             console.error('SourceBuffer appendWindowStart:', sourceBuffer.appendWindowStart);
    //             console.error('SourceBuffer appendWindowEnd:', sourceBuffer.appendWindowEnd);
    //             // console.error('SourceBuffer buffered:', sourceBuffer.buffered);
            
    //             // Log more information about the error event
    //             console.error('Error event details:');
    //             console.log('Error type:', event.type);
    //             console.log('Is this event trusted?', event.isTrusted);
    //             console.log('Current target:', event.currentTarget);
    //             console.log('Target:', event.target);
                
    //             // If the error is related to buffer overrun or memory issues
    //             if (event.message) {
    //                 console.error('Error message:', event.message);
    //             }
                
    //             // Check for detailed status codes or error codes if available
    //             if (event.error) {
    //                 console.error('Error details:', event.error);
    //             }
            
    //             // If possible, log any relevant stack trace
    //             if (event.error && event.error.stack) {
    //                 console.error('Error stack trace:', event.error.stack);
    //             }
    //         });

    //         // Load the initial chunk
    //         await fetchChunk(0, sourceBuffer);
    //         // setTimeout(() => {
    //         //     // currentChunk.current++
    //         //     fetchChunk(currentChunk.current);
    //         // }, 3000);
    //         currentChunk.current = 0

    //         // sourceBuffer.addEventListener('updateend', () => {
    //         //     console.log('Chunk appended, ready for the next one');
    //         //     // Fetch the next chunk once the current chunk is appended
    //         //     if (!sourceBuffer.updating) {
    //         //         currentChunk.current++
    //         //         fetchChunk(currentChunk.current);
    //         //     }
    //         // });
    //     });

        // setUrl(URL.createObjectURL(mediaSource))

        // Cleanup
        // return () => {
        //     if (mediaSourceRef.current) {
        //         mediaSourceRef.current.removeEventListener("sourceopen", fetchChunk);
        //     }
        // };
    // }, [videoUrl])

    // useLayoutEffect((element) => {
    //     setTimeout(()=>{
    //         const videos = document.querySelectorAll("video");
    //         console.log("element : ", element, videos)
    //         console.log("gg : ", MediaSource.isTypeSupported("video/mp4"))
        
    //         // if (MediaSource.isTypeSupported("video/mp4")) {
    //             const mediaSource = mediaSourceRef.current
    
    //             videos.forEach(video=>{
    //                 video.src = URL.createObjectURL(mediaSource);
    //             })
    
    //             mediaSource.addEventListener("sourceopen", () => {
    //                 const sourceBuffer = mediaSource.addSourceBuffer("video/mp4; codecs=\"avc1.42E01E\"");
    //                 sourceBufferRef.current = sourceBuffer;
    
    //                 // Load the initial chunk
    //                 fetchChunk(0);
    //             });
    //         // }
    //     }, 10000)

    //     // Cleanup
    //     return () => {
    //         if (mediaSourceRef.current) {
    //             mediaSourceRef.current.removeEventListener("sourceopen", fetchChunk);
    //         }
    //     };
    // }, [videoUrl]);

    // const fetchChunk = async (start, sourceBuffer) => {
    //     console.log("fetching video ===============")
    //     const response = await fetch(videoUrl, {
    //         method: "GET",
    //         headers: {
    //             // Range: `bytes=${start}-${start + chunkSize - 1}`,
    //         },
    //     });


    //     const data = await response.arrayBuffer();
    //     console.log("data binary ---- : ", data)
    //     // const contentRange = response.headers.get("Content-Range")
    //     // const [range, totalSize] = contentRange.split("/")
    //     // const end = parseInt(range.split("-")[1], 10)

    //     // setTotalFileSize(parseInt(totalSize, 10));
    //     // currentChunk.current = end + 1

    //     console.log(sourceBufferRef)
    //     // sourceBufferRef.current.appendBuffer(data);
    //     sourceBuffer.appendBuffer(data)
    // };

    // const handleSeek = (e) => {
    //     // const video = videoRef.current;
    //     const video = e.target

    //     // Check if the requested time is already buffered
    //     const buffered = video.buffered;
    //     const currentTime = video.currentTime;

    //     for (let i = 0; i < buffered.length; i++) {
    //         if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
    //             return; // Already buffered
    //         }
    //     }

    //     // Calculate byte range for the requested time
    //     const start = Math.floor((currentTime / video.duration) * totalFileSize);
    //     // fetchChunk(start);
    // };


    const {user} = useContext(UserContext)
    const [videoUrl, setVideoUrl] = useState("")
    
    useEffect(()=>{
        fetch("http://localhost:8080/user/video", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`,
                Range: `bytes=0-`
            }
        })
        .then(res=>res.blob())
        .then(blob=>{
            const url = URL.createObjectURL(blob)
            setVideoUrl(url)
        })
    }, [])

//     const videoRef = useRef(null);
//   const mediaSourceRef = useRef(new MediaSource());
//   const [sourceBuffer, setSourceBuffer] = useState(null);
//   const jwtToken = "your-jwt-token-here"; // Replace with actual JWT
//   const videoUrl = URL.createObjectURL(mediaSourceRef.current);

//   useEffect(() => {
//     const mediaSource = mediaSourceRef.current;

//     mediaSource.addEventListener("sourceopen", () => {
//       const buffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
//     //   setSourceBuffer(buffer);
//       fetchAndAppend(0, buffer, mediaSource); // Start fetching
//     });

//     return () => {
//       URL.revokeObjectURL(videoUrl); // Cleanup when component unmounts
//     };
//   }, []);

//   const fetchAndAppend = async (startByte, buffer, mediaSource) => {
//     try {
//       const response = await fetch("http://localhost:8080/user/video", {
//         // method: "POST",
//         // headers: {
//         //   Authorization: `Bearer ${jwtToken}`,
//         // //   Range: `bytes=${startByte}-`, // Request next chunk
//         // },
//       });

//       if (!response.ok) throw new Error("Failed to load video");

//       const data = await response.arrayBuffer();
//       buffer.appendBuffer(data);

    //   buffer.addEventListener("updateend", () => {
    //     if (!mediaSource.ended) {
    //       fetchAndAppend(startByte + data.byteLength, buffer, mediaSource); // Fetch next chunk
    //     }
    //   });
    // } catch (error) {
    //   console.error("Error fetching video:", error);
    // }
//   };

    return (
        <video
            src={videoUrl}
            controls={true}
        ></video>
    );
};

export default VideoPlayer;
