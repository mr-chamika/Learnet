const Terser = require('terser');
const fs = require('fs');

// const inputFilePath = "./react_lite/test.js"
// const outputFilePath = "./react_lite_obf/test.min.js"

async function terser(inputFilePath, outputFilePath){
    // Read the original file
    const code = fs.readFileSync(inputFilePath, 'utf8');
    
    // Minify and mangle the code
    const result = await Terser.minify(code, {
      compress: true,  // Compresses the code
      mangle: true     // Obfuscates variable and function names
    });
    
    if (result.error) {
      console.error('Error during minification', result.error);
    } else {
        // console.log(result.code)
      // Write the minified and obfuscated code to a new file
      fs.writeFileSync(outputFilePath, result.code);
      console.log('Minification and obfuscation completed.');
    }
}

module.exports = {terser}
