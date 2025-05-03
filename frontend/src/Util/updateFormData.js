const updateFormData = (e, setFormDataState) => {
    setFormDataState(prevState=>{
        let value
        switch(e.target.type){
            case "checkbox":
                value = e.target.checked ? true : false
                break
            case "file":
                // value = e.target.files
                // cannot directly assign a FileList object to the files property of an <input type="file"> element.
                const dataTransfer = new DataTransfer()
                for(let i = 0; i < e.target.files.length; i++){
                    const file = e.target.files[i]
                    dataTransfer.items.add(new File([file], file.name, {type: file.type}))
                }
                value = dataTransfer.files
                break
            default:
                value = e.target.value
        }
        console.log(e.target.files, "fln: ", value instanceof FileList)
        console.log("obj : ", {...prevState, [e.target.name]: value})
        return {...prevState, [e.target.name]: value}
    })
}

export default updateFormData