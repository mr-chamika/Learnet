import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";
import "./TagInputField.css"

const TagInputField = ({ name, value = [], onChange, predefinedTagCount, maxTagCount = 20 }) => {
    const [inputValue, setInputValue] = useState("")
    const [tags, setTags] = useState([])
    const [t, setT]= useState([])
    const [disabled, setDisabled] = useState(false)
    const {user} = useContext(UserContext)

    useEffect(()=>{
        fetch("http://localhost:8080/tag/get",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                setT([...data.predefinedTags, ...data.userdefinedTags])
            }
        })
    }, [user])

    const handleKeyDown = (e) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault()
            const newTag = e.target.value.trim()
            console.log("new tag : ", newTag)
            if (newTag && !tags.includes(newTag)) {
                const updatedTags = [...tags, newTag];
                setTags(prev=>{
                    if(prev.length + 1 >= maxTagCount){
                       setDisabled(true) 
                    }
                    return [...prev, newTag]
                })
                onChange && onChange(updatedTags) // Trigger onChange for parent if provided
            }
            setInputValue("")

            // console.log(document.querySelector(`input[name="${name}"]`).value)
        }
        // document.querySelector(`input[name="${name}"]`).focus()
        // setInputValue(e.target.value)
    };

    const handleInputChange = (e) => {
        // console.log("target value : ", e.target.value)
        // setInputValue(e.target.value)
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = tags.filter((tag) => tag._id !== tagToRemove._id)
        setTags(updatedTags)
        onChange && onChange(updatedTags) // Trigger onChange for parent if provided
        if(updatedTags.length < maxTagCount){
            setDisabled(false)
        }
    };

    const handleTagSelect = (tag) => {
        // console.log('Selected tag:', tag);
        // Implement additional logic here
        setTags(prev=>{
            if(prev.length + 1 >= maxTagCount){
               setDisabled(true) 
            }
            return [...prev, tag]
        })
    };

      // console.log("predefined tags: ", t)

    return (
        <div className="tag-input-field">
            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={JSON.stringify(tags.map(v=>v._id))} />
            
            <div className="tags-container">
                {tags.map((tag, index) => {
                    return (
                        <div className="tag" key={index}>
                            {tag.name}
                            <span className={`tag-type ${tag.type}`}>{tag.type}</span>
                            <button type="button" onClick={() => handleRemoveTag(tag)}>
                                &times;
                            </button>
                        </div>
                    )
                })}
                <div className="tag-input">
                    {/* <input 
                        type="text"
                        name={`${name}-tag-input`}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        placeholder="Type a tag and press Enter"
                    /> */}
                     <Autocomplete name={name} selectedTags={tags} tags={t} onSelect={handleTagSelect} />
                </div>
            </div>
        </div>
    );
};

function Autocomplete({ name, tags, onSelect, selectedTags }) {
  const [input, setInput] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const userInput = e.target.value;
    const filteredTags = tags.filter(tag =>
      tag.name.toLowerCase().includes(userInput.toLowerCase())
    ).filter(tag => {
      for(let i = 0; i < selectedTags.length; i++){
        if(selectedTags[i]._id === tag._id){
                return false
            }
        }
        return true
    })
    ;
    setInput(userInput);
    setFiltered(filteredTags);
    setShowSuggestions(true);
    document.querySelector(`.autocomplete input[name="${name}-autocomplete"]`).focus()
  };

  const handleClick = (tag) => {
    setInput("");
    setFiltered([]);
    setShowSuggestions(false);
    onSelect(tag);
  };

  return (
    <div className="autocomplete">
      <input
        name = {`${name}-autocomplete`}
        type="text"
        value={input}
        onInput={handleChange}
        placeholder="Search tags..."
      />
      {showSuggestions && input && (
        <ul className="suggestions">
          {filtered.length ? (
            filtered.map(tag => (
              <li key={tag._id} onClick={() => handleClick(tag)}>
                {tag.name}
                <span className={`tag-type ${tag.type}`}>
                    {tag.type}
                </span>
              </li>
            ))
          ) : (
            <li>No suggestions available.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default TagInputField;
