const fs = require("fs");
const transpile = require("./transpile");

// function jsxToCreateElementMine5(jsx){
//     //tokenize
//     //parse and create the tree structure

//     console.log(jsx.split(" ").filter(v=>v?true:false))

//     function tokenize(jsx){ // returns a list of tokens

//         function lookAhead(jsx, startingIndex, RegEx){
//             jsx.slice(startingIndex).match(RegEx)
//         }

//         const tokenRegEx = [/(<|<\/)/, /[a-zA-Z]+[0-9]?/, ]

//         let i;
//         for(i = 0; i < jsx.length; i++){

//         }
        
//         // const matchType = jsx.match(/\s*< /)
//     }
// }

// function transpile(source) {
//     // const jsxMatch = source.match(/return\s*\(([\s\S]*?)\);/)
//     const jsxMatch = source.match(/\(\s*(<[\s\S]*?)\);/)

//     // console.log("source : ", jsxMatch)
//     // if(!jsxMatch) throw new Error("JSX not found in the component")
//     if(!jsxMatch){
//         console.log("No JSX Found")
//         return source
//     }
//     const jsx = jsxMatch[1].trim()
//     const converted = jsxToCreateElementMine5(jsx)
//     // console.log(JSON.stringify(converted))
//     // return source.replace(jsxMatch[0], `return ${JSON.stringify(converted)}`)
//     // console.log(source.replace(jsxMatch[0], `${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "")}`))
//     // return source.replace(jsxMatch[0], `${JSON.stringify(converted).replaceAll(/('|")<noquote>/g, "").replaceAll(/<noquote>('|")/g, "")}`)
//     return ""
// }

function test(){
    let filePath = "./src/index.jsx"
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const transpiledContent = transpile(fileContent)
    filePath = "./temp/index.transpiled.jsx"
    fs.writeFileSync(filePath, transpiledContent, 'utf8');
}

test()


// console.log(JSON.stringify({test: "hello world"}))