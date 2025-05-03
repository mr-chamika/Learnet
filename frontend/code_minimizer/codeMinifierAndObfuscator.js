// const fs = require('fs');
// const path = require('path');
// const Terser = require('terser');
// const JavaScriptObfuscator = require('javascript-obfuscator');

// // Define the input and output folder paths
// const inputFolder = './react_lite';  // Path to your folder containing .js files
// const outputFolder = './react_lite_obf'; // Path where the processed files will be saved

// // Ensure output directory exists
// if (!fs.existsSync(outputFolder)) {
//     fs.mkdirSync(outputFolder);
// }

// // Function to minify and obfuscate JavaScript files
// async function processFile(filePath, outputFilePath) {
//     try {
//         // Read the file content
//         const code = fs.readFileSync(filePath, 'utf8');

//         // Minify using Terser
//         const minifiedResult = await Terser.minify(code);
//         if (minifiedResult.error) {
//             console.error(`Error during minification of ${filePath}`, minifiedResult.error);
//             return;
//         }

//         // Obfuscate using JavaScript Obfuscator
//         const obfuscatedResult = JavaScriptObfuscator.obfuscate(minifiedResult.code, {
//             compact: true,
//             controlFlowFlattening: true,
//             deadCodeInjection: true,
//             stringArrayEncoding: true,
//             rotateStringArray: true,
//             mangle: true,
//         }).getObfuscatedCode();

//         // Write the processed result to the output file
//         fs.writeFileSync(outputFilePath, obfuscatedResult);
//         console.log(`Processed and saved: ${outputFilePath}`);
//     } catch (err) {
//         console.error(`Error processing file ${filePath}:`, err);
//     }
// }

// // Function to process all .js files in a folder
// function processFolder(inputFolder, outputFolder) {
//     // Get all .js files from the input folder
//     fs.readdir(inputFolder, (err, files) => {
//         if (err) {
//             console.error(`Error reading folder ${inputFolder}:`, err);
//             return;
//         }

//         files.forEach((file) => {
//             const extname = path.extname(file);
//             if (extname === '.js') {
//                 const inputFilePath = path.join(inputFolder, file);
//                 const outputFilePath = path.join(outputFolder, file);

//                 // Process each file
//                 processFile(inputFilePath, outputFilePath);
//             }
//         });
//     });
// }

// // Start processing
// processFolder(inputFolder, outputFolder);


const path = require("path")
const {terser} = require("./terser")
const {obfuscateor} = require("./jsObfuscator")

const filePaths = ["./test.js", "./transpile.js", "./cssLoader.js", "./cssInjectPlugin.js", "./cssExtractLoader.js", "./createElement.js", "./createDOM.js"]
const reserved = ["transpile", "addComponent", "useState", "useEffect", "useRef", "createDOM", "export", "default"]

async function run(){
    for(let filepath of filePaths){
        const inputPath = path.resolve("./react_lite", filepath)
        const terserOutputPath = path.resolve("./react_lite_min/", path.basename(filepath))
        const obfuscateOutputPath = path.resolve("./react_lite_obf", path.basename(filepath))
        // console.log(inputPath)
        // console.log(path.resolve("./react_lite_min/", path.basename(filepath)))
        // await terser(filepath, `./react_lite_min/${filepath.split("/")[-1]}`)

        await terser(inputPath, terserOutputPath)
        obfuscateor(terserOutputPath, obfuscateOutputPath, reserved)
    }
}

run()