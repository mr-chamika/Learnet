// import Test from "../src/test";
// ------------------------------------ DOC ---------------------------------------------------------------
// if a component has multiple instances of the same component in the same level in the hierarcy those component instances must have a key prop with a unique value (unique integer is recommended)
console.info("if a component has multiple instances of the same component in the same level in the hierarcy those component instances must have a key prop with a unique value (unique integer is recommended)")
// --------------------------------------------------------------------------------------------------------

// const components = {}

// export function addComponent(nameOfComponent, componentFunc){
//     components[nameOfComponent] = componentFunc
// }

function processExpression(content, parentDOMElement, componentPath, compPathChildren){
    // console.log("process expression")
    if(typeof content === "function"){
        const returnValue = content()
        if(returnValue instanceof Array){
            return returnValue.map(obj => {
                // console.log("obj 1: ", obj)
                const result = createDOMElementNew(obj, parentDOMElement, componentPath, false, compPathChildren)
                return result
            })
        }else{
            // console.log("obj 2: ", returnValue, content)
            if(returnValue)
            return createDOMElementNew(returnValue, parentDOMElement, componentPath, false, compPathChildren)
        }
    }else if(typeof content === "object"){
        if(content instanceof Array){
            // console.log("content : ", content)
            return content.map(obj => {
                // console.log("obj 3: ", obj)
                // if(typeof obj === "function") console.log(obj)
                const result = createDOMElementNew(obj, parentDOMElement, componentPath, false, compPathChildren)
                // console.log("result : ", result)
                return result
            })
        }
    }else{
        // console.log("_______________type : ", typeof content)
        return createTextElement(content)
    }
}

function isComponent(type){
    let isAComponent = false
    if(type.includes(".")){
        const part2 = type.split(".")[1]
        isAComponent = part2.charAt(0) === part2.charAt(0).toUpperCase()
    }else{
        isAComponent = type.charAt(0) === type.charAt(0).toUpperCase()
    }
    return isAComponent
}

function createTextElement(text){
    // console.log("create text element")
    let element = null
    if(!(text == undefined && text == null && text == "")){
        element = document.createElement("span")
        // console.log("____________text : ",text)
        element.innerHTML = text
    }
    return element
}

function isBooleanAttribute(prop){
    const booleanAttributes = [
        "checked",
        "disabled",
        "readonly",
        "required",
        "autofocus",
        "multiple",
        "novalidate",
        "selected",
        "hidden",
        "controls",
        "loop",
        "muted",
        "open",
        "spellcheck",
        "draggable",
        "default"
    ]

    for(let attr of booleanAttributes){
        if(attr === prop.trim()){
            return true
        }
    }

    return false
}

function createHTMLElement(type, props, children, parentDOMElement, componentPath, compPathChildren){
    // console.log("create html element")
    const element = document.createElement(type)
    // console.log("ele : ", element)

    for(let prop in props){
        prop = prop.trim()
        // to attach event listens
        if(prop.startsWith("on")){
            try{
                element.addEventListener(prop.slice(2).toLowerCase(), props[prop])
            }catch(e){
                if(e instanceof TypeError){
                    throw Error(`In ${prop}=${props[prop]} Event handler provided ${props[prop]} is type of a ${typeof(props[prop])} and not a function. Please provide a valid function within curly braces as the event handler, or remove the event prop`)
                }
            }
            // props[prop]()
        }else if(prop == "ref"){
            // to process element references

        }else if(prop === "className"){
            element.setAttribute("class", props[prop])
        // }else if(prop === "checked"){
        //     if(props[prop]) element.setAttribute("checked", "")
        // }else if(prop === "disabled"){
        //     if(props[prop]) element.setAttribute("disabled", "")
        }else if(isBooleanAttribute(prop)){
            if(props[prop]) element.setAttribute(prop, "")
        }else if(prop === "value"){
            element.value = props[prop]
        }else if(prop === "files"){
            if(props[prop] && props[prop] instanceof FileList){
                element.files = props[prop]
            }
        }else{
            element.setAttribute(prop, props[prop])
        }
    }
    if(children){
        for(let child of children){
            const e = createDOMElementNew(child, element, componentPath, false, compPathChildren)
            if(e instanceof HTMLElement){
                appendElement(element, e)
            }else if(e instanceof Array){
                appendElements(element, e)
            }
        }
    }
    return element
}

function appendElement(parent, element){
    parent.appendChild(element)
}

function appendElements(parent, elements){
    // console.log("elements : ", elements)
    for(let element of elements){
        if(element instanceof Array){
            appendElements(parent, element)
        }else if(element instanceof HTMLElement){
            appendElement(parent, element)
        }else{
            if(element != null){
                throw Error("Unknown element : ", element, " in ", elements)
            }
        }
    }
}

// let renderQueue = {} // element : {componentPath: render function}
// async function runRender(){
//     // let render = renderQueue.shift()
//     // while(render){
//     //     render()
//     //     render = renderQueue.shift()
//     // }
//     // isRenderOnline = false
//     console.log("run render")
//     const comPaths = Object.keys(renderQueue)
//     if(comPaths.length > 0){
//         let minlengthComPath = comPaths[0]
//         for(let i = 0; i < comPaths.length; i++){
//             if(comPaths[i].length < minlengthComPath.length){
//                 minlengthComPath = comPaths[i]
//             }
//         }
//         renderQueue[minlengthComPath]()
//         renderQueue = {}
//     }
// }
// async function addRender(componentPath, render){
//     renderQueue[componentPath] = render
// }

function syncDomElements(element1, element2) {
    // Helper function to check if two nodes are equal
    function nodesAreEqual(node1, node2) {
        return (
            node1.nodeType === node2.nodeType &&
            node1.nodeName === node2.nodeName &&
            node1.nodeValue === node2.nodeValue
        );
    }

    // Synchronize attributes of element1 to match element2
    function syncAttributes(el1, el2) {
        // Remove any attributes from el1 not in el2
        Array.from(el1.attributes).forEach(attr => {
            if (!el2.hasAttribute(attr.name)) {
                el1.removeAttribute(attr.name);
            }
        });

        // Add or update attributes in el1 to match el2
        Array.from(el2.attributes).forEach(attr => {
            if (el1.getAttribute(attr.name) !== attr.value) {
                el1.setAttribute(attr.name, attr.value);
            }
        });
    }

    // Base case: if the nodes are not equal, replace element1 with a clone of element2
    if (!nodesAreEqual(element1, element2)) {
        element1.replaceWith(element2.cloneNode(true));
        return;
    }

    // Synchronize attributes
    syncAttributes(element1, element2);

    // Recursively sync child nodes
    const el1Children = Array.from(element1.childNodes);
    const el2Children = Array.from(element2.childNodes);

    // Remove extra children from element1
    while (el1Children.length > el2Children.length) {
        element1.removeChild(element1.lastChild);
    }

    // Update existing children and add new children
    el2Children.forEach((el2Child, index) => {
        const el1Child = el1Children[index];
        if (!el1Child) {
            // If el1Child doesn't exist, append a clone of el2Child
            element1.appendChild(el2Child.cloneNode(true));
        } else {
            // If el1Child exists, recursively sync
            syncDomElements(el1Child, el2Child);
        }
    });
}


// compPathTree format
// {
//     path: "",
//     children: []
// }

function unmount(component){
    // console.log("unmounting : ", component)

    const path = component.path
    // console.log("comp : ", collection[path])
    collection[path].state = undefined
    // running the onUnmount callbacks
    if(collection[path].effect){
        // console.log("unount comp effect : ", collection[path].effect)
        const length = Object.keys(collection[path].effect)?.length
        for(let i = 0; i < length; i++){
            // console.log("calling unmount")
            const unmountFunction = collection[path].effect[i]?.onUnmount
            if(typeof unmountFunction === "function"){
                // console.log("executing : ", unmountFunction)
                unmountFunction()
            }
        }
        collection[path].effect = undefined
    }

    component.children.forEach(child=>unmount(child))
}

