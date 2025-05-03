import { useState, useEffect, useContext } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import { routerContext } from "../../../Router/Router";
import "./UpdateBlog.css";

const UpdateBlog = () => {

  const {user} = useContext(UserContext)

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    tags: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {params} = useContext(routerContext)
  const {Id} = params
  
  useEffect(() => {
    fetch(`http://localhost:8080/blog/get`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        authorization: `bearer ${user.token}`,
      },
      body: JSON.stringify({ Id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("update data : ", data)
        if (!data.error) {
          setBlog({
            title: data.title,
            description: data.description,
            tags: data.tags,
            content: data.content,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
        alert("Failed to load blog data.");
      });
  }, [Id, user]);

  
  const updateBlogHandler = async (e) => {
    e.preventDefault();
    const content = document.getElementById("editor").innerHTML;

    if (!blog.title || !blog.description || !blog.tags || !content) {
      alert("Please fill in all the fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/blog/", {
        method: "PATCH",
        headers: {
          authorization: `bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: Id,
          title: blog.title,
          description: blog.description,
          tags: blog.tags,
          content,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Blog Updated Successfully!");
        setBlog({
          title: "",
          description: "",
          tags: "",
          content: "",
        });
        document.getElementById("editor").innerHTML = "";
      } else {
        alert(`Error: ${result.error || "Unable to update blog"}`);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  
  const addHyperlink = () => {
    const selection = window.getSelection();
    const url = prompt("Enter the URL for the hyperlink:");

    if (url && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText.trim().length > 0) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = selectedText;

        range.deleteContents();
        range.insertNode(anchor);
      } else {
        alert("Please select text before adding a hyperlink.");
      }
    } else if (!url) {
      alert("Invalid URL. Please try again.");
    }
  };

 
  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imgSrc = reader.result;

          const editor = document.getElementById("editor");
          const imgContainer = document.createElement("div");
          imgContainer.className = "resizable-container";
          imgContainer.style.position = "relative";
          imgContainer.style.display = "inline-block";
          imgContainer.style.border = "none";

          const img = document.createElement("img");
          img.src = imgSrc;
          img.className = "resizable-image";
          img.style.width = "200px";
          img.style.height = "auto";
          img.style.maxWidth = "100%";
          img.contentEditable = false;

          
          img.style.cursor = "grab";
          img.draggable = false;

          img.addEventListener("mousedown", (event) => {
            if (event.target === img) enableImageDragging(event, img, editor);
          });

         
          img.addEventListener("click", (event) => {
            event.stopPropagation();
            const allImages = editor.querySelectorAll(".resizable-container");
            allImages.forEach((container) => {
              container.style.border = "none";
              container.querySelectorAll(".resize-handle").forEach((handle) => {
                handle.style.display = "none";
              });
            });
            imgContainer.style.border = "2px solid #4A90E2";
            imgContainer.querySelectorAll(".resize-handle").forEach((handle) => {
              handle.style.display = "block";
            });
          });

          
          const createHandle = (position) => {
            const handle = document.createElement("div");
            handle.className = `resize-handle ${position}`;
            handle.style.position = "absolute";
            handle.style.width = "10px";
            handle.style.height = "10px";
            handle.style.background = "#4A90E2";
            handle.style.cursor = `${position}-resize`;
            handle.style.display = "none";

           
            if (position.includes("top")) handle.style.top = "-5px";
            if (position.includes("bottom")) handle.style.bottom = "-5px";
            if (position.includes("left")) handle.style.left = "-5px";
            if (position.includes("right")) handle.style.right = "-5px";

            
            handle.addEventListener("mousedown", (event) => {
              enableImageResize(event, img, position);
            });

            return handle;
          };

          const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];
          positions.forEach((pos) => imgContainer.appendChild(createHandle(pos)));

          imgContainer.appendChild(img);
          editor.appendChild(imgContainer);

          
          img.setAttribute("tabindex", "0");
          img.addEventListener("keydown", (event) => {
            if (event.key === "Delete") {
              imgContainer.remove();
            }
          });
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const submitButtonText = isSubmitting ? "Updating..." : "Update Blog";

  return (
    <div className="create-blog-container">
      <form onSubmit={updateBlogHandler} className="blog-form">
        <input
          type="text"
          placeholder="Enter Blog Title"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className="title-input"
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Short Description"
          value={blog.description}
          onChange={(e) => setBlog({ ...blog, description: e.target.value })}
          className="description-input"
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={blog.tags}
          onChange={(e) => setBlog({ ...blog, tags: e.target.value })}
          className="tags-input"
          disabled={isSubmitting}
        />

        <div className="editor-toolbar">
          <button type="button" onClick={() => formatText("bold")} title="Bold">
            <b>B</b>
          </button>
          <button type="button" onClick={() => formatText("italic")} title="Italic">
            <i>I</i>
          </button>
          <button type="button" onClick={() => formatText("underline")} title="Underline">
            <u>U</u>
          </button>
          <button type="button" onClick={addHyperlink} title="Add Hyperlink">
            🔗
          </button>
          <button type="button" onClick={uploadImage} title="Upload Image">
            🖼️
          </button>
        </div>

        <div
          id="editor"
          contentEditable="true"
          className="editor"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        >{blog.content}</div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default UpdateBlog;
