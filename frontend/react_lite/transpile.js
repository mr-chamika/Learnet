const fs = require('fs');
const { javascript } = require('webpack');

function jsxToCreateElement(jsx) {
    jsx = jsx.trim();
    // console.log("jsx : ", jsx)

    const typeMatch = jsx.match(/^<([a-zA-Z0-9]+)(\s|>)/);
    if (!typeMatch) throw new Error('Invalid JSX');

    const type = typeMatch[1];
    // console.log("type : ", type)
    let props = {};
    let children = [];

    const propsMatch = jsx.match(/<\w+\s+([^>]+)>/);
    // const propsMatch = jsx.match(`<\`${type}\`\s+([^>]+)>`);
    // console.log(jsx)
    // const propsMatch = jsx.match(`<\s*div[(?:>)(\s*)]`)
    // console.log("propsMatch: ", propsMatch)
    if (propsMatch) {
        const propsString = propsMatch[1];
        props = {};
        const propPairs = propsString.match(/(\w+)="([^"]*)"/g);
        if (propPairs) {
            propPairs.forEach(pair => {
                const [key, value] = pair.split('=');
                props[key] = value.replace(/"/g, '');
            });
        }
    }

    const innerContent = jsx.match(/>(.*)<\/\w+>/s);
    // console.log(innerContent)
    if (innerContent) {
        const innerJSX = innerContent[1].trim();
        // console.log("trimmed innerContent: ", innerJSX)
        const childElements = innerJSX.match(/<[^>]+>[^<]*<\/[^>]+>/g);
        if (childElements) {
            children = childElements.map(childJSX => jsxToCreateElement(childJSX));
        } else {
            children = [innerJSX];
        }
    }

    function createTextElement(text){
        return {
            type: "TEXT_ELEMENT",
            props: {
                nodeValue: text,
                children: []
            }
        }
    }

    // return `React.createElement('${type}', ${Object.keys(props).length ? JSON.stringify(props) : 'null'}, ${children.length ? children.join(', ') : ''})`;
    return {type, ...props, children: children.map(child => {
        typeof child == "object" ? child : createTextElement(child)
    })}
}

function jsxToCreateElementMine(jsx){
    jsx = jsx.trim()
    // const typeMatch = jsx.match(/^<([a-zA-Z0-9]+)(\s|>)/);
    scope = 0
    tagStack = []

    tag = ""
    isStartingTag = false
    props = {}
    text = ""
    if(jsx[0] !== "<") throw Error("Invalid JSX")
    for(let i = 0; i < jsx.length; i++){
        switch(jsx[i]){
            case "<": {
                if(isStartingTag){
                    isStartingTag = false
                    isClosingTag = true
                }else{
                    isStartingTag = true
                }
            }
            case ">": {
                isStartingTag = false
                tagStack.push(tag)
                tag = ""
            }
            default:
                text+= jsx[i]
                 
        }
    }
}

function jsxToCreateElementMine2(jsx){
    jsx = jsx.trim()
    const typeMatch = jsx.match(/^<\s*([a-zA-Z]+[0-9]?)([^>\/]*)(?:>|\/>)(.*)/)

    const type = typeMatch[1]
    let props = {}
    typeMatch[2].trim().split(" ").filter(v=>v?true:false).map(v=>v.split("=")).forEach(v=>props[v[0]] = v[1]?v[1].slice(1, -1):v[1])
    const next = typeMatch[3]
    
    
    // console.log("type : ", type)
    // console.log("props : ", props)
    // console.log("children : ", next)
    
    scope++
    tagStack.push(type)    
}


function jsxToCreateElementMine3(jsx){
    jsx = jsx.trim()
    
    const typeMatch = jsx.match(/<\s*([a-zA-Z]+[0-9]?)([^>\/]*)(>|\/>)(.*)/)
    
    const type = typeMatch[1]
    let props = {}
    typeMatch[2].trim().split(" ").filter(v=>v?true:false).map(v=>v.split("=")).forEach(v=>props[v[0]] = v[1]?v[1].slice(1, -1):v[1])
    const isSelfClosingTag = typeMatch[3] == "/>"
    const next = typeMatch[4]
    
    
    // console.log("type : ", type)
    // console.log("props : ", props)
    // console.log("self closing : ", isSelfClosingTag)
    // console.log("children : ", next)
    // console.log("tagStack : ", tagStack)
    // console.log("scope : ", scope)
    
    scope++
    tagStack.push(type)
    jsxToCreateElementMine3(next)
    
    // if(isSelfClosingTag) return {type, props, children: null}
    // return {type, props, children: jsxToCreateElement(next)}
    
}