function unmountComponents(prevComponentHieracy, currentComponentHieracy){
    // Ex : 
    //      prev: [0, 1, 2, 3, 4]
    //      curr: [1, 3, 5]
    //      sp: the order of the components does not get changed. ex : always 2 comes after 1.
    //      priority: is given to the current hieracy
    // console.log("-------------------------------SSS---------------------------")
    // console.log("prev vs cur : ", prevComponentHieracy, currentComponentHieracy)
    const clength = currentComponentHieracy.length
    const plength = prevComponentHieracy.length
    let i, j = 0
    const unmountList = []
    for(i = 0; i <  clength; i++){
        let subUnmoutList = []
        const jTemp = j
        // console.log("init j : ", j)
        for(;j < plength; j++){
            // console.log("comp : \n", currentComponentHieracy[i].path, "\n", prevComponentHieracy[j].path, "\n", currentComponentHieracy[i].path === prevComponentHieracy[j].path)
            // console.log(i, clength , j, plength)
            if(currentComponentHieracy[i].path !== prevComponentHieracy[j].path){
                // console.log("diff : \n", currentComponentHieracy[i].path, "\n", prevComponentHieracy[j].path)
                // console.log("diff : \n", currentComponentHieracy, "\n", prevComponentHieracy)
                // console.log("adding to unmounting list: ", prevComponentHieracy[j])
                // console.log(i, clength , j, plength)
                subUnmoutList.push(prevComponentHieracy[j])       
            }else{
                // also check the descending hierachy
                // console.log("sub comp check")
                // console.log("going down : ", prevComponentHieracy[j].children, currentComponentHieracy[i].children)
                unmountComponents(prevComponentHieracy[j].children, currentComponentHieracy[i].children)
                // move on to the next element in the current heirachy
                j++
                break
            }
        }

        // console.log("sub list : ", subUnmoutList)
        // console.log("i , j : ", i, j)
        // console.log("clength , plength : ", clength, plength)
        if(subUnmoutList.length){
            if(j !== plength){
                // console.log("unmounting : ", subUnmoutList)
                // console.log("adding to the list : ", subUnmoutList)
                unmountList.push(...subUnmoutList)
            }else{
                // console.log("ij2: ", i, clength , j, plength)
                if(i === clength - 1){
                    // console.log("adding to the list : ", subUnmoutList)
                    unmountList.push(...subUnmoutList)
                }else{
                    j = jTemp
                }
            }
        }
        // console.log("---------------------------EEE-------------------------------")
    }


    // console.log("unmount list : ", unmountList)
    if(j !== plength){ 
        unmountList.push(...prevComponentHieracy.slice(j))
    }

    // console.log("unmount list : ", unmountList, unmountList.length > 0)

    unmountList.forEach(component=>{
        // console.log("root component get unmounted : ", component)
        unmount(component)
    })   
}

const rerenderQueue = [];
let processing = false;
let initialized = true

function processQueue() {
    if (processing || !initialized){
        // console.log("returning ...... ")
        return;
    }
    processing = true;

    // console.log("processing the queue: ", rerenderQueue)
    while (rerenderQueue.length > 0) {
        const x = rerenderQueue.shift()
        // console.log("rerender values : ", contextCollection)
        x.func();
    }
    // console.log("queue is empty. : ", rerenderQueue)
    
    processing = false;
    // console.log("double check : ", rerenderQueue)
}

function addTaskToQueue(task) {
    rerenderQueue.push(task);
    processQueue();
}



function textToSpan(content){
    return {
        type: "span",
        props: {},
        children: content
    }
}

function setAttrIfDifferent(element, prop, prev, updated){
    if(prev !== updated){
        element.setAttribute(prop, updated)
    }
}

function compareJSX(previousJSX, updatedJSX){
    if(previousJSX.type !== updatedJSX.type){
        console.log("comp : ", previousJSX, updatedJSX)
        throw Error("compareJSX Error : type mismatch")
    }

    // There is no concept of dynamic props
    // so the number of props an element has will remail the same no matter what
    // therefor it is enough to updated the valus of each prop

    // console.log("compare : ", previousJSX, updatedJSX)
    const element = previousJSX.element
    updatedJSX.element = element
    if(!element) throw Error("compareJSX Error : element cannot be found,\n previousJSX : ", previousJSX)

    if(updatedJSX.type === "TEXT_ELEMENT"){
        if(element.innerHTML !== updatedJSX.children){
            element.innerHTML = updatedJSX.children
        }
        return
    }

    const prevProps = Object.keys(previousJSX.props)
    prevProps.forEach(prop => {
        prop = prop.trim()
        if(previousJSX.props[prop] != updatedJSX.props[prop]){
            if(prop.startsWith("on")){
                // try{
                //     element.addEventListener(prop.slice(2).toLowerCase(), prevProps[prop])
                // }catch(e){
                //     if(e instanceof TypeError){
                //         throw Error(`In ${prop}=${prevProps[prop]} Event handler provided ${prevProps[prop]} is type of a ${typeof(prevProps[prop])} and not a function. Please provide a valid function within curly braces as the event handler, or remove the event prop`)
                //     }
                // }
            }else if(prop == "ref"){
                // to process element references

            }else if(prop === "className"){
                element.setAttribute("class", updatedJSX.props[prop])
            }else if(isBooleanAttribute(prop)){
                if(updatedJSX[prop]){
                    element.setAttribute(prop, "")
                }else{
                    element.removeAttribute(prop)
                }
            }else if(prop === "value"){
                element.value = updatedJSX[prop]
            }else if(prop === "files"){
                if(updatedJSX[prop] && updatedJSX[prop] instanceof FileList){
                    element.files = updatedJSX[prop]
                }
            }else{
                element.setAttribute(prop, updatedJSX[prop])
            }
        }

        // if(previousJSX.props[prop] !== updatedJSX.props[prop]){
        //     element.setAttribute(prop, updatedJSX.props[prop])
        // }
    })

    // METHOD 1

    // ids must be in increasing order (prob : transpilter)
    // and each element must have an id (prob : context providers)

    const children = updatedJSX.children
    const prevChildren = previousJSX.children
    let i = 0, j = 0
    console.log("children : ", children, prevChildren)
    if(children){
        while(i < children.length && j < prevChildren.length){
            // console.log("ij : ", i, j)
            while(children[i]?.id < prevChildren[j]?.id){
                if(i > 0){
                    element.insertBefore(jsxToHTML(children[i]), children[i - 1].element.nextSibling)
                }else{
                    element.appendChild(jsxToHTML(children[i]))
                }
                i++
            }
            if(children[i]?.id === prevChildren[j]?.id){
                compareJSX(prevChildren[j], children[i])
                i++
                j++
            }
            while(children[i]?.id > prevChildren[j]?.id){
                try{
                    element.removeChild(prevChildren[j].element)
                }catch(e){
                    
                }
                j++
            }
        }
        while(i < children.length){
            element.appendChild(jsxToHTML(children[i]))
            i++
        }
        while(j < prevChildren.length){
            try{
                element.removeChild(prevChildren[j].element)
            }catch(e){

            }
            j++
        }
    }

    // METHOD 2

    // const updated = updatedJSX.children
    // const prev = previousJSX.children
    // if(prev){
    //     // Step 1: Create lookup maps
    //     const prevMap = new Map(prev.map(obj => [obj.id, obj]));
    //     const updatedMap = new Map(updated.map(obj => [obj.id, obj]));
    
    //     // Step 2: Map updated ID order
    //     const previousIds = updated.map(obj => obj.id);
    //     const updatedIds = updated.map(obj => obj.id);
    
    //     // Step 3: Reconstruct order of x
    //     const seen = new Set();
    //     const orderedIds = [...prev, ...updated]
    //     .map(obj => obj.id)
    //     .filter(id => {
    //         if (seen.has(id)) return false;
    //         seen.add(id);
    //         return true;
    //     });
    
    //     // Step 4: Log based on comparison
    //     for (const id of orderedIds) {
    //         const inPrev = prevMap.has(id);
    //         const inUpdated = updatedMap.has(id);
    
    //         const childJSX = inUpdated 
    //             ? updatedMap.get(id) 
    //             : prevMap.get(id) ?? null;
    
    //         if (inPrev && !inUpdated) {
    //             // console.log(`removed item: { child: "${child}", id: ${id} }`);
    //             element.removeChild(childJSX.element)
    //         } else if (inPrev && inUpdated) {
    //             // console.log(`updated item: { child: "${child}", id: ${id}, nextUpdatedId: ${nextId} }`);
    //             compareJSX(prevMap.get(id), updatedMap.get(id))
    //         } else if (!inPrev && inUpdated) {
    //             const idxInPrevious = previousIds.indexOf(id);
    //             const nextId = previousIds[idxInPrevious - 1] ?? null;
    //             const siblingJSX = prevMap.get(nextId)
    //             // console.log(`appended item: { child: "${child}", id: ${id} }`);
    //             if(siblingJSX){
    //                 element.insertBefore(jsxToHTML(childJSX), siblingJSX.element.nextSibling)
    //             }else{
    //                 element.appendChild(jsxToHTML(childJSX))
    //             }
    //         }
            
    //     }
    // }

    // METHOD 3

    // const updated = updatedJSX.children
    // const prev = previousJSX.children
    // if(prev){

    //     // Step 1: Build multiset-style ID counters
    //     function countIds(arr) {
    //         const counts = {};
    //         for (const item of arr) {
    //         counts[item.id] = (counts[item.id] || 0) + 1;
    //         }
    //         return counts;
    //     }
        
    //     const prevCounts = countIds(prev);
    //     const updatedCounts = countIds(updated);
        
    //     // Step 2: Build x = combined order-preserving list of IDs (with duplicates)
    //     const x = [...prev, ...updated].map(obj => obj.id);
        
    //     // Step 3: Track visited occurrences of each id
    //     const visitCount = {}; // to track how many times we've seen each id so far
        
    //     // Step 4: Logging
    //     const updatedIds = updated.map(obj => obj.id);
        
    //     for (let i = 0; i < x.length; i++) {
    //         const id = x[i];
    //         visitCount[id] = (visitCount[id] || 0) + 1;
        
    //         const occurrenceIndex = visitCount[id];
        
    //         const prevOccurrences = prev.filter(obj => obj.id === id);
    //         const updatedOccurrences = updated.filter(obj => obj.id === id);
        
    //         let logType = "";
    //         let name = "(unknown)";
    //         let nextId = null;
        
    //         const hasInPrev = occurrenceIndex <= prevOccurrences.length;
    //         const hasInUpdated = occurrenceIndex <= updatedOccurrences.length;
        
    //         if (hasInPrev && hasInUpdated) {
    //             logType = "updated";
    //             name = updatedOccurrences[occurrenceIndex - 1].name;
            
    //             const indexInUpdated = updated.findIndex((obj, idx) => {
    //                 // Match the nth occurrence
    //                 return obj.id === id && updated.slice(0, idx).filter(o => o.id === id).length === occurrenceIndex - 1;
    //             });
            
    //             nextId = updated[indexInUpdated + 1]?.id ?? null;
            
    //             console.log(`${logType} item: { name: "${name}", id: ${id}, nextUpdatedId: ${nextId} }`);
    //         } else if (hasInPrev) {
    //             // logType = "removed";
    //             element = prevOccurrences[occurrenceIndex - 1].element;
    //             // console.log(`${logType} item: { name: "${name}", id: ${id} }`);
    //             element.removeChild(element)
    //         } else if (hasInUpdated) {
    //             // logType = "appended";
    //             element = updatedOccurrences[occurrenceIndex - 1].element;
    //             // console.log(`${logType} item: { name: "${name}", id: ${id} }`);
    //             if(siblingJSX){
    //                 element.insertBefore(jsxToHTML(childJSX), siblingJSX.element.nextSibling)
    //             }else{
    //                 element.appendChild(jsxToHTML(childJSX))
    //             }
    //         }
    //     }
    // }
}

