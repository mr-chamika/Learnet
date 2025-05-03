import readFileAsync from "./readFileAsync"

export function formDataToObj(formData) {
    const entries = [...formData.entries()]
    let dataObj = {}
    for (let field of entries) {
        dataObj[field[0]] = field[1]
    }
    return dataObj
}

export async function formToObj(form) {
    // console.log(form.elements)
    const formDataNew = {}
    for (let element of form.elements) {
        // console.log(element.type)
        let value
        if (element.type === "checkbox") {
            value = element.checked ? "true" : ""
        } else if (element.type === "file") {
            const files = element.files
            if (files.length > 0) {
                // console.log("multiple : ", element.multiple)
                if (element.multiple === true) {
                    value = []
                    for (let file of files) {
                        const fileData = await readFileAsync(file, "readAsDataURL")
                        value.push({ name: file.name, data: fileData })
                    }
                } else {
                    console.log("file data : ", files[0])
                    const fileData = await readFileAsync(files[0], "readAsDataURL")
                    value = { name: files[0].name, data: fileData }
                }
            }
        } else if (element.type === "submit") {
            continue
        } else {
            value = element.value
        }

        formDataNew[element.name] = value
    }

    console.log(formDataNew)

    return formDataNew
}