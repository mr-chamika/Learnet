import { useContext, useRef, useState } from "../../../../react_lite/createDOM";
import emoji from "../../../Assets/icons/emoji.png"
import attachmentIcon from "../../../Assets/icons/attachment.png"
import crossIcon from "../../../Assets/icons/cross.png"
import fileIcon from "../../../Assets/icons/PersonalFolder/file.png"
import sendIcon from "../../../Assets/icons/send.png"
import { UserContext } from "../../../Contexts/UserContext";
import { formDataToObj } from "../../../Util/FormDataToObj";

const ChatInputBox = ({currentChat, socket}) => {

    const {user} = useContext(UserContext)

    const emojiHexCodes = [
        "1F600", "1F602", "1F603", "1F604", "1F605", "1F606", "1F609", "1F60A", "1F60B", "1F60C",
        "1F60D", "1F60E", "1F60F", "1F612", "1F613", "1F614", "1F616", "1F618", "1F61A", "1F61C",
        "1F61D", "1F61E", "1F620", "1F621", "1F622", "1F623", "1F624", "1F625", "1F628", "1F629",
        "1F62A", "1F62B", "1F62D", "1F630", "1F631", "1F632", "1F633", "1F634", "1F635", "1F637",
        "1F641", "1F642", "1F643", "1F644", "1F910", "1F912", "1F914", "1F917", "1F920", "1F923",
        "1F924", "1F927", "1F929", "1F92A", "1F92B", "1F92D", "1F92E", "1F92F", "1F970", "1F973",
        "1F974", "1F975", "1F976", "1F97A", "1F97C", "1F9D0", "1F9D1", "1F9D2", "1F9D3", "1F9D4",
        "1F9D5", "1F9D9", "1F9DA", "1F9DB", "1F9DC", "1F9DD", "1F9DE", "1F9DF", "1F9E0", "1F9E1",
        "1F9E2", "1F9E3", "1F9E4", "1F9E5", "1F9E6", "1F9E7", "1F9E8", "1F9E9", "1F9EA", "1F9EB",
        "1F9EC", "1F9ED", "1F9EE", "1F9EF", "1F9F0", "1F9F1", "1F9F2", "1F9F3", "1F9F4", "1F9F5"
      ];
      
    const addEmoji = (hex) => {
        // const inputField = document.querySelector(".chat .messages-cont input").value += String.fromCodePoint(parseInt(hex, 16))
        const inputField = document.querySelector(".chat .messages-cont input[type='text']")
        const startPos = inputField.selectionStart;
        const endPos = inputField.selectionEnd;

        const beforeCursor = inputField.value.substring(0, startPos);
        const afterCursor = inputField.value.substring(endPos)

        // console.log(startPos, endPos, beforeCursor, afterCursor)

        inputField.value = beforeCursor + String.fromCodePoint(parseInt(hex, 16)) + afterCursor;

        inputField.focus()
        
        showEmojiGrid()
    }
    
    const showEmojiGrid = () => {
        document.querySelector(".chat .messages-cont .emojies-container").classList.toggle("show")
        const inputField = document.querySelector(".chat .messages-cont input")
        inputField.focus()
    }

    const showAttachmentInput = () => {
        document.querySelector(".chat .messages-cont .attachment-input").classList.toggle("show")
    }

    const [files, setFiles] = useState([])

    // function addFile(e){
    //     const files = e.target.files
    //     const fl = new FileList()
    //     fl.
    //     console.log("files : ", files)
    //     setFiles
    // }

    function sendMessage(e){
        e.preventDefault();

        if(currentChat && currentChat.chat){
            const fd = new FormData(e.target)
            const data = formDataToObj(fd)

            const formData = new FormData()
            files.forEach((file, index) => {
                formData.append(`attachments`, file);
            });
            formData.append("chatType", "GROUP")
            formData.append("groupId", currentChat.chat._id)

            // console.log("entries : ", Array.from(formData.entries()))
    
            // console.log("data : ", data)
            if(files.length > 0){
                fetch("http://localhost:8080/file/create-chatfile", {
                    method: "POST",
                    headers: {
                        authorization: `bearer ${user.token}`,
                    },
                    body: formData
                })  
                .then(res=>res.json())
                .then(resData=>{
                    if(!resData.error){
                        if(currentChat?.type === "chat"){
                            socket.send(JSON.stringify({
                                type: "message",
                                data: {
                                    receiverUserId: user.userId === currentChat?.chat.userId1 ? currentChat?.chat.userId2 : currentChat?.chat.userId1,
                                    message: data.message,
                                    fileIds: resData.fileIds
                                }
                            }))
                        }else{
                            console.log("send group message ............")
                            socket.send(JSON.stringify({
                                type: "send-group-message",
                                data: {
                                    groupId: currentChat.chat._id,
                                    type: "text",
                                    message: data.message,
                                    fileIds: resData.fileIds
                                }
                            }))
                        }
                    }
                })
                .catch(err=>console.log("Error: ", err))
            }else{
                if(currentChat?.type === "chat"){
                    socket.send(JSON.stringify({
                        type: "message",
                        data: {
                            receiverUserId: user.userId === currentChat?.chat.userId1 ? currentChat?.chat.userId2 : currentChat?.chat.userId1,
                            message: data.message,
                        }
                    }))
                }else{
                    console.log("send group message ............")
                    socket.send(JSON.stringify({
                        type: "send-group-message",
                        data: {
                            groupId: currentChat.chat._id,
                            type: "text",
                            message: data.message,
                        }
                    }))
                }
            }

    
            
            // e.target.reset()
        }
    }

    return ( 
        <div className="chat-input">
            <form onSubmit={sendMessage}>
                <div className="input-area">
                    <div className="chat-input-buttons">
                        <img className="emoji-button" src={emoji} onClick={showEmojiGrid}/>
                        <FileAttachmentComponent onFilesChange={setFiles} />
                        {/* <div className="itemfield">
                            <label htmlFor="file-input">
                                <img src={attachmentIcon} className='itemfield-image' alt="" />
                            </label>
                            <input name="file" type="file" id='file-input' accept="image/jpg,image/png,image/jpeg" title="profile picture"/>
                        </div> */}
                    </div>
                    <input type="text" name="message" value="" placeholder="Enter your message here" />
                    <div className="emojies-container">
                        <div className="emojies">
                            {emojiHexCodes.map(hex=>{
                                return (
                                    <div className="emoji" onClick={()=>addEmoji(hex)}>{`&#x${hex};`}</div>
                                )    
                            })}
                        </div>
                    </div>
                    {/* <div className="attachment-input">
                        <div className="attachments">

                        </div>
                    </div> */}
                </div>
                <button type="submit">
                    <img src={sendIcon} />
                </button>
            </form>
        </div>
     );
}