function jsxToHTML(jsx){
    const type = jsx.type
    const props = jsx.props
    const children = jsx.children

    if(type === "TEXT_ELEMENT"){
        const element = createTextElement(children)
        jsx.element = element
        return element
    }
    
    const element = document.createElement(type)
    // console.log("ele : ", element)

    for(let prop in props){
        prop = prop.trim()
        // to attach event listens
        if(prop.startsWith("on")){
            try{
                element.addEventListener(prop.slice(2).toLowerCase(), props[prop])
            }catch(e){
                if(e instanceof TypeError){
                    throw Error(`In ${prop}=${props[prop]} Event handler provided ${props[prop]} is type of a ${typeof(props[prop])} and not a function. Please provide a valid function within curly braces as the event handler, or remove the event prop`)
                }
            }
            // props[prop]()
        }else if(prop == "ref"){
            // to process element references

        }else if(prop === "className"){
            element.setAttribute("class", props[prop])
        // }else if(prop === "checked"){
        //     if(props[prop]) element.setAttribute("checked", "")
        // }else if(prop === "disabled"){
        //     if(props[prop]) element.setAttribute("disabled", "")
        }else if(isBooleanAttribute(prop)){
            if(props[prop]) element.setAttribute(prop, "")
        }else if(prop === "value"){
            element.value = props[prop]
        }else if(prop === "files"){
            if(props[prop] && props[prop] instanceof FileList){
                element.files = props[prop]
            }
        }else{
            element.setAttribute(prop, props[prop])
        }
    }
    if(children){
        for(let child of children){
            const e = jsxToHTML(child)
            if(e instanceof HTMLElement){
                appendElement(element, e)
            }else if(e instanceof Array){
                appendElements(element, e)
            }
        }
    }
    jsx.element = element
    return element
}

function expressionToJSX(content, componentPath){
    if(typeof content === "function"){
        const returnValue = content()
        if(returnValue instanceof Array){
            // console.log("array length : ", returnValue)
            const p = returnValue.map(obj => {
                return processComponentUtil(obj, componentPath)
            })
            return p.flatMap(v=>v).filter(v=>v!=undefined)
        }else{
            if(returnValue){
                return processComponentUtil(returnValue, componentPath)
            }
        }
    }else if(typeof content === "object"){
        if(content instanceof Array){
            const p = content.map(obj => {
                return processComponentUtil(obj, componentPath)
            })
            return p.flatMap(v=>v).filter(v=>v!=undefined)
        }
    }else{
        return {
            type: "TEXT_ELEMENT",
            props: {},
            children: content
        }
    }
}

function processComponent(component, propsOfComponent = null, childrenOfComponent = null, componentPath = "", key=0){
    if( component.isProvider ){
        const contextProvider = new component(propsOfComponent.value)
        contextCollection[contextProvider.indexOfContext].value = propsOfComponent.value
        return processComponent(component.component, null, childrenOfComponent, componentPath, 0)
        // return null
    }

    let thisComponentPath
    if(propsOfComponent && propsOfComponent.key){
        thisComponentPath = componentPath + "-" + component.name + "/" + propsOfComponent.key
    }else{
        thisComponentPath = componentPath + "-" + component.name + "/" + key
    }

    useStateCountInComponent = 0
    useEffectCountInComponent = 0
    useRefCountInComponent = 0
    useReducerCountInComponent = 0
    useLayoutEffectCountInComponent = 0
    currentComponentPath = thisComponentPath


    collection[thisComponentPath] = {
        ...collection[thisComponentPath],
        rerender: function(){
            useStateCountInComponent = 0
            useEffectCountInComponent = 0
            useRefCountInComponent = 0
            useReducerCountInComponent = 0
            useLayoutEffectCountInComponent = 0
            currentComponentPath = thisComponentPath
            collection[thisComponentPath].isRerendered = false

            const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
            // ====================================================================
            // TODO : fix the issue
            // Tempory fix for the issue
            // first the state of a child compoent gets changed 
            // Then the state of the parent gets changed 
            // since the child compoent got rerendered its isRerendered value is true
            // so it won't be attached to the dom
            // setTimeout(() => {
            //     collection[thisComponentPath].isRerendered = false
            // }, 0);
            // ====================================================================

            const jsx = processComponentUtil(componentJSXObject, componentPath, true)

            // compare previous and updated jsx and make changes to the DOM
            // assm : when the state of a component get changed, the root element of that component may change but never be replaced
            compareJSX(collection[thisComponentPath].jsx, jsx)

            collection[thisComponentPath].jsx = jsx
        },
    }

    const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
    const jsx = processComponentUtil(componentJSXObject, componentPath, true)
    collection[thisComponentPath].jsx = jsx
    return jsx
}

