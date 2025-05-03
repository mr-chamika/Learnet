const path = require("path")
const fs = require("fs")

class FileTypeMismatchError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileTypeMismatchError";
    }
}

class FileSizeExceedError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileSizeExceedError";
    }
}

function saveBase64File(base64Data, filePath) {
    return new Promise((resolve, reject) => {
        // Check if the base64 data includes a data URL prefix (e.g., "data:image/png;base64,")
        const base64Pattern = /^data:(.*?);base64,/;
        const matches = base64Data.match(base64Pattern);
        
        // If a data URL prefix exists, remove it to get the actual base64 string
        if (matches) {
            base64Data = base64Data.replace(base64Pattern, '');
        }

        // Decode base64 string to binary buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Ensure the directory exists before writing the file
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the decoded binary data to a file
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                reject('Error writing file: ' + err);
            } else {
                resolve('File saved successfully');
            }
        });
    });

    // Example usage
    // const base64String = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // base64 data here
    // const savePath = './uploads/myImage.png';
    
    // saveBase64File(base64String, savePath)
    // .then((message) => {
    //     console.log(message); // File saved successfully
    // })
    // .catch((error) => {
    //     console.error(error); // Error writing file
    // });
}

function extractFileMIME(base64Data) {
    // Regular expression to match the MIME type in the base64 string
    const base64Pattern = /^data:(.*?);base64,/;
    const matches = base64Data.match(base64Pattern);
    
    if (matches && matches[1]) {
        return matches[1];  // The MIME type (e.g., "image/png")
    } else {
        return null;  // Return null if the MIME type can't be extracted
    }
}

// Base64 encoding will ensure that the length of the string is a multiple of 4. If the original data is perfectly divisible by 3, no padding is needed. otherwise padding(=) is used
function getBase64FileSize(base64String) {
    // Remove the Base64 prefix (if it exists)
    const base64Data = base64String.split(',')[1];

    // Calculate the size of the Base64 string (in bytes)
    const fileSizeInBytes = (base64Data.length * 3) / 4 - (base64Data.endsWith('==') ? 2 : (base64Data.endsWith('=') ? 1 : 0));

    return fileSizeInBytes;
    // Example usage:
    // const base64String = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...";
    // const fileSize = getBase64FileSize(base64String);
    // console.log(`File size: ${fileSize} bytes`);
}

const saveBase64FileAdvanced = (base64Data, savePath, fileName, allowedFileTypes, maxFileSize, about="", extraInfo = "") => {
    // Extract MIME type
    const mimeType = extractFileMIME(base64Data);

    // Check if the MIME type is allowed
    if (!allowedFileTypes.includes(mimeType)) {
        throw new FileTypeMismatchError(`${about} ${about ? ":" : ""} The file type is not allowed. ${extraInfo}`);
    }

    // Check file size
    const fileSize = getBase64FileSize(base64Data); // File size in bytes
    if (fileSize > maxFileSize) {
        throw new FileSizeExceedError(`${about} ${about ? ":" : ""} The file size exceeds the allowed limit. ${extraInfo}`);
    }

    // Determine the file extension from the MIME type
    const fileExtension = mimeType.split("/")[1]; // Example: "image/jpeg" -> "jpeg"

    // Construct the full file path
    const fullPath = `${savePath}/${fileName}.${fileExtension}`;

    // Save the file
    saveBase64File(base64Data, fullPath);
    return { message: "File saved successfully.", path: fullPath };
};

async function readFileAsync(filePath) {
    // try {
    //     const data = await fs.readFile(filePath);
    //     return data;
    // } catch (error) {
    //     throw new Error(`Error reading file at ${filePath}: ${error.message}`);
    // }

    return new Promise((resolve, reject)=>{
        fs.readFile(filePath, (err, data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
}   

function saveFileAsync(file, destinationPath){
    return new Promise((resolve, reject)=>{
        // Ensure the destination path exists
        fs.mkdir(destinationPath, { recursive: true }, (err)=>{
            // Construct the full file path
            const filePath = path.join(destinationPath, file.filename);
    
            // Write the file content to the specified path
            fs.writeFile(filePath, file.data, (err) => {
                if (err) {
                    reject('Error writing file: ' + err);
                } else {
                    resolve('File saved successfully');
                }
            });
        });
    })
}

const fileTypeFromMagicNumber = (fileBuffer) => {
    const magicNumbers = {
        mp4: [0x66, 0x74, 0x79, 0x70], // MP4 (ISO Base Media File Format)
        jpg: [0xFF, 0xD8, 0xFF], // JPG/JPEG
        jpeg: [0xFF, 0xD8, 0xFF], // Same as JPG
        png: [0x89, 0x50, 0x4E, 0x47], // PNG
        pdf: [0x25, 0x50, 0x44, 0x46], // PDF
        docx: [0x50, 0x4B, 0x03, 0x04], // DOCX (ZIP-based format)
        xlsx: [0x50, 0x4B, 0x03, 0x04], // XLSX (ZIP-based format)
        txt: [0xEF, 0xBB, 0xBF], // TXT (with BOM for UTF-8, may also lack BOM)
        csv: [0xEF, 0xBB, 0xBF], // CSV (same as TXT if UTF-8 BOM is present)
        gif: [0x47, 0x49, 0x46, 0x38], // GIF
        pptx: [0x50, 0x4B, 0x03, 0x04], // PPTX (ZIP-based format)
        zip: [0x50, 0x4B, 0x03, 0x04], // ZIP
        rar: [0x52, 0x61, 0x72, 0x21], // RAR
    };
    
    for (const [type, signature] of Object.entries(magicNumbers)) {
        // Check if the file's bytes start with the signature
        if (signature.every((byte, index) => fileBuffer[index] === byte)) {
            return type;
        }
    }

    return "other"; // Return 'unknown' if no match is found
};


async function fileErrorHandlingMiddleware(err, req, res, next){
    if(err instanceof FileTypeMismatchError || err instanceof FileSizeExceedError){
        res.json({error : err.message})
    }else{
        next(err)
    }
}

module.exports = {saveBase64File, extractFileMIME, getBase64FileSize, readFileAsync, saveFileAsync, fileTypeFromMagicNumber, saveBase64FileAdvanced, FileTypeMismatchError, FileSizeExceedError, fileErrorHandlingMiddleware}