// const AttachmentBox = ({onFilesChange}) => {

//     const [attachments, setAttachments] = useState([]);

//     const handleFileChange = (e) => {
//         const newFiles = Array.from(e.target.files);
//         if (newFiles.length > 0) {
//           const updatedAttachments = [...attachments, ...newFiles];
//           setAttachments(updatedAttachments);
//           onFilesChange(updatedAttachments);
//         }
//         e.target.value = ''; // Reset input to allow selecting same files again
//     };

//     return (
//         <div className="attachment">
//             <div className="attachment-left">
//                 <img src={fileIcon} />
//             </div>
//             <div className="attachment-right">
//                 <div className="title">file name</div>
//                 <div className="file-size">23.5KB</div>
//             </div>
//         </div>
//     );
// }

// import { FiPaperclip, FiX, FiCheck } from 'react-icons/fi';
import './FileAttachmentComponent.css';

const FileAttachmentComponent = ({ onFilesChange }) => {
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleButtonClick = () => {
    const input = document.querySelector('.file-attachment-container input[type="file"]')
    input.click()
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      const updatedAttachments = [...attachments, ...newFiles];
      setAttachments(updatedAttachments);
      onFilesChange(updatedAttachments);
    }
    e.target.value = ''; // Reset input to allow selecting same files again
  };

  const handleRemoveFile = (index) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
    onFilesChange(updatedAttachments);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const updatedAttachments = [...attachments, ...droppedFiles];
      setAttachments(updatedAttachments);
      onFilesChange(updatedAttachments);
    }
  };

  return (
    <div className="file-attachment-container">
      <div 
        className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button 
            className="attach-button"
            onClick={handleButtonClick}
        >
          <img src={attachmentIcon} />
        </button>
        <span className="drop-hint">Drag & drop files here</span>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={true}
          style={{display: "none"}}
        />
      </div>

      {attachments.length > 0 && (
        <div className="attachments-list-container">
            <div className="message">By uploading files, you confirm you have the right to share them.</div>
            <div className="attachments-list">
            {attachments.map((file, index) => (
                <div key={`${file.name}-${index}`} className="attachment-item">
                <span className="file-name">
                    <img src={fileIcon} />
                    <span>{file.name}</span>
                </span>
                <button 
                    className="remove-button"
                    onClick={() => handleRemoveFile(index)}
                    aria-label={`Remove ${file.name}`}
                >
                    <img src={crossIcon} />
                </button>
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};
 
export default ChatInputBox;