function processComponentUtil(JSXObject, componentPath, parentIsAComponent = false){
    const type = JSXObject.type
    const props = JSXObject.props
    const children = JSXObject.children
    const id = JSXObject.id
    const componentFunction = JSXObject.componentFunction

    if(parentIsAComponent && (type === "EXPRESSION" || type==="TEXT_ELEMENT")){
        throw Error("Expressions and texts are not allowed as direct descendents of a component return value")
    }

    // console.log(JSXObject)

    if(type == "EXPRESSION"){
        // console.log("expression...")
        return expressionToJSX(children)
    }else if(type == "TEXT_ELEMENT"){
        // console.log("text...: ")
        return JSXObject
    }else if(isComponent(type)){
        // console.log("component...")
        if(!componentFunction) throw Error(`Component <${type}> not found: componentFunction not found.`)
        return processComponent(componentFunction, props, children, componentPath, 0) 
    }else{
        // console.log("element...")
        // console.log("children : ", children)
        if(children instanceof Array){
            const processedChildren = children.map(child=>{
                return processComponentUtil(child, componentPath)
            })
            return {
                type,
                props,
                id,
                children: processedChildren.flatMap(v=>v).filter(v=>v!=undefined)
            }
        }else{
            return JSXObject
        }
    }
}







// const rList = []
// let currentRerenderIndex
// const rerenderIndex = Date.now() // a unique index for each render of the same component
function createComponent(component, parentDOMElement, propsOfComponent = null, childrenOfComponent = null, componentPath = "", key=0, isProvider = false, compPathChildren){
    if( component.isProvider ){
        const contextProvider = new component(propsOfComponent.value)
        // console.log("__________create compoent : ", contextProvider)
        contextCollection[contextProvider.indexOfContext].value = propsOfComponent.value
        createComponent(component.component, parentDOMElement, null, childrenOfComponent, componentPath, 0, true, compPathChildren)
        return null
    }

    let thisComponentPath
    if(propsOfComponent && propsOfComponent.key){
        thisComponentPath = componentPath + "-" + component.name + "/" + parentDOMElement.nodeName + "/" + propsOfComponent.key
        // if a component has multiple instances of the same component in the same level in the hierarcy those component instances must have a key prop with a unique value (unique integer is recommended)
    }else{
        thisComponentPath = componentPath + "-" + component.name + "/" + parentDOMElement.nodeName + "/" + key
    }

    const descendentCompPathChildren = []
    const thisComponentIndex = compPathChildren.push({
        path: thisComponentPath,
        children: descendentCompPathChildren
    }) - 1

    // console.log(thisComponentIndex, compPathChildren)

    function rerender(){
        // console.log("comp rerender : ", thisComponentPath, newState)
        useStateCountInComponent = 0
        useEffectCountInComponent = 0
        useRefCountInComponent = 0
        useReducerCountInComponent = 0
        useLayoutEffectCountInComponent = 0
        currentComponentPath = thisComponentPath
        collection[thisComponentPath].isRerendered = false
        // console.log("rerendering...")

        // const rerenderIndex = Date.now() + Math.round(Math.random() * 1000000) // a unique index for each render of the same component
        // rList.push(rerenderIndex)
        // currentRerenderIndex = rerenderIndex
        // collection[thisComponentPath].childRerenders[rerenderIndex] = []
        // console.log("current rerender index m: ", rerenderIndex, collection[thisComponentPath].childRerenders[rerenderIndex], thisComponentPath)
        // console.log("component function : start : ", thisComponentPath)
        const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
        // currentComponentPath = ""
        // currentRerenderIndex = null
        // console.log("component function : end : ", thisComponentPath)
        // ====================================================================
        // TODO : fix the issue
        // Tempory fix for the issue
        // first the state of a child compoent gets changed 
        // Then the state of the parent gets changed 
        // since the child compoent got rerendered its isRerendered value is true
        // so it won't be attached to the dom
        // setTimeout(() => {
        //     collection[thisComponentPath].isRerendered = false
        // }, 0);
        // ====================================================================

        const newDescendentCompPathChildren = []
        const updatedElement = createDOMElementNew(componentJSXObject, parentDOMElement, thisComponentPath, true, newDescendentCompPathChildren)
        // const unmountedPaths = descendentCompPathChildren.filter(child=>{
        //     const length = newDescendentCompPathChildren.length
        //     for(let i = 0; i < length; i++){
        //         if(newDescendentCompPathChildren[i].path === child.path) return false
        //     }
        //     return true
        // })
        // unmountedPaths.forEach(path=>{
        //     collection[path].state = undefined
        //     collection[path].effect = undefined
        // })
        // console.log("changed : ", compPathChildren[thisComponentIndex].children, newDescendentCompPathChildren)

        // ----------------- Unmounting the components that was in the previous render but not in the current render ---------------------------
        unmountComponents(compPathChildren[thisComponentIndex].children, newDescendentCompPathChildren)
        compPathChildren[thisComponentIndex].children = newDescendentCompPathChildren
        // -------------------------------------------------------------------------------------------------------------------------------------

        if(updatedElement !== null){

            // console.log("element : ", collection[thisComponentPath].element, newState)
            if(collection[thisComponentPath] && collection[thisComponentPath].element){
                // console.log("replacing...")
                try{
                    parentDOMElement.replaceChild(updatedElement, collection[thisComponentPath].element)
                    // syncDomElements(collection[thisComponentPath].element, updatedElement)
                }catch(err){
                    if(err instanceof DOMException){
                        // console.log("parent : ", parentDOMElement)
                        // console.log("prev element : ", collection[thisComponentPath].element)
                        // console.log("updated element : ", updatedElement)

                        // throw Error(err.message)
                        // console.log("appending...: ", updatedElement)
                        parentDOMElement.appendChild(updatedElement)
                    }
                }
            }else{
                // console.log("appending...: ", updatedElement)
                parentDOMElement.appendChild(updatedElement)
            }

            // ------------------------ LAYOUT EFFECT SRT --------------------------------------------------------
            // console.log("collection[componentPath] : ", collection[thisComponentPath].layoutEffect)
            if(collection[thisComponentPath] && collection[thisComponentPath].layoutEffect){
                const l = Object.keys(collection[thisComponentPath].layoutEffect).length
                for(let i = 0; i < l; i++){
                    // console.log("layoutEffectCollection : r : ", collection[thisComponentPath].layoutEffect[i].callbackQueue)
                    // run layout effect callback functions
                    while(collection[thisComponentPath].layoutEffect[i].callbackQueue.length > 0){
                        const cb = collection[thisComponentPath].layoutEffect[i].callbackQueue.shift()
                        cb(updatedElement)
                    }
                }
            }
            // ------------------------ LAYOUT EFFECT END --------------------------------------------------------

            
            // TODO : instead of replacing the entire HTML node, replace only the part/parts that has been changed in the hierarcy
            
            if(collection[thisComponentPath]){
                collection[thisComponentPath].element = updatedElement
            }else{
                collection[thisComponentPath] = {element: updatedElement, isInitialRender: true, prevState: null, parentDOMElement, rerender}
            }
        }else{
            for(let i = 0; i < useLayoutEffectCountInComponent; i++){
                if(collection[componentPath].layoutEffect[i].callbackQueue.length > 0)
                    throw Error("LibError : useLayoutEffect")
            }
        }

        // currentComponentPath = thisComponentPath
        // while(collection[thisComponentPath].childRerenders.length > 0){
        //     collection[thisComponentPath].childRerenders[rerenderIndex].shift().func()
        //     currentComponentPath = thisComponentPath
        // }
        // delete collection[thisComponentPath].childRerenders[rerenderIndex]

        // const length = thisComponentPath.length
        // const queue = []
        // while(rerenderQueue.length > 0){
        //     console.log("re in : ", rerenderQueue)
        //     const task = rerenderQueue.shift()
        //     if(task.cpLength > length){
        //         task.func()
        //     }else{
        //         queue.push(task)
        //     }
        // }
        // while(queue.length > 0){
        //     console.log("re in 3 : ", rerenderQueue)
        //     const task = queue.shift()
        //     task.func()
        // }
    }


    useStateCountInComponent = 0
    useEffectCountInComponent = 0
    useRefCountInComponent = 0
    useReducerCountInComponent = 0
    useLayoutEffectCountInComponent = 0
    currentComponentPath = thisComponentPath


    collection[thisComponentPath] = {
        ...collection[thisComponentPath],
        // isInitialRender: true,
        // prevState: null,
        // childRerenders: {},
        parentDOMElement,
        rerender,
        // isRerendered : false
    }
    // console.log("start")
    // const rerenderIndex = Date.now() + Math.round(Math.random() * 1000000) // a unique index for each render of the same component
    // rList.push(rerenderIndex)
    // currentRerenderIndex = rerenderIndex
    // collection[thisComponentPath].childRerenders[rerenderIndex] = []
    // console.log("current rerender index m: ", rerenderIndex, collection[thisComponentPath].childRerenders[rerenderIndex], thisComponentPath)
    // console.log("component function : start : ", thisComponentPath)
    const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
    // currentComponentPath = ""
    // currentRerenderIndex = null
    // console.log("component function : end : ", thisComponentPath)
    if(!collection[thisComponentPath].isRerendered){
        // no need to render if the rerender function of the compoent is executed within the component through a state change (useState, useReducer)
        let element = createDOMElementNew(componentJSXObject, parentDOMElement, thisComponentPath, true, descendentCompPathChildren)
        // console.log("element : ", element)
        
        if(element !== null){
            // parentDOMElement.appendChild(element)
            if(collection[thisComponentPath] && collection[thisComponentPath].element){
                // parentDOMElement.replaceChild(element, collection[thisComponentPath].element)
                try{
                    parentDOMElement.replaceChild(element, collection[thisComponentPath].element)
                    // syncDomElements(collection[thisComponentPath].element, element)
                }catch(err){
                    if(err instanceof DOMException){
                        // console.log("replace err : appending...")
                        parentDOMElement.appendChild(element)
                    }
                }
            }else{
                // console.log("appending... : ", element)
                parentDOMElement.appendChild(element)
            }

            // ------------------------ LAYOUT EFFECT SRT --------------------------------------------------------
            // console.log("collection[componentPath] : ", thisComponentPath, collection[thisComponentPath].layoutEffect)
            if(collection[thisComponentPath] && collection[thisComponentPath].layoutEffect){
                const l = Object.keys(collection[thisComponentPath].layoutEffect).length
                for(let i = 0; i < l; i++){
                    // console.log("layoutEffectCollection : ", collection[thisComponentPath].layoutEffect[i].callbackQueue, element)
                    // run layout effect callback functions
                    while(collection[thisComponentPath].layoutEffect[i].callbackQueue.length > 0){
                        const cb = collection[thisComponentPath].layoutEffect[i].callbackQueue.shift()
                        cb(element)
                    }
                }
            }
            // ------------------------ LAYOUT EFFECT END --------------------------------------------------------
        
        }else{
            for(let i = 0; i < useLayoutEffectCountInComponent; i++){
                if(collection[componentPath].layoutEffect[i].callbackQueue.length > 0)
                    throw Error("LibError : useLayoutEffect")
            }
        }
        
        // console.log("end")
        collection[thisComponentPath] = {...collection[thisComponentPath], componentJSXObject, element}
    }else{
        collection[thisComponentPath].isRerendered = false
    }

    // console.log("\t\tcollection[thisComponentPath]: ", collection[thisComponentPath].element)
    // currentComponentPath = thisComponentPath
    // while(collection[thisComponentPath].childRerenders[rerenderIndex].length > 0){
    //     collection[thisComponentPath].childRerenders[rerenderIndex].shift().func()
    //     currentComponentPath = thisComponentPath
    // }
    // delete collection[thisComponentPath].childRerenders[rerenderIndex]
    return null
}

