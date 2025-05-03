const fs = require('fs');
const path = require('path');

// Loader function
// module.exports = function (source) {
//   const cssImports = [];
  
//   // Use regex to match and extract the CSS imports
//   const regex = /(?:import\s*['"])([\w-\.\/]*\.css)(?:['"])/g
//   const matchArr = source.match(regex);
//   console.log(matchArr)
//   if(matchArr){
//       for(match of matchArr){
//           console.log("match : ", match)
//           const cssFilePath = match.split(" ")[1].slice(1, -1);
//           console.log("css file path : ", cssFilePath)
//           cssImports.push(cssFilePath);
//       }
//   }

//   // Read the content of each CSS file and accumulate it
//   let bundledCSS = '';
//   cssImports.forEach((cssFile) => {
//     const cssPath = path.resolve(__dirname, "src", cssFile);
//     const cssContent = fs.readFileSync(cssPath, 'utf8');
//     bundledCSS += cssContent;
//   });

//   // Emit the bundled CSS content so we can inject it later in the HTML
//   if(bundledCSS)
//     this.emitFile('styles.css', bundledCSS);

//   // Remove the import statements for CSS (since we handle them separately)
// //   console.log(source.replaceAll(regex, ""))
//   return source.replaceAll(regex, '');
// //   return ""
// };



// const cssAccumulator = []; // Global array to accumulate CSS

// module.exports = function(source) {
//   const loaderContext = this;

//   // Push the current CSS content to the accumulator
//   cssAccumulator.push(source);

//   // Hook into Webpack's emit process to output the concatenated CSS
//   loaderContext._compiler.hooks.emit.tapAsync('CssMergePlugin', (compilation, callback) => {
//     // Concatenate all the CSS content
//     const finalCss = cssAccumulator.join('\n');

//     // Emit the concatenated CSS as `style.css`
//     compilation.emitAsset('style.css', {
//       source: () => finalCss,
//       size: () => finalCss.length
//     });

//     callback();
//   });

//   // Return the source as usual for Webpack processing (JavaScript modules can use it)
//   return source;
// };




module.exports = function (source) {
  const cssImports = [];
  
  // Use regex to match and extract the CSS imports
  const regex = /(?:import\s*['"])([\w-\.\/]*\.css)(?:['"])/g
  const matchArr = source.match(regex);
  console.log(matchArr)
  if(matchArr){
      for(match of matchArr){
          console.log("match : ", match)
          const cssFilePath = match.split(" ")[1].slice(1, -1);
          console.log("css file path : ", cssFilePath)
          cssImports.push(cssFilePath);
      }
  }

  if(!this._compilation.__cssAccumulator){
    this._compilation.__cssAccumulator = ""
  }

  if(!this._compilation.__cssFilePaths){
    this._compilation.__cssFilePaths = []
  }

  // Read the content of each CSS file and accumulate it
  let bundledCSS = '';
  cssImports.forEach((cssFile) => {
    const cssPath = path.resolve(__dirname, "../src", cssFile);
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    // bundledCSS += cssContent;

    if(!this._compilation.__cssFilePaths.includes(cssPath)){
      this._compilation.__cssAccumulator += cssContent
      this._compilation.__cssFilePaths.push(cssPath)
    }
  });

  // Emit the bundled CSS content so we can inject it later in the HTML
  // if(bundledCSS)
  //   this.emitFile('styles.css', bundledCSS);


  // Remove the import statements for CSS (since we handle them separately)
//   console.log(source.replaceAll(regex, ""))
  return source.replaceAll(regex, '');
//   return ""
};
