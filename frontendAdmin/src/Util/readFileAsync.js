function readFileAsync(file, method="readAsDataURL"){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader()

        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)

        switch(method){
            case "readAsDataURL": 
                reader.readAsDataURL(file)
                break
            case "readAsText": 
                reader.readAsDataURL(file)
                break
            case "readAsArrayBuffer": 
                reader.readAsDataURL(file)
                break
            default: throw Error("Unsupported reading method")
        }
    })
}

export default readFileAsync