function createDOMElementNew(JSXObject, parentDOMElement, componentPath, parentIsAComponent = false, compPathChildren){
    // console.log("create dom element : ", JSXObject, parentDOMElement)
    const type = JSXObject.type
    const props = JSXObject.props
    const children = JSXObject.children
    const componentFunction = JSXObject.componentFunction

    if(parentIsAComponent && (type === "EXPRESSION" || type==="TEXT_ELEMENT")){
        throw Error("Expressions and texts are not allowed as direct descendents of a component return value")
    }

    let returnValue
    if(type === "EXPRESSION"){
        // console.log("expression")
        returnValue = processExpression(children, parentDOMElement, componentPath, compPathChildren) // return value is an array of elements
    }else if(type === "TEXT_ELEMENT"){
        // console.log("text element")
        returnValue = createTextElement(children) // return value is a span element
    }else if(isComponent(type)){
        // console.log("component")
        if(!componentFunction) throw Error(`Component <${type}> not found: componentFunction not found.`)
        createComponent(componentFunction, parentDOMElement, props, children, componentPath, 0, false, compPathChildren) 
        returnValue = null // return value is null
    }else{
        // console.log("html element")
        returnValue = createHTMLElement(type, props, children, parentDOMElement, componentPath, compPathChildren) // return value is an html element
    }

    // console.log("createDOMElementNew return value : ", returnValue)
    return returnValue
}















function createDOMElement(JSXObject, componentPath){
    if(!JSXObject || typeof JSXObject !== "object"){
        // throw Error("Not an object")
        // return document.createElement("div")
        return null
    }
    const type = JSXObject.type
    const props = JSXObject.props
    const children = JSXObject.children
    const componentFunction = JSXObject.componentFunction
    let element;



    if(type === "TEXT_ELEMENT"){
        element = document.createElement("span")
        // element.innerHTML = `text element : ${children}`
        if(children !== ""){
            element.innerHTML = children
        }
    }else if(type === "EXPRESSION"){
        switch(typeof children){
            case "function" : {
                const returnValue = children()
                if(returnValue instanceof Array){
                    // element.innerHTML = children()
    
                    return returnValue.map(obj => {
                        const result = createDOMElement(obj, componentPath)
                        return result
                    })
                }else{
                    return createDOMElement(returnValue, componentPath)
                }
            }
            case "object": {
                if(children instanceof Array){
                    return children.map(obj => {
                        const result = createDOMElement(obj, componentPath)
                        return result
                    })
                }
            }
            default:
                element = document.createElement("span")
                if(children !== ""){
                    element.innerHTML = children
                }
        }
    }else{
        let isAComponent = false
        if(type.includes(".")){
            const part2 = type.split(".")[1]
            isAComponent = part2.charAt(0) === part2.charAt(0).toUpperCase()
        }else{
            isAComponent = type.charAt(0) === type.charAt(0).toUpperCase()
        }

        if(isAComponent){
            // return createDOMElement(components[type]())
            // if(!components[type]){
            //     throw Error(`Component <${type}> not found. Componet must be added to the environment using addComponent() in the main component. refresh the webpage manually after adding it`)
            // }else{
            //     return [components[type], props, children]
            // }

            if(!componentFunction) throw Error(`Component <${type}> not found: componentFunction not found.`)
            return [componentFunction, props, children]
        }else{
            element = document.createElement(type)
    
            for(let prop in props){
                prop = prop.trim()
                // to attach event listens
                if(prop.startsWith("on")){
                    try{
                        element.addEventListener(prop.slice(2).toLowerCase(), props[prop])
                    }catch(e){
                        if(e instanceof TypeError){
                            throw Error(`In ${prop}=${props[prop]} Event handler provided ${props[prop]} is type of a ${typeof(props[prop])} and not a function. Please provide a valid function within curly braces as the event handler, or remove the event prop`)
                        }
                    }
                    // props[prop]()
                }else if(prop == "ref"){
                    // to process element references

                }else if(prop === "className"){
                    element.setAttribute("class", props[prop])
                }else{
                    element.setAttribute(prop, props[prop])
                }
            }
            if(children){
                for(let child of children){
                    const childElement = createDOMElement(child, componentPath)
                    // if(typeof childElement === "object")
                    if(!(childElement instanceof Array)) // return value is an HTML node
                        childElement ? element.appendChild(childElement) : null
                    else{
                        if(!(typeof childElement[0] === "function")){ // return value is an array of arrays
                            for(let child of childElement){
                                if(!child) continue
                                if(!(child instanceof Array)){ // element of the array is an HTML node
                                    child ? element.appendChild(child) : null
                                }else{ // element of the array is a single component of the form [componentFunc, props, children]
                                    if(typeof child[0] === "function"){
                                        mount2(child[0], element, child[1], child[2], componentPath, childElement.indexOf(child))
                                    }else{
                                        for(let c of child){
                                            if(!c) continue
                                            if(typeof c === "function" || typeof c === "object"){
                                                mount2(c[0], element, c[1], c[2], componentPath, childElement.indexOf(child))
                                            }else{
                                                element.appendChild(c)
                                            }
                                        }       
                                    }
                                }
                            }
                        }else{ // return value is a single component of the form [componentFunc, props, children]
                            mount2(childElement[0], element, childElement[1], childElement[2], componentPath)
                        }
                    }
                }
            }
        }
    }

    return element
}

