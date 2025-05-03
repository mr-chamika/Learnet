const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

// const inputFilePath = "./react_lite/test.js"
// const outputFilePath = "./react_lite_obf/output-obfuscated.js"

function obfuscateor(inputFilePath, outputFilePath, reserved){
    // Read the original file
    const code = fs.readFileSync(inputFilePath, 'utf8');
    
    // Obfuscate the code with basic options
    try {
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: true,                 // Minify the code (removes whitespace)
        controlFlowFlattening: true,   // Increases obfuscation by flattening control flow
        deadCodeInjection: false,      // Try without dead code injection first
        stringArray: true,             // Use string arrays for obfuscation
        stringArrayEncoding: ['base64'], // Use base64 encoding for string arrays
        rotateStringArray: true,       // Adds extra obfuscation by rotating string arrays
        mangle: true,                  // Mangling variable and function names
        stringArrayThreshold: 0.75,     // Controls how many string literals will be replaced
        reservedNames: reserved
      }).getObfuscatedCode();
    
      // Write the obfuscated code to a new file
      fs.writeFileSync(outputFilePath, obfuscatedCode);
      console.log('Obfuscation completed successfully.');
    } catch (error) {
      console.error('Obfuscation error:', error);
    }
}

module.exports = {obfuscateor}