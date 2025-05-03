import { useContext, useEffect, useRef } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";
import Link from "../../Router/Link";
import { routerContext } from "../../Router/Router";
import "./CreateNote.css"

const CreateNote = () => {

    // Get the user's current text selection
    function getSelectionRange() {
        const selection = window.getSelection();
        return selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    // Apply bold, italic, underline using Range API by wrapping selected text
    function formatText(style) {
        const range = getSelectionRange();
        if (!range) return;

        const span = document.createElement('span');
        span.style.fontWeight = style === 'bold' ? 'bold' : '';
        span.style.fontStyle = style === 'italic' ? 'italic' : '';
        span.style.textDecoration = style === 'underline' ? 'underline' : '';

        range.surroundContents(span);  // Surround the selected text with the span tag
    }

    // Align text left, center, or right by modifying the parent block element
    function alignText(alignment) {
        const range = getSelectionRange();
        if (!range) return;

        const parentElement = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer;

        parentElement.style.textAlign = alignment;
    }

    // Insert ordered or unordered list based on selection
    function insertOrderedList() {
        const range = getSelectionRange();
        if (!range) return;

        const list = document.createElement('ol');
        const li = document.createElement('li');
        li.textContent = range.toString();  // Set list item content to selected text
        list.appendChild(li);
        range.deleteContents();  // Clear the current selection content
        range.insertNode(list);  // Insert the ordered list
    }

    function insertUnorderedList() {
        const range = getSelectionRange();
        if (!range) return;

        const list = document.createElement('ul');
        const li = document.createElement('li');
        li.textContent = range.toString();  // Set list item content to selected text
        list.appendChild(li);
        range.deleteContents();  // Clear the current selection content
        range.insertNode(list);  // Insert the unordered list
    }

    // Change selected text color
    function changeTextColor(color) {
        const range = getSelectionRange();
        if (!range) return;

        const span = document.createElement('span');
        span.style.color = color;
        range.surroundContents(span);
    }

    // Change background color of selected text
    function changeBackgroundColor(color) {
        const range = getSelectionRange();
        if (!range) return;

        const span = document.createElement('span');
        span.style.backgroundColor = color;
        range.surroundContents(span);
    }

    // Insert a link with the URL provided by the user
    function insertLink() {
        const url = prompt('Enter the URL:');
        const name = prompt('Enter the name of the URL:')
        if (!url) return;

        const range = getSelectionRange();
        if (!range) return;

        const a = document.createElement('a');
        a.href = url;
        a.textContent = range.toString();
        a.innerHTML = name
        range.deleteContents();  // Remove selected text
        range.insertNode(a);  // Insert the link
    }

    // Undo and redo functionality using the native execCommand (still supported in most browsers)
    function undo() {
        document.execCommand('undo', false, null);
    }

    function redo() {
        document.execCommand('redo', false, null);
    }

    const textColorInput = useRef(null, ".text-color")
    const backgroundColorInput = useRef(null, ".background-color")

    const {params} = useContext(routerContext)
    const {user} = useContext(UserContext)
    const {noteId} = params
    function save(){
        const editor = document.getElementById("editor")
        if(!noteId){
            alert("Note cannot be found")
            return
        }
        // console.log("note created : ", editor.innerHTML)
        fetch("http://localhost:8080/dir/", {
            method: "PATCH",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: {
                action: "add-data",
                directoryId: dirId,
                type: "note",
                ref: "note-id"
            }
        })        
        .then(res=>res.json())
        .then(data=>{
            console.log("data : ", data)

        })
        .catch(err=>console.log(err))
    }

    return ( 
        <div className="create-note">
            <Link to="/user/personal-folder" label="back" />
            <div class="editor-container">
                <div class="toolbar">
                    <button onclick={()=>formatText('bold')}><b>B</b></button>
                    <button onclick={()=>formatText('italic')}><i>I</i></button>
                    <button onclick={()=>formatText('underline')}><u>U</u></button>
                    <button onclick={()=>alignText('left')}>Left Align</button>
                    <button onclick={()=>alignText('center')}>Center Align</button>
                    <button onclick={()=>alignText('right')}>Right Align</button>
                    <button onclick={()=>insertOrderedList()}>Ordered List</button>
                    <button onclick={()=>insertUnorderedList()}>Unordered List</button>
                    <input className="text-color" type="color" onchange={()=>console.log(textColorInput)} />
                    <input className="background-color" type="color" onchange={()=>changeBackgroundColor(backgroundColorInput.value)} />
                    <button onclick={()=>insertLink()}>Insert Link</button>
                    <button onclick={()=>undo()}>Undo</button>
                    <button onclick={()=>redo()}>Redo</button>
                    <button onclick={()=>save()}>Save</button>
                </div>
                <div id="editor" contenteditable="true"></div>
            </div>
        </div>
     );
}
 
export default CreateNote;