// function mount(component, parentDOMElement){
function mount(element, parentDOMElement){
    // const element = createDOMElement(component())
    parentDOMElement.appendChild(element)
    return {
        unmount : function unmount(){
            parentDOMElement.removeChild(element)
        }, 
        remount : function remount(){
            parentDOMElement.replaceChild(element, element)
        }

    }
}

let useStateCountInComponent = 0
let useEffectCountInComponent = 0
let useRefCountInComponent = 0
let useReducerCountInComponent = 0
let useLayoutEffectCountInComponent = 0
let currentComponentPath = ""
const collection = {}
function mount2(component, parentDOMElement, propsOfComponent = null, childrenOfComponent = null, componentPath = "", key=0, parentRerender){
    // console.log("is context provider : ", component.isProvider)
    // const returnValue = component({...propsOfComponent, children: childrenOfComponent})
    if( component.isProvider ){
        // propsOfComponent.value && console.log("value of the provider : ", propsOfComponent.value)
        const contextProvider = new component(propsOfComponent.value)
        // console.log("context collection : ", contextCollection)
        contextCollection[contextProvider.indexOfContext].value = propsOfComponent.value
        mount2(component.component, parentDOMElement, null, childrenOfComponent, componentPath, 0, parentRerender)
        return
    }


    let isRerender = false
    // showCollection()
    
    function createElementInCollection(){
        return collection.push({}) - 1
    }
    
    function initializeCollectionElement(index, parentDOMElement, rerender){
        collection[index] = {...collection[index], isInitialRender: true, prevState: null, parentDOMElement, rerender}
    }
    
    
    function updateCollectionElement(index, componentJSXObject, element){
        collection[index] = {...collection[index], componentJSXObject, element}
    }
    // function showCollection(){
    //     for(let i in collection){
    //     }
    // }
    
    // const index = createElementInCollection()
    let thisComponentPath
    if(propsOfComponent && propsOfComponent.key){
        thisComponentPath = componentPath + "-" + component.name + "/" + parentDOMElement.nodeName + "/" + propsOfComponent.key
        // if a component has multiple instances of the same component in the same level in the hierarcy those component instances must have a key prop with a unique value (unique integer is recommended)
    }else{
        thisComponentPath = componentPath + "-" + component.name + "/" + parentDOMElement.nodeName + "/" + key
    }


    if(parentRerender == true){
        // console.log("paren rerender : ", parentDOMElement)
        // console.log("component : ", component)
        // console.log("rerender : ", collection[thisComponentPath].rerender)
        // collection[thisComponentPath].rerender()


        useStateCountInComponent = 0
        useEffectCountInComponent = 0
        useRefCountInComponent = 0
        useReducerCountInComponent = 0
        useLayoutEffectCountInComponent = 0
        currentComponentPath = thisComponentPath
        const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
        // const element = createDOMElement(componentJSXObject)
        const updatedElement = createDOMElement(componentJSXObject, thisComponentPath)
        if(updatedElement instanceof Array){
            mount2(updatedElement[0], parentDOMElement, updatedElement[1], updatedElement[2], thisComponentPath, 0, true)
            // console.log("array instance : done")
            return
        }
        if(collection[thisComponentPath] && collection[thisComponentPath].element){
            parentDOMElement.replaceChild(updatedElement, collection[thisComponentPath].element)
        }else{
            parentDOMElement.appendChild(updatedElement)
        }
        
        // TODO : instead of replacing the entire HTML node, replace only the part/parts that has been changed in the hierarcy
        
        if(collection[thisComponentPath]){
            collection[thisComponentPath].element = updatedElement
        }else{
            collection[thisComponentPath] = {element: updatedElement, isInitialRender: true, prevState: null, parentDOMElement, rerender}
        }

        return
    }

    // console.log("parent: ", parentDOMElement.nodeName)
    // console.log("component path : ", thisComponentPath)
    // const index = thisComponentPath
    // if(!isRerender){
        function rerender(){
            isRerender = true
            // console.time("Time to rerender : ")
            useStateCountInComponent = 0
            useEffectCountInComponent = 0
            useRefCountInComponent = 0
            useReducerCountInComponent = 0
            useLayoutEffectCountInComponent = 0
            currentComponentPath = thisComponentPath
            const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
            // const element = createDOMElement(componentJSXObject)
            const updatedElement = createDOMElement(componentJSXObject, thisComponentPath)
            if(updatedElement instanceof Array){
                mount2(updatedElement[0], parentDOMElement, updatedElement[1], updatedElement[2], thisComponentPath, 0, true)
                return
            }
            if(collection[thisComponentPath] && collection[thisComponentPath].element){
                parentDOMElement.replaceChild(updatedElement, collection[thisComponentPath].element)
            }else{
                parentDOMElement.appendChild(updatedElement)
            }
            
            // TODO : instead of replacing the entire HTML node, replace only the part/parts that has been changed in the hierarcy
            
            if(collection[thisComponentPath]){
                collection[thisComponentPath].element = updatedElement
            }else{
                collection[thisComponentPath] = {element: updatedElement, isInitialRender: true, prevState: null, parentDOMElement, rerender}
            }
            // console.timeEnd("Time to rerender : ")
            // isRerender = false
        }

        // initializeCollectionElement(index, parentDOMElement, rerender)
        collection[thisComponentPath] = {...collection[thisComponentPath], isInitialRender: true, prevState: null, parentDOMElement, rerender}
    // }
    
    // propcess and create the child element hierarcy enclosed by a Component
    // const childElement = createDOMElement()
    
    useStateCountInComponent = 0
    useEffectCountInComponent = 0
    useRefCountInComponent = 0
    useReducerCountInComponent = 0
    useLayoutEffectCountInComponent = 0
    currentComponentPath = thisComponentPath
    const componentJSXObject = component({...propsOfComponent, children: childrenOfComponent})
    let element = createDOMElement(componentJSXObject, thisComponentPath)
    if(element instanceof Array){
        mount2(element[0], parentDOMElement, element[1], element[2], thisComponentPath)
        return
    }
    function render(){
        parentDOMElement.appendChild(element)
    }
    
    // function rerender(){
    //     useStateCountInComponent = 0
    //     const componentJSXObject = component(index, {props: propsOfComponent, children: childrenOfComponent})
    //     // const element = createDOMElement(componentJSXObject)
    //     const updatedElement = createDOMElement(componentJSXObject, thisComponentPath)
    //     parentDOMElement.replaceChild(updatedElement, element)
    //     element = updatedElement
    // }
    
    // function updateState(newState){
    //     collection[index] = newState
    //     // rerender()
    // }
    
    // updateCollectionElement(index, componentJSXObject, element)

    if(!isRerender){ // stop the current rendering process if a rerender occurs in the middle of the component function execution
        collection[thisComponentPath] = {...collection[thisComponentPath], componentJSXObject, element}
        render()
    }


    // return [showCollection, updateState, render, rerender]
    return []
}

function deepCopy(variable) {
    // Check if the variable is a primitive value (number, string, boolean, null, undefined)
    if (variable === null || typeof variable !== 'object') {
        return variable; // Primitives are copied directly
    }
    
    // Skip cloning of known native objects and types
    const nonCloneableTypes = [
        '[object Window]', '[object HTMLDocument]', '[object HTMLElement]', '[object WebSocket]',
        '[object File]', '[object Blob]', '[object Function]', '[object Audio]', '[object Video]',
        '[object Date]', '[object RegExp]', '[object Error]', '[object Image]',
        '[object Map]', '[object Set]', '[object WeakMap]', '[object WeakSet]',
        '[object Promise]', '[object Proxy]', '[object AudioContext]', '[object CanvasRenderingContext2D]',
        '[object Location]', '[object XMLHttpRequest]', '[object Event]', '[object FileList]', '[object DataTransfer]'
    ];

    // Get object type as a string
    const objType = Object.prototype.toString.call(variable);
    
    // If the object type is in the non-clonable list, return it as is
    if (nonCloneableTypes.includes(objType)) {
        return variable;
    }

    // Check if the variable is an array
    if (Array.isArray(variable)) {
        return variable.map(item => deepCopy(item)); // Recursively copy each item in the array
    }

    // Create a new object with the same prototype as the original
    const copy = Object.create(Object.getPrototypeOf(variable));
    
    // Check if the variable is an object
    // if (typeof variable === 'object') {
    //     // const copy = {};
    //     for (const key in variable) {
    //         if (variable.hasOwnProperty(key)) {
    //             copy[key] = deepCopy(variable[key]); // Recursively copy each property
    //         }
    //     }
    //     return copy;
    // }
    
    // // For anything else, return the original variable (shouldn't reach this point for typical values)
    // return variable;

    // Recursively copy properties, but skip over any non-enumerable properties (e.g., inherited properties)
    for (const key in variable) {
        if (variable.hasOwnProperty(key)) {
            try {
                copy[key] = deepCopy(variable[key]);  // Recursively deep copy each property
            } catch (e) {
                console.warn(`Could not deep copy property "${key}" of object type "${objType}" due to error: ${e.message}`);
            }
        }
    }

    // Return the deep copied object
    return copy;
}

