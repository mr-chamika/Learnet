// module.exports = function(source) {
//     // return `let style = ${source}`
//     return `${source}`
// }

const fs = require('fs');
const path = require('path');

// Loader function
module.exports = function (source) {
    // this.emitFile('styles.css', source);
    // return ""


    
    if(!this._compilation.__cssAccumulator){
        this._compilation.__cssAccumulator = ""
    }

    // Get the current file's path
    const currentFilePath = this.resourcePath;

    // Regex to match `url()` in CSS
    const urlRegex = /url\(["']?(.+?)["']?\)/g;

    // Replace URLs with processed paths
    const processedSource = source.replace(urlRegex, (match, url) => {
        const resourcePath = path.resolve(this.context, url);

        // Add the font file to Webpack's dependency graph
        this.addDependency(resourcePath);

        // Emit the font file into the output directory
        const outputFileName = path.join('assets/fonts', path.basename(url));
        this.emitFile(outputFileName, fs.readFileSync(resourcePath));

        // Return the updated public path
        return `url(/${outputFileName.replace(/\\/g, '/')})`;
    });

    // this._compilation.__cssAccumulator += source
    // this._compilation.__cssAccumulator += processedSource

    // Add the file path as a comment followed by the CSS
    const cssWithFilePathComment = `\n\n\n/* File: ${currentFilePath} */\n${processedSource}`;

    // Append to the accumulator
    this._compilation.__cssAccumulator += cssWithFilePathComment;
    return ""
};
