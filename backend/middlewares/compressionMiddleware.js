const zlib = require("zlib");

const brotliOptions = {
    params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 5,  // Compression level (1-11) | Default: 11 (slow)
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT, // Optimized for text-based data
        [zlib.constants.BROTLI_PARAM_LGWIN]: 22, // Window size (higher = better compression, more memory)
    },
};

const gzipOptions = {
    level: zlib.constants.Z_BEST_SPEED, // Compression level (Z_BEST_SPEED = fast, Z_BEST_COMPRESSION = max)
    memLevel: 9, // Higher memory usage for better compression
    strategy: zlib.constants.Z_DEFAULT_STRATEGY, // Balanced compression
};

const deflateOptions = {
    level: zlib.constants.Z_BEST_SPEED, // Fast compression
    memLevel: 9, // More memory for better compression efficiency
    strategy: zlib.constants.Z_DEFAULT_STRATEGY, // Balanced compression
};

const compressionMiddleware = (req, res, next) => {
    const acceptEncoding = req.headers["accept-encoding"] || "";

    // Store the original `res.write` and `res.end` methods
    const rawWrite = res.write;
    const rawEnd = res.end;

    // Initialize compression stream based on the client's accepted encoding
    let compressionStream;
    if (acceptEncoding.includes("br")) {
        res.setHeader("Content-Encoding", "br");
        compressionStream = zlib.createBrotliCompress(brotliOptions);
    } else if (acceptEncoding.includes("gzip")) {
        res.setHeader("Content-Encoding", "gzip");
        compressionStream = zlib.createGzip(gzipOptions);
    } else if (acceptEncoding.includes("deflate")) {
        res.setHeader("Content-Encoding", "deflate");
        compressionStream = zlib.createDeflate(deflateOptions);
    }

    // If no supported encoding, proceed without compression
    if (!compressionStream) {
        return next();
    }

    // Modify `res.write` and `res.end` to handle compression
    res.write = (chunk) => {
        compressionStream.write(chunk);
        // console.log("compressing : ", chunk.length)
    }
    res.end = (chunk) => {
        if (chunk) {
            compressionStream.write(chunk);
            // console.log("compressing : ", chunk.length)
        }
        compressionStream.end();
    };

    // res.json = function (data) {
    //     // Convert the data to a JSON string
    //     const jsonData = JSON.stringify(data);
        
    //     // Compress using Brotli
    //     zlib.brotliCompress(jsonData, (err, compressedData) => {
    //         if (err) {
    //             console.error('Brotli compression error:', err);
    //             this.writeHead(500, { 'Content-Type': 'application/json' });
    //             this.end(JSON.stringify({ error: 'Compression error' }));
    //             return;
    //         }
    
    //         // Set headers for compressed JSON
    //         this.setHeader('Content-Type', 'application/json');
    //         this.setHeader('Content-Encoding', 'br');
    //         this.setHeader('Transfer-Encoding', 'chunked')
    //         this.end(compressedData);
    //     });
    
    //     return this; // Enable method chaining if needed
    // };
    
    // res.json = function (data){
    //     this.setHeader('Content-Type', 'application/json');
    //     const jsonData = JSON.stringify(data)
    //     compressionStream.end(jsonData)
    // }

    // Pipe the compressed output to the original response
    compressionStream.on("data", (chunk) => {
        rawWrite.call(res, chunk)
        // console.log("writing chunk : ", chunk.length)
    });
    compressionStream.on("end", () => {
        rawEnd.call(res)
        // console.log("End of stream")
    });
    compressionStream.on("error", (err) => {
        // console.error("Compression Error:", err);
        res.end();
    });

    compressionStream.on("finish", () => {
        // console.log("Flushing compression stream...");
        res.end();
    });
    
    res.setHeader("Transfer-Encoding", "chunked");

    res.compressionStream = compressionStream
    // Call next to continue request handling
    next();
};

module.exports = compressionMiddleware;