export function useReducer(reducer, initArg){ // function reducer(currentState, action)

    if(reducer.length !== 2) throw Error("reducer function should be of the form : function(currentState, action)")
    if(!initArg && !initState) throw Error("Either initArg or initState must be specified")
    
    const currentReducerIndex = useReducerCountInComponent
    const componentPath = currentComponentPath
    useReducerCountInComponent++

    if(collection[componentPath].reducer == null){
        collection[componentPath].reducer = {}
    }
    
    if(collection[componentPath].reducer[currentReducerIndex] == null){
        // collection[componentPath].reducer[currentReducerIndex] = initArg ? reducer(initArg) : initState
        collection[componentPath].reducer[currentReducerIndex] = initArg
    }

    const currentState = deepCopy(collection[componentPath].reducer[currentReducerIndex])

    return [ // return value : [state, dispatch]
        currentState, // a copy of the reducer should be returned here instead of a reference to the original reducer
        function (action){ // action is an object of the form : {type: "action type", payload: "data to be used to calculate the new state"}

            if(typeof action !== "object"){
                throw Error("action argument should be an object")
            }

            if(action && (action.type === undefined || action.payload === undefined)){
                throw Error('action argument supplied is not valid. action is an object of the form : {type: "action type", payload: "data to be used to calculate the new state"}')
            }

            const newState = reducer(deepCopy(collection[componentPath].reducer[currentReducerIndex]), action)

            
            if(collection[componentPath].reducer[currentReducerIndex] !== newState){
                if(typeof newState === "object"){
                    if(!Object.is(collection[componentPath].reducer[currentReducerIndex], newState)){
                        collection[componentPath].reducer[currentReducerIndex] = newState
                        // collection[componentPath].rerender()
                        // console.log("pushing : ", componentPath)
                        // collection[componentPath].childRerenders[currentRerenderIndex].push({cpLength: componentPath, func: ()=>collection[componentPath].rerender(action)})
                        addTaskToQueue({cp: componentPath, func: ()=>collection[componentPath].rerender(action)})
                        // addRender(componentPath, collection[componentPath].rerender)
                        // globalRender()
                    }
                }else{
                    collection[componentPath].reducer[currentReducerIndex] = newState
                    // collection[componentPath].rerender()
                    // console.log("pushing : ", componentPath)
                    // collection[componentPath].childRerenders[currentRerenderIndex].push({cpLength: componentPath, func: ()=>collection[componentPath].rerender(action)})
                    addTaskToQueue({cp: componentPath, func: ()=>collection[componentPath].rerender(action)})
                    // addRender(componentPath, collection[componentPath].rerender)
                    // globalRender()
                }
            }
            // console.log(collection[componentPath].reducer[currentReducerIndex])
        }
    ]
}

export function useState(initialValue){
    const currentStateIndex = useStateCountInComponent
    const componentPath = currentComponentPath
    useStateCountInComponent++
    // console.log(collection)
    if(collection[componentPath].state == null){
        // collection[index].state = initialValue
        collection[componentPath].state = {}
    }
    
    if(collection[componentPath].state[currentStateIndex] == null){
        collection[componentPath].state[currentStateIndex] = initialValue
    }
    
    // else{
        //     collection[index].rerender()
        // }

    const currentState = deepCopy(collection[componentPath].state[currentStateIndex])

    return [
        // collection[index].state, 
        currentState, // a copy of the state should be returned here instead of a reference to the original state
        function (newState){
            // console.log("state index : ", componentPath, "  collection : ", collection)
            // console.log(collection[componentPath].state[currentStateIndex])

            // -------------------------- PREV : DEL ------------------------------------
            // if(typeof newState == "function"){
            //     collection[componentPath].state[currentStateIndex] = newState(collection[componentPath].state[currentStateIndex])
            // }else{
            //     collection[componentPath].state[currentStateIndex] = newState
            // }
            // collection[componentPath].rerender()
            // --------------------------------------------------------------------

            if(typeof newState == "function"){
                newState = newState(collection[componentPath].state[currentStateIndex])
            }
            if(collection[componentPath].state[currentStateIndex] !== newState){
                if(typeof newState === "object"){
                    if(!Object.is(collection[componentPath].state[currentStateIndex], newState)){
                        collection[componentPath].state[currentStateIndex] = newState
                        // collection[componentPath].rerender()
                        // console.log("pushing : ", componentPath, newState)
                        // console.log("current rerender index sseq: ", currentRerenderIndex, componentPath)
                        // try{
                            // collection[componentPath].childRerenders[currentRerenderIndex].push({cpLength: componentPath.length, func: ()=>collection[componentPath].rerender(newState)})
                        addTaskToQueue({cp: componentPath, func: ()=>collection[componentPath].rerender(newState)})
                        // }catch(err){
                        //     console.log("rerender index value : ", collection[componentPath].childRerenders)
                        //     // console.log("comp path : ", componentPath)
                        //     // console.log("rerender index value : ", currentRerenderIndex)
                        // }
                        // addRender(componentPath, collection[componentPath].rerender)
                        // globalRender()
                        // console.log("rerendering...")
                    }
                }else{
                    collection[componentPath].state[currentStateIndex] = newState
                    // collection[componentPath].rerender()
                    // console.log("pushing : ", componentPath, newState)
                    // collection[componentPath].childRerenders[currentRerenderIndex].push({cpLength: componentPath.length, func: ()=>collection[componentPath].rerender(newState)})
                    addTaskToQueue({cp: componentPath, func: ()=>collection[componentPath].rerender(newState)})
                    // addRender(componentPath, collection[componentPath].rerender)
                    // globalRender()
                    // console.log("rerendering...")
                }
            }
        }
    ]
}

function deepCompare(obj1, obj2) {
    // Check if both values are primitives
    if (obj1 === obj2) {
        return true; // Identical primitives
    }

    // If either is null or not an object, return false (mismatch)
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    // Compare object prototypes
    // if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) {
    //     return false;
    // }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Compare each key in obj1 with obj2 recursively
    for (const key of keys1) {
        if (!keys2.includes(key)) {
            return false; // Mismatched keys
        }
        if (!deepCompare(obj1[key], obj2[key])) {
            return false; // Mismatched values
        }
    }

    return true; // All checks passed
}

export function useLayoutEffect(cb, deps){ // cb(element) - root element of the component is passed as an argument to the callback
    const currentLayoutEffectIndex = useLayoutEffectCountInComponent
    const componentPath = currentComponentPath
    useLayoutEffectCountInComponent++
    // console.log(console.log("useLayoutEffectCountInComponent : ", useLayoutEffectCountInComponent))

    if(collection[componentPath].layoutEffect == null){
        collection[componentPath].layoutEffect = {}
    }
    if(collection[componentPath].layoutEffect[currentLayoutEffectIndex] == null){
        collection[componentPath].layoutEffect[currentLayoutEffectIndex] = {
            prevDependencyArray: deps,
            callbackQueue: []
        }
        collection[componentPath].layoutEffect[currentLayoutEffectIndex].callbackQueue.push(cb)
    }else{

        if(collection[componentPath].layoutEffect[currentLayoutEffectIndex].prevDependencyArray && collection[componentPath].layoutEffect[currentLayoutEffectIndex].prevDependencyArray.length != deps.length){
            throw Error("Size of the dependency array does not match with the size of the previous dependency array")
        }

        // const size = deps.length
        // let isSameDependencies = true
        // for(let i = 0; i < size; i++){
        //     if(collection[componentPath].layoutEffect[currentLayoutEffectIndex].prevDependencyArray[i] !== deps[i]){
        //         isSameDependencies = false
        //     }
        // }
        let isSameDependencies
        if(deps === undefined){
            isSameDependencies = false
        }else if(deps.length === 0){
            isSameDependencies = true
        }
        else {
            isSameDependencies = deepCompare(collection[componentPath].layoutEffect[currentLayoutEffectIndex].prevDependencyArray, deps)
        }

        // if any one of the dependencies are different the callback function is invoked and the current dependency array is set as the previous dependency array
        if(!isSameDependencies){
            collection[componentPath].layoutEffect[currentLayoutEffectIndex].callbackQueue.push(cb)
            collection[componentPath].layoutEffect[currentLayoutEffectIndex].prevDependencyArray = deps
        }
    }
}