function calculateEnd(str, startSymbol, endSymbol){
    let i
    // let i = str.indexOf(startSymbol);
    // console.log("IIIIIIIII : ", str[i])
    const parenthesesStack = [startSymbol]
    for(i = 0; i < str.length; i++){
        switch(str[i]){
            case startSymbol : {
                parenthesesStack.push(startSymbol)
                // console.log("parenthesesStack : ", parenthesesStack)
                break
            }
            case endSymbol : {
                parenthesesStack.pop()
                // console.log("parenthesesStack : ", parenthesesStack)
                break
            }
        }
        if(parenthesesStack.length === 0){
            return i
        }
    }
}

function propStringToObjUtil(pstr, propsObj){
    pstr = pstr.trim()
    const match = pstr.match(/^(\w*)\s*=\s*([^]*)/)
    // console.log(match)

    if(!match) return

    const propName = match[1]
    const remainder1 = match[2]
    // console.log("remainder : ", remainder1)
    
    const match2 = remainder1.trim().match(/(\{|["'])([^]*)/)
    const isString = match2[1] != "{"
    const remainder2 = match2[2]
    // console.log("remainder2 : ", remainder2)

    let propValue
    let next
    let endIndex

    // console.log("match 1 : ", match)
    // console.log("match 2 : ", match2)

    if(isString){
        const quoteType = match2[1]
        // endIndex = calculateEnd(remainder2, quoteType, quoteType)
        if(quoteType == "'") endIndex = remainder2.indexOf("'")
        else endIndex = remainder2.indexOf('"')
        propValue = remainder2.slice(0, endIndex)
    }else{
        // console.log("curly")
        endIndex = calculateEnd(remainder2, "{", "}")
        propValue = `<noquote>${remainder2.slice(0, endIndex).replaceAll(/\\"/g, "\"")}<noquote>`
    }
    // console.log("end index val : ", pstr[endIndex + 1])
    // console.log("prop value: ", propValue)
    next = remainder2.slice(endIndex + 1)

    propsObj[propName] = propValue
    propStringToObjUtil(next, propsObj)
}

function propStringToObj(pstr){
    const propsObj = {}
    propStringToObjUtil(pstr, propsObj)
    // console.log("props obj : ", propsObj)
    return propsObj
}


function processExpression(jsx){
    const paranthesesStack = []
    const indexesStack = []
    const length = jsx.length
    let withinString = false
    const quotationStack = []
    // scope = 0
    for(let i = 0; i < length; i++){
        if(jsx[i] === "'" || jsx[i] === '"' || jsx[i] === "`"){
            if(quotationStack.at(-1) === jsx[i]){
                quotationStack.pop()
                if(quotationStack.length === 0){
                    withinString = false
                }
            }else{
                quotationStack.push(jsx[i])
                withinString = true
            }
            continue
        }
        if(!withinString){
            if(jsx[i] === "("){
                paranthesesStack.push(jsx[i])
                indexesStack.push(i)
                scope++
            }else if(jsx[i] === "{"){
                paranthesesStack.push(jsx[i])
                scope++
            }else if(jsx[i] === ")"){
                const x = paranthesesStack.pop()
                const startingIndex = indexesStack.pop()
                const endingIndex = i

                const converted = jsxToCreateElementMine4(jsx.slice(startingIndex, endingIndex))
                // console.log("aaaaaaa: ", jsx.slice(startingIndex - 1, endingIndex + 1), converted)
                jsx.replace(jsx.slice(startingIndex - 1, endingIndex + 1), 
                    `${JSON.stringify(converted)
                        .replaceAll(/('|")<noquote>/g, "")
                        .replaceAll(/<noquote>('|")/g, "")
                        .replace(/\"/g, "'")
                    }})`.trim()
                )
                // console.log("original : ", jsx.slice(startingIndex, endingIndex + 1))
                scope--
                if(x !== "("){
                    console.log(paranthesesStack, x, jsx[i])
                    throw Error("Parentheses do not match")
                }
            }else if(jsx[i] === "}"){
                const x = paranthesesStack.pop()
                scope--
                if(x !== "{"){
                    console.log(paranthesesStack, x, jsx[i])
                    throw Error("Parentheses do not match")
                }
            }
        }
    }
    return jsx
}

function findJSXAll(expression){
    let curExp = expression
    const jsxParamArr = []
    let indexCorrectionValue = 0
    let jsxParams
    while((jsxParams = findJSX(curExp))){
        jsxParams[0] = jsxParams[0] + indexCorrectionValue
        jsxParams[1] = jsxParams[1] + indexCorrectionValue
        jsxParamArr.push(jsxParams)
        indexCorrectionValue = indexCorrectionValue + jsxParams[1] + 1
        curExp = curExp.slice(jsxParams[1] + 1)
    }
    return jsxParamArr
}

function findJSX(expression){
    const scope = 0
    const tagStack = []
    const jsxParams = findJSXUtil(expression, scope, tagStack, 0)
    if(!jsxParams) return null
    const [begin, end, icVal] = jsxParams
    // console.log(begin, end, icVal)
    // console.log(expression.slice(begin.index + begin[0].length - 1, icVal + end.index + 1))
    return [begin.index + begin[0].length - 1, icVal + end.index + 1]
}

function findJSXUtil(expression, scope, tagStack, indexCorrectionValue){
    // console.log(indexCorrectionValue)
    const oeTagMatch = expression.match(/\(\s*<|>\s*\)/)
    if(!oeTagMatch) return null
    const isJSXOpeningTag = oeTagMatch[0].match(/\(\s*</) ? true : false
    if(isJSXOpeningTag){
        tagStack.push(oeTagMatch)
        return findJSXUtil(expression.slice(oeTagMatch.index + oeTagMatch[0].length), scope, tagStack, oeTagMatch.index + oeTagMatch[0].length + indexCorrectionValue)
    }else{
        const openingTag = tagStack.pop()
        if(tagStack.length === 0){
            return [openingTag, oeTagMatch, indexCorrectionValue]
        }else{
            return findJSXUtil(expression.slice(oeTagMatch.index + oeTagMatch[0].length), scope, tagStack, oeTagMatch.index + oeTagMatch[0].length + indexCorrectionValue)
        }
    }
}

function processExpression2(expression){
    console.log("expression: ", expression)
    const innerJSXMatch = expression.match(/\(\s*<.*>\s*\)/g)
    console.log("innerJSXMatch: ", innerJSXMatch)
    
    innerJSXMatch.forEach(v=>{
        const jsxMatch = v.match(/\(\s*(<.*>)\s*\)/)
        console.log("innerJSXMatch2: ", jsxMatch)
        const converted = jsxToCreateElementMine4(jsxMatch[1])
        console.log("converted : ", converted)
        expression = expression.replace(
            v,
            `${JSON.stringify(converted)
                .replaceAll(/\\('|")<noquote>/g, "")
                .replaceAll(/<noquote>\\('|")/g, "")
                .replace(/\"/g, "'")
            }`.trim()
        )
    })
    return expression
}

function processExpression3(expression){
    // console.log("expression: ", expression)
    const innerJSXMatch = findJSXAll(expression)
    // console.log("innerJSXMatch: ", innerJSXMatch)
    
    const replacements = []
    innerJSXMatch.forEach(v=>{
        const jsxSlice = expression.slice(v[0], v[1])
        const converted = jsxToCreateElementMine4(jsxSlice)
        replacements.push([jsxSlice, converted])
    })

    replacements.forEach(v=>{
        expression = expression.replace(
            v[0],
            `${JSON.stringify(v[1])
                .replaceAll(/\\('|")<noquote>/g, "")
                .replaceAll(/<noquote>\\('|")/g, "")
                .replace(/\"/g, "'")
            }`.trim()
        )
    })
    return expression
}



let scope = 0
let i = 0
let tagStack = []
function jsxToCreateElementMine4Util(jsx){
    let currentI = i
    i+=100
    // console.log("jsx : ", jsx)
    jsx = jsx.trim()
    // console.log(jsx)
    let isExpression
    try{
        isExpression = jsx.match(/({|<)/)[1] == "{"
    }catch(e){
        console.log(jsx)
        throw Error()
    }
    // console.log(isExpression)
    if(isExpression){

        function calculateExpressionEndParenthesesIndex(jsx){
            let i = jsx.indexOf("{");
            // console.log("IIIIIIIII : ", jsx[i])
            const parenthesesStack = []
            for(; i < jsx.length; i++){
                switch(jsx[i]){
                    case "{" : {
                        parenthesesStack.push("{")
                        // console.log("parenthesesStack : ", parenthesesStack)
                        break
                    }
                    case "}" : {
                        parenthesesStack.pop()
                        // console.log("parenthesesStack : ", parenthesesStack)
                        break
                    }
                }
                if(parenthesesStack.length === 0){
                    return i
                }
            }
        }

        // method 1 ________________________________________________________________
        const expressionStartIndex = jsx.indexOf("{") + 1
        const expressionEndIndex = calculateExpressionEndParenthesesIndex(jsx)
        const proceedingText = jsx.slice(0, expressionStartIndex - 1)
        let expression = jsx.slice(expressionStartIndex, expressionEndIndex).replaceAll(/(\r\n|\n|\r|\t)/gm, "").replaceAll(/(\\")/g, "\"").trim()

        const innerMapJSXMatch = expression.trim().match(/\s*\(\s*(<[\s\S]*?)\)\s*\}\s*\)$/)
        // console.log("innerMapJSXMatch : ", innerMapJSXMatch)
        // if(innerMapJSXMatch){
        //     const converted = jsxToCreateElementMine4(innerMapJSXMatch[1].trim())
        //     // console.log("innerMapJSXMatch converted : ", converted)

        //     // for(char of JSON.stringify(converted)){
        //     // console.log(char)
        //     // }


        //     expression = expression.replace(
        //         innerMapJSXMatch[0],
        //         `${JSON.stringify(converted)
        //             .replaceAll(/\\('|")<noquote>/g, "")
        //             .replaceAll(/<noquote>\\('|")/g, "")
        //             .replace(/\"/g, "'")
        //         }})`.trim()
        //     )
        // }

        // const innerJSXMatch = expression.trim().match(/\s*\(\s*(<[\s\S]*?)\)/)
        // // console.log("innerJSXMatch : ", innerJSXMatch)
        // if(innerJSXMatch){
        //     const converted = jsxToCreateElementMine4(innerJSXMatch[1].trim())
        //     // console.log("converted : ", converted)

        //     // for(char of JSON.stringify(converted)){
        //     // console.log(char)
        //     // }


        //     expression = expression.replace(
        //         innerJSXMatch[0],
        //         `${JSON.stringify(converted)
        //             .replaceAll(/\\('|")<noquote>/g, "")
        //             .replaceAll(/<noquote>\\('|")/g, "")
        //             .replace(/\"/g, "'")
        //         }`.trim()
        //     )
        // }

        // console.log("expression: ", expression)
        // const innerJSXMatch = expression.match(/\(\s*<.*>\s*\)/g)
        // console.log("innerJSXMatch: ", innerJSXMatch)
        
        // innerJSXMatch.forEach(v=>{
        //     const jsxMatch = v.match(/\(\s*(<.*>)\s*\)/)
        //     console.log("innerJSXMatch2: ", jsxMatch)
        //     const converted = jsxToCreateElementMine4(jsxMatch[1])
        //     console.log("converted : ", converted)
        //     expression = expression.replace(
        //         v,
        //         `${JSON.stringify(converted)
        //             .replaceAll(/\\('|")<noquote>/g, "")
        //             .replaceAll(/<noquote>\\('|")/g, "")
        //             .replace(/\"/g, "'")
        //         }`.trim()
        //     )
        // })

        expression = processExpression3(expression)
        
        const next = jsx.slice(expressionEndIndex+1)
        
        // console.log("Expression: ", expression)
        // console.log("Proceeding text : ", proceedingText)
        // console.log("Expression next : ", next)
        // _________________________________________________________________________
        
        // method 2 ________________________________________________________________
        // const expMatch = jsx.match(/(\w)(\{[\w0-9]\}|\{[\w.()=]*\}\)\})(.*)/)
        // const proceedingText = expMatch[1]
        // const expression = expMatch[2]
        // const next = expMatch[3]
        // _________________________________________________________________________

        // console.log("expression before : ", expression)
        // console.log("expressoin : ", `<noquote>${expression}<noquote>`)
        
        if(!expression.includes(" ")){
            return [
                [
                    {type: "TEXT_ELEMENT", props: {}, children: proceedingText, id: currentI}, 
                    {type: "EXPRESSION", props: {}, children: `<noquote>${expression}<noquote>`, id: ++currentI}
                ]
                , next]
        }else{
            return [
                [
                    {type: "TEXT_ELEMENT", props: {}, children: proceedingText, id: currentI}, 
                    {type: "EXPRESSION", props: {}, children: `<noquote>()=>{return ${expression}}<noquote>`, id: ++currentI}
                ]
                , next]
        }
    }

    const currentScope = scope
    
    // const typeMatch = jsx.match(/(<|<\/)\s*([a-zA-Z]+[0-9]?)\s*([^>\/]*)(>|\/>)([^]*)/) // working
    const typeMatch = jsx.match(/(<|<\/)\s*([a-zA-Z\.]+[0-9]?)\s*((?:(?:\w+)\s*=\s*(?:["'].*?["']|\{[^]*?\})\s*)*)(>|\/>)([^]*)/) // working
    // const typeMatch = jsx.match(/(<|<\/)\s*([a-zA-Z]+[0-9]?)\s*((?<!=)[^>\/]*(?=>))(>|\/>)([^]*)/) // working
    // const typeMatch = jsx.match(/(<|<\/)\s*([a-zA-Z]+[0-9]?)\s*([^>(\/>)]*)(>|\/>)([^]*)/)
    // const typeMatch = jsx.match(/(<|<\/)\s*([a-zA-Z]+[0-9]?)\s*([\w*=(?:"|')[^>\/(?=>)]*(?:"|')]*)(>|\/>)([^]*)/)
    
    // let typeMatch = jsx.match(/(<|<\/)\s*([a-zA-Z]+[0-9]?)\s*/)
    // jsx = jsx.slice(typeMatch[0].length)
    // extractedPropString = jsx.match

    // if(typeMatch[2] == "a")
    // console.log("typeMatch : ", typeMatch)

    // console.log(typeMatch)

    // console.log("typeMatch : ", typeMatch)

    const isClosingTag = typeMatch[1] == "</"
    const type = typeMatch[2]
    let isAComponent
    if(type.includes(".")){
        const part2 = type.split(".")[1]
        isAComponent = part2[0] === part2[0].toUpperCase()
    }else{
        isAComponent = type[0] === type[0].toUpperCase()
    }
    
    // console.log("type : ", type, " isAComponent : ", isAComponent)

    // console.log("typeMatch : ",typeMatch)
    // console.log("scope : ", scope)
    // console.log("type : ", type)
    // console.log("props: ", typeMatch[3])
    // console.log("next : ", typeMatch[5])
    // console.log("isClosingTag : ", isClosingTag)
    // console.log("stack : ", tagStack)
    // console.log("-1 : ", tagStack[tagStack.length - 1])

    const tagStartIndex = jsx.indexOf("<") + 1
    const proceedingText = jsx.slice(0, tagStartIndex - 1)
    if(isClosingTag){
        // console.log("closing tag : ", type, scope)
        if(tagStack[tagStack.length - 1] === type){
            const next = typeMatch[5]
            // console.log("before : ", tagStack)
            tagStack.pop()
            // console.log("after : ", tagStack)
            scope--
            
            const body = jsx.slice(0, jsx.indexOf(`</${type}>`))
            // console.log("type : ", type)
            // console.log("index of: ", jsx.indexOf(`</${type}>`))
            // console.log("body: ", body)
            if(typeof body == "string"){
                return [{type: "TEXT_ELEMENT", props: {}, children: body, id: currentI}, next]
            }else{
                throw Error("Not only text")
            }
        }else{
            throw Error("Invalid JSX : " + jsx + JSON.stringify({stack : tagStack}))
        }
    }else{
        // console.log("opening tag : ", type, scope)
        let props = {}
        // console.log("prop splitting check : ", typeMatch[3])
        // typeMatch[3]
        // .trim()
        // .split(/[^"'][\w\s]* [\w\s]*[^"']/)
        // .split(/(?<!["'\{}][\w\s=\(\)\{\}\>]*)\s(?![\w\s=\(\)\{\}\>]*["'\}])/)
        // .split(/(?<!["'\{}][\w\s=\(\)\{\}\>]*)\s(?![\w\s=\(\)\{\}\>]*["'\}])/)
        // .filter(v=>v?true:false)
        // .map(v=>v.split(/=(?!>)/))
        // .forEach(v=>{
        //     props[v[0]] = v[1] ? (v[1].startsWith("{") ? `<noquote>${v[1].slice(1, -1)}<noquote>` : v[1].slice(1, -1)) : v[1]
        // })

        // console.log("props obj : ", props)
        props = propStringToObj(typeMatch[3])

        // p = []
        // let x = ""
        // const ps = typeMatch[5]
        // console.log("ps : ", ps)
        // for(let i of ps){
        //     switch(i){
        //         case "'": 
        //             p.push(x)
        //             x = ""
        //             p.push("'")   
        //             break   
        //         case '"':
        //             p.push(x)
        //             x = ""
        //             p.push('"')
        //             break
        //         case "=":
        //             p.push(x)
        //             x = ""
        //             p.push("=")    
        //             break 
        //         default:
        //             x += i
        //     }
        // }

        // console.log("prop spl nw: ", p)

        // const regex = /(\w+)=["']([^"']*)["']/g;

        // let match;
        // while ((match = regex.exec(typeMatch[3])) !== null) {
        //     const key = match[1]; // The property name
        //     const value = match[2]; // The value of the property
        //     props[key] = value;
        // }

        // console.log("prop splitting check 2 : ", props)

        const isSelfClosingTag = typeMatch[4] == "/>"
        let next = typeMatch[5]
        
        if(isSelfClosingTag){
            // jsxToCreateElementMine4Util(next)
            // console.log("_____________________________self closing : ", [{type, props, children: null}, next])
            if(isAComponent){
                return [{type, props, children: null, componentFunction: `<noquote>${type}<noquote>`, id: currentI}, next]
            }else{
                return [{type, props, children: null, id: currentI}, next]
            }
        }else{
            tagStack.push(type)
            let children = []
            scope++
            while(next){
                // console.log("next: ", next)
                const [child, newNext] = jsxToCreateElementMine4Util(next)
                // console.log("child, newNext : ", child, "    ", newNext)
                // console.log("after : ", tagStack)
                // console.log("next : ", newNext)
                next = newNext
                if(child instanceof Array){
                    // for expressions and their proceeding text that are not enclosed within a tag
                    if(child[0].children) children.push(child[0])
                    if(child[1].children) children.push(child[1])
                }else{
                    if(child.type == "TEXT_ELEMENT"){
                        if(child.children) children.push(child)
                    }else{
                        children.push(child)
                    }
                }
                // console.log("children : ", children)

                if(currentScope === scope){
                    // console.log("back to scope")
                    if(isAComponent){
                        return [{type, props, children, componentFunction: `<noquote>${type}<noquote>`, id: currentI}, next]
                    }else{
                        return [{type, props, children, id: currentI}, next]
                    }
                }
            }
            if(isAComponent){
                return [{type, props, children, componentFunction: `<noquote>${type}<noquote>`, id: currentI}, next]
            }else{
                return [{type, props, children, id: currentI}, next]
            }
        }
    }
}

function jsxToCreateElementMine4(jsx){
    return jsxToCreateElementMine4Util(jsx)[0]
}


function jsxToCreateElementMine5(jsx){
    //tokenize
    //parse and create the tree structure

    // console.log(jsx.split(""))

    function tokenize(jsx){ // returns a list of tokens

        function lookAhead(jsx, startingIndex, RegEx){
            jsx.slice(startingIndex).match(RegEx)
        }

        const tokenRegEx = [/(<|<\/)/, /[a-zA-Z]+[0-9]?/, ]

        let i;
        for(i = 0; i < jsx.length; i++){

        }
        
        // const matchType = jsx.match(/\s*< /)
    }
}



// _________TEST jsxToCreateElement() fucntion _______________________

// const jsx = `
//     <div id="test" class="container">
//         <span>Hello</span>
//         <strong>World</strong>
//     </div>`;
// const js = jsxToCreateElement(jsx);

// console.log(js);
// Output: React.createElement('div', {"id":"test","class":"container"}, React.createElement('span', null, 'Hello'), React.createElement('strong', null, 'World'))
// ____________________________________________________________________

function convertComponent(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the JSX inside the `return` statement.
    const jsxMatch = fileContent.match(/return\s*\(([\s\S]*?)\);/);
    if (!jsxMatch) throw new Error('JSX not found in the component');

    const jsx = jsxMatch[1].trim();

    // Convert the JSX to React.createElement
    // console.log(jsx)
    const result = jsxToCreateElement(jsx);
    // console.log(result);
}


// Convert the component in test.jsx
// convertComponent('test.jsx');

function transpile(source) {
    // let source = sourceFileContent
    // const jsxMatch = source.match(/return\s*\(([\s\S]*?)\);/)
    // const jsxMatch = source.match(/return\s*\(\s*(<[\s\S]*?)\);/) // ==================================================== PREV
    // let index = 0
    // const returnPositions = []
    // while((index = source.indexOf("return", index + 6)) >= 0){
    //     returnPositions.push(index)
    // }

    // console.log("return positions: ", returnPositions)

    // let j = 0
    // let i = returnPositions[j]
    // const length = source.length
    // const startPositions = []
    // for(; i < length; i++){
    //     if(source[i] === "("){
    //         startPositions.push(i)
    //         i = returnPositions[++j]
    //     }
    // }

    // console.log("starting positions : ", startPositions)

    // console.log("source : ", jsxMatch)
    // if(!jsxMatch) throw new Error("JSX not found in the component")
    // if(!jsxMatch){ =========================================== PREV
    //     // console.log("No JSX Found") =========================================== PREV
    //     return source =========================================== PREV
    // } =========================================== PREV
    
    // let jsx = jsxMatch[1].trim() =========================================== PREV

    // inner jsx ___________________________________________________________

    // const innerJSXMatch = jsxMatch[1].match(/return\s*\(\s*(<[\s\S]*?)\)/g)
    // if(innerJSXMatch){
    //     for(innerJSX of innerJSXMatch){
    //         const converted = jsxToCreateElementMine4(innerJSX.trim())
            // console.log("JSX CONVERTED : ", converted)
    //         jsx = jsx.replace(innerJSX, `return ${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "")}`.trim())
            // console.log(jsx)
    //     }
    // }
    // console.log("innerJSXMatch : ", innerJSXMatch)

    // _____________________________________________________________________

    // const converted = jsxToCreateElementMine4(jsx) =========================================== PREV

    // console.log(JSON.stringify(converted))
    // return source.replace(jsxMatch[0], `return ${JSON.stringify(converted)}`)
    // console.log(source.replace(jsxMatch[0], `${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "")}`))
    // console.log(source.replace(jsxMatch[0], `${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "")}`))
    // =========================================== PREV
    // return source.replace(jsxMatch[0], `return ${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "").replaceAll(/\\\\("|')/g, "\'").replaceAll(/\\("|')/g, "\'").replaceAll(/\\("|')/g, "\'")}`)
    // =========================================== PREV


    const jsxMatch = source.match(/return\s*\(\s*(<[\s\S]*?)\);/g)
    // console.log("jsxMatch: ", jsxMatch)
    if(jsxMatch){
        jsxMatch.forEach(v=>{
            // console.log("VVVVVVVVVVVVVVVVVV : ", v)
            // const innerJsxMatch = v.match(/\(\s*(<.*>)\s*\);/)
            // console.log("innerJsxMatch: ", innerJsxMatch)
            const converted = jsxToCreateElementMine4(v)
            // console.log("converted : ", `return ${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "").replaceAll(/\\\\("|')/g, "\'").replaceAll(/\\("|')/g, "\'").replaceAll(/\\("|')/g, "\'")}`)
            source = source.replace(v, `return ${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "").replaceAll(/\\\\("|')/g, "\'").replaceAll(/\\("|')/g, "\'").replaceAll(/\\("|')/g, "\'")}`)
        })    
    }

    return source
}

function test(){
    // let filePath = "./src/Pages/Main.jsx"
    let filePath = "./temp/index.jsx"
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const transpiledContent = transpile(fileContent)
    filePath = "./temp/index.transpiled.jsx"
    fs.writeFileSync(filePath, transpiledContent, 'utf8');
}

// test()

module.exports = transpile