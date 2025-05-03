export function focusNext(formElement, currentInputElementName){
    const children = formElement.children
    let isNext = false
    const nextFocusElem = Array.from(children).find(element=>{
        if(isNext){
            return true
        }
        
        let input
        if(input instanceof HTMLInputElement){
            input = element
        }else{
            input = element.querySelector("input")
        }
        if(input.name === currentInputElementName){
            isNext = true
        }
        return false
    })
    nextFocusElem?.querySelector("input")?.focus()
}