export function useEffect(cb, deps){
    const currentEffectIndex = useEffectCountInComponent
    const componentPath = currentComponentPath
    useEffectCountInComponent++
    // if(collection[index].isInitialRender){
    //     collection[index].prevState = collection[index].state
    //     cb()
    //     collection[index].isInitialRender = false
    // }else{
    //     for(let dep of deps){
    //         if(dep != collection[index].prevState){
    //             cb()
    //             collection[index].prevState = dep
    //         }
    //     }
    // }
    if(collection[componentPath].effect == null){
        collection[componentPath].effect = {}
    }
    if(collection[componentPath].effect[currentEffectIndex] == null){
        collection[componentPath].effect[currentEffectIndex] = {
            prevDependencyArray: deps
        }
        const onUnmount = cb()
        collection[componentPath].effect[currentEffectIndex].onUnmount = onUnmount
    }else{

        if(collection[componentPath].effect[currentEffectIndex].prevDependencyArray && collection[componentPath].effect[currentEffectIndex].prevDependencyArray.length != deps.length){
            throw Error("Size of the dependency array does not match with the size of the previous dependency array")
        }

        // const size = deps.length
        // let isSameDependencies = true
        // for(let i = 0; i < size; i++){
        //     if(collection[componentPath].effect[currentEffectIndex].prevDependencyArray[i] !== deps[i]){
        //         isSameDependencies = false
        //     }
        // }
        let isSameDependencies
        if(deps === undefined){
            isSameDependencies = false
        }else if(deps.length === 0){
            isSameDependencies = true
        }else{
            isSameDependencies = deepCompare(collection[componentPath].effect[currentEffectIndex].prevDependencyArray, deps)
        }

        // if any one of the dependencies are different the callback function is invoked and the current dependency array is set as the previous dependency array
        if(!isSameDependencies){
            collection[componentPath].effect[currentEffectIndex].prevDependencyArray = deps
            // Error resolved : callback function has to be called after substitution
            // Othervise the same useEffect will be executed until the Call stack size exceeds
            cb()
        }
    }
}

// let yyy = ""
// export function useTest(t){
//     yyy = t
// }

class Ref{
    current
    constructor(){
        this.current = undefined
    }
}

export function useRef(query){
    const currentRefIndex = useRefCountInComponent
    const componentPath = currentComponentPath
    useRefCountInComponent++
    // cannot be used within the component body has to be placed in a call back function of some event
    // because we do not have access to the dom before it is being rendered

    // return collection[index].parentDOMElement

    if(collection[componentPath].ref == null){
        collection[componentPath].ref = {}
    }

    if(!query){
        const newRef = new Ref()

        if(collection[componentPath].ref[currentRefIndex] == null){
            collection[componentPath].ref[currentRefIndex] = newRef
        }
        
        return collection[componentPath].ref[currentRefIndex]
    }

    return collection[currentComponentPath].parentDOMElement.querySelectorAll(query) // returns a NodeList
}


// let globalRender = null
function createDOM(component, parentDOMElement){
    // parentDOMElement.appendChild(createDOMElement(component()))
    // const result = mount(createDOMElement(components["Test"]()), parentDOMElement)
    // const [showCollection, updateState] = mount2(component, parentDOMElement, "", "", "Root")
    // globalRender = function(){
    //     createComponent(component, parentDOMElement, "", "", "Root")
    // }
    const compTree = []
    const jsx = createComponent(component, parentDOMElement, "", "", "Root", 0, false, compTree)
    // const html = jsxToHTML(jsx)
    // console.log("jsx : ", jsx)
    // console.log("html : ", html)
    // parentDOMElement.appendChild(html)
    // initialized = true
    // processQueue()
    // if(rerenderQueue.length > 0){
    //     rerenderQueue.shift()()
    // }
    // while(rerenderQueue.length > 0){
    //     rerenderQueue.shift().func()
    // }
    // setInterval(()=>{
    //     // const keys = Object.keys(collection)
    //     // for(let key of keys){
    //     //     // console.log(collection[key].childRerenders)
    //     // }
    //     console.log("rList: ", rerenderQueue)
    //     // while(rerenderQueue.length > 0){
    //     //     rerenderQueue.shift().func()
    //     // }
    // }, 1000)
    // console.log("compTree: ", compTree)
    // console.log("collection : ", collection)
    // setTimeout(()=>{
    //     showCollection()
    // }, 5000)

    // const x = {}
    // x.state = "test var value"

    // updateState(100)
    // const u1 = result.unmount
    // const r = result.remount
    // mount(createDOMElement(components["Test2"]()), parentDOMElement)
    // // setTimeout(() => {
    // //     u1()
    // // }, 10000);
    // setTimeout(() => {
    //     r()
    // }, 5000);
}

// class createContext{
//     constructor(defaultValue){
//         this.value = defaultValue
//     }

//     provider(){

//     }
// }

class Context{
    // #index
    // #defaultValue
    // #name
    #value
    constructor(index, defaultValue, name = ""){
        this.index = index
        this.defaultValue = defaultValue
        this.name = name ? name : "name_not_given"
        this.#value = defaultValue

        this.Provider = class {
            static isProvider = true
            static component({children}){
                return {
                    type: "div",
                    props: {className: "gg"},
                    children: [
                        {
                            type: "EXPRESSION",
                            props: {},
                            children
                        }
                    ]
                }
            }
            constructor(value){
                this.indexOfContext = index
                this.value = value
            }
        }
    }

    set value(Value){
        if(!Value){
            this.#value = this.defaultValue
        }else{
            this.#value = Value
        }
    }

    get value(){
        return this.#value
    }

    // Provider({children}){

        // this._proto = new Provider()

        // return {
        //     type: "div",
        //     props: {},
        //     children: [
        //         {
        //             type: "EXPRESSION",
        //             props: {},
        //             children: [()=>children]
        //         }
        //     ]
        // }

    //     return new Provider()
    // }
}

class ContextValue{
    // #index
    // #defaultValue
    // #name
    constructor(name="", value){
        this.name = name
        this.value = value
    }
}

const contextCollection = []
export function createContext(defaultValue, name = ""){
    // const index = contextCollection.push(new ContextValue(name, defaultValue)) - 1
    // console.log("contexts : ", contextCollection)
    // console.log("context value : ", contextCollection[index])
    // console.log("default value : ", defaultValue)
    // return new Context(index, defaultValue, name)
    const index = contextCollection.push({}) - 1
    const newContext = new Context(index, defaultValue, name)
    contextCollection[index] = newContext
    return newContext
}

function getContextObj(context){
    if(typeof context === "string"){
        const contextObj = contextCollection.find((c) => c.name === context)
        if(!contextObj) throw Error(`There is no context named "${context}". check the name passed to the useContext() function.`)
            return contextObj
    }else if(context instanceof Context){
        const index = context.index
        let contextObj
        try{
            contextObj = contextCollection[index]
        }catch(err){
            throw Error("context object passed to the useContext() function is invalid.")
        }
        return contextObj
    }else{
        throw Error("context object passed to the useContext() function is invalid.")
    }
}

export function useContext(context){
    // let value
    // if(typeof context === "string"){
    //     const contextObj = contextCollection.find((c) => c.name === context)
    //     if(!contextObj) throw Error(`There is no context named ${context}. check the name passed to the useContext() function.`)
    //     value = contextObj.value
    // }else{
    //     const index = context.index
    //     let contextObj
    //     try{
    //         contextObj = contextCollection[index]
    //     }catch(err){
    //         throw Error("context object passed to the useContext() function is invalid.")
    //     }
    //     value = contextObj.value
    // }
    // return value
    const contextObj = getContextObj(context)
    return contextObj.value
}

export function setContext(context, value){
    try{
        const index = context.index
        contextCollection[index].value = value
    }catch(err){
        throw Error("context object passed to the useContext() function is invalid.")
    }
}

export default createDOM