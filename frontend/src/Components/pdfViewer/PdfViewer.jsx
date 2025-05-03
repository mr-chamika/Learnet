import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";
import { routerContext } from "../../Router/Router";

const PdfViewer = () => {
    const {params} = useContext(routerContext)
    const {user} = useContext(UserContext)
    const {fileId} = params
    const [pdfUrl, setPdfUrl] = useState(null);

    const fetchPdf = async () => {
        // if (!fileId) {
        //     alert("Please enter a File ID");
        //     return;
        // }

        // try {
            const response = await fetch(`http://localhost:8080/file/get`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Accept-Encoding": "br"
                },
                body: JSON.stringify({
                    fileId
                })
            });

            console.log("Content-Encoding:", response.headers.get("content-encoding"));

            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.statusText}`);
            }

            const blob = await response.blob();
            console.log("blog length: ", blob.length)
            console.log("blob", blob)
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        // } catch (error) {
        //     console.error("Error fetching PDF:", error);
        //     alert("Failed to load PDF. Check console for details.");
        // }
    };

    useEffect(()=>{
        if(user.token){
            fetchPdf()    
        }
    }, [user, fileId])

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>PDF Viewer</h2>

            {pdfUrl && (
                <div style={{ marginTop: "20px" }}>
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                        title="PDF Viewer"
                        style={{ border: "1px solid #ccc" }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;
