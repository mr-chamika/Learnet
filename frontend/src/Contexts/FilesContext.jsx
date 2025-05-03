import { createContext, useContext, useState } from "../../react_lite/createDOM";
import { UserContext } from "./UserContext";

const FilesContext = createContext({});

let files = {}

export const FilesProvider = ({ children }) => {
    const {user} = useContext(UserContext)
    // const [files, setFiles] = useState({}); // Store files by their IDs

    const fetchFileById = async (fileId) => {
        console.log("fetching file by id")
        try {
            
            const res = await fetch("http://localhost:8080/file/get-info", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({fileId})
            })
            return await res.json();
        } catch (err) {
            console.error(`Failed to fetch file with ID ${fileId}:`, err);
            return null;
        }
    };

    const getFiles = async (fileIds) => {
        if(!fileIds || fileIds?.length === 0) return []
        const missingIds = fileIds.filter((id) => !files[id]);
        const fetchedFiles = await Promise.all(
            missingIds.map((id) => fetchFileById(id))
        );

        const validFetchedFiles = fetchedFiles.filter((file) => file !== null);
        const fetchedFilesMap = validFetchedFiles.reduce((acc, file) => {
            acc[file._id] = file;
            return acc;
        }, {});

        // setFiles((prevFiles) => {
        //     return {...prevFiles,...fetchedFilesMap}
        // })

        files = {...files, ...fetchedFilesMap}

        return fileIds.map((id) => files[id] || fetchedFilesMap[id]);
    };

    return (
        <FilesContext.Provider value={{ files, getFiles}}>
            {children}
        </FilesContext.Provider>
    );
};

export const useFiles = () => {
    return useContext(FilesContext);
};
