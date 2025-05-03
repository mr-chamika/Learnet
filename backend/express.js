const http = require("http")
const fs = require("fs")
const path = require("path");
// const mime = require('mime'); // For MIME type detection

// const stack = [
//     function (req, res){res.write("Hello world1")},
//     function (req, res){res.write("Hello world1")}
// ]

// const express = function (req, res){
//     for(item of stack){
//         item(req, res)
//     }
//     res.end()
// }

class Error {
    constructor(errorType, description) {
        this.errorType = errorType;
        this.description = description
    }

    Invalid = { x: "y" }
}

class Success {
    constructor(type, description) {
        this.type = type
        this.description = description
    }
}

class RouterSuccess extends Success {
    constructor() {
        super("Router", "Path match fond in the nested router")
    }
}

class RouteMatchingInfo {
    constructor(i, j, isRouteMatch) {
        this.i = i;
        this.j = j
        this.isRouteMatch = isRouteMatch
    }
}

class RouteMatcher {
    constructor(req, method, route, routeMatchingInfo = null) {

        this.req = req
        this.method = method
        this.route = route

        const lengthOfURL = this.req.url.length
        const lengthOfRoute = this.route.length
        this.lengthOfURL = lengthOfURL
        this.lengthOfRoute = lengthOfRoute

        this.routeMatchingInfo = routeMatchingInfo
        // console.log(" ", this.method, " ", this.route)
        // if(this.route.trim() == ""){
        //     this.route = "/"
        // }


        // "lsjdf".endsWith("f")
        // console.log("url : " ,req.url.endsWith("/"))
    }

    isRouteMatch() {
        // console.log("isSimpleMatch : ", this.isSimpleMatch())
        // console.log("parseURLPathParams : ", this.parseURLPathParams())
        console.log("isRouteMatch : ", this.method, " ", this.route)
        let routeMatchingInfo = null
        if (
            this.#isMethodMatch() &&
            (
                this.#isRouteExactMatch() ||
                (routeMatchingInfo = this.#parseURLPathParams()).isRouteMatch
            )
        ) {
            // return true
            if (routeMatchingInfo) {
                console.log("info : ", routeMatchingInfo)
                console.log("info2 : sub url : ", this.req.url.slice(routeMatchingInfo.i))
                return routeMatchingInfo
            } else {
                return new RouteMatchingInfo(this.lengthOfURL, this.lengthOfRoute, true)
            }
        } else {
            // return false
            if (routeMatchingInfo) {
                console.log("info : ", routeMatchingInfo)
                console.log("info2 : sub url : ", this.req.url.slice(routeMatchingInfo.i))
                return routeMatchingInfo
            } else {
                return new RouteMatchingInfo(0, 0, false)
            }
        }
    }

    #isMethodMatch() {
        // console.log(" ", this.method, " ", this.route)
        console.log("matching the methods : ", this.req.method, "  ", this.method)
        if (this.req.method == this.method || this.method == "NESTED_ROUTE") {
            return true
        } else {
            return false
        }
    }

    #isRouteExactMatch() {
        // console.log(" ", this.method, " ", this.route)
        console.log("check to find if exact match : ", this.req.url, "  ", this.route)
        console.log("sub url : ", this.req.url.slice(this.routeMatchingInfo ? this.routeMatchingInfo.i : 0))
        if (
            this.req.url.slice(this.routeMatchingInfo ? this.routeMatchingInfo.i : 0)
            == this.route
        ) {
            return true
        } else {
            return false
        }
    }

    // /route/:username/:id
    // /route/gm/123
    // /route/:username
    // /route/gm
    // /route/
    #parseURLPathParams() {
        // console.log(" ", this.method, " ", this.route)
        // i - current index of the this.req.url
        // j - current index of the this.route
        console.log("parsing path parameters")
        const lengthOfURL = this.req.url.length
        const lengthOfRoute = this.route.length
        // let i = 0, j = 0
        let i = this.routeMatchingInfo ? this.routeMatchingInfo.i : 0, j = 0
        while (i < lengthOfURL && j < lengthOfRoute) {
            // console.log(this.req.url.charAt(i), "  ", this.route.charAt(j))
            // console.log(i)\
            if (this.route.charAt(j) === "*") return new RouteMatchingInfo(i, j, true) // to allow paths like "route/*"
            if (this.req.url.charAt(i) === this.route.charAt(j) &&
                this.req.url.charAt(i) === "/") {
                // console.log(this.req.url.charAt(i), " ", this.route.charAt(j))
                i++
                j++
                if (this.route.charAt(j) === "*") return new RouteMatchingInfo(i, j, true) // to allow paths like "route/*"

                if (this.route.charAt(j) === ":") {
                    // console.log(" ", " ", this.route.charAt(j))
                    j++
                    let value = ""
                    while (this.req.url.charAt(i) != "/" && i < lengthOfURL) {
                        // console.log(" ", " ", this.route.charAt(i))
                        value += this.req.url.charAt(i)
                        i++
                    }
                    let key = ""
                    while (this.route.charAt(j) != "/" && j < lengthOfRoute) {
                        // console.log(" ", " ", this.route.charAt(j))
                        key += this.route.charAt(j)
                        j++
                    }

                    // adding parameter to the req.params object
                    this.req.params[key] = value
                } else {
                    while (true) {
                        // console.log(this.req.url.charAt(i), " ", this.route.charAt(j))
                        if (this.req.url.charAt(i) != this.route.charAt(j)) {
                            // return false
                            return new RouteMatchingInfo(i, j, false)
                        }
                        else if (this.req.url.charAt(i) == "/") {
                            break
                        }
                        else if (this.route.length - 1 <= j && this.method == "NESTED_ROUTE") {
                            // for nested route matching
                            // return true
                            return new RouteMatchingInfo(i + 1, j, true)
                        }
                        i++
                        j++
                    }
                }
            }
        }
        // if(i == lengthOfURL && j == lengthOfRoute) return true
        if (i == lengthOfURL && j == lengthOfRoute) return new RouteMatchingInfo(i, j, true)
        // else return false
        else return new RouteMatchingInfo(0, 0, false)
    }
}

class RouteDetails {
    constructor(route, method, routeHandler) {
        this.route = route
        this.method = method
        this.routeHandler = routeHandler
    }
}

class Router {
    constructor() {
        // method 1
        // this.stack = []

        // method 2
        // this.stackOfRoutes = []
        // this.stackOfRouteDetails = []

        // method 3
        // this.stackOfMethods = []
        // this.stackOfRotutes = []
        // this.stackOfReqHandlers = []

        // method 4
        // this.stackOfRouteDetails = []
        // this.stackOfRouteHandlers = []

        // method 5
        this.stackOfRouteDetails = []
        this.stackOfMiddleware = []
        this.stackOfErrorHandlingMiddleware = []
    }

    // isRouteMatch(req, route){
    //     if(route == req.url){
    //         return true
    //     }
    //     return false
    // }

    /*
    * Add a get route to the Router and specify a handler function
    * to handl the reqest and form the response
    * @param {function (req, res)} routeHandler
    */
    methodCommon(route, method, routeHandler) {
        if (routeHandler.length != 2) {
            // throw new Error("Invalid function argument", "")
            throw Error.Invalid;
        } else {
            // method 1
            // this.stack.push([route, routeHandler])


            // method 3
            // this.stackOfRoutes.push(route)
            // this.stackOfMethods.push(method)
            // this.stackOfReqHandlers.push(routeHandler)

            // method 5
            this.stackOfRouteDetails.push(new RouteDetails(route, method, routeHandler))
        }
    }

    get(route, routeHandler) {
        this.methodCommon(route, "GET", routeHandler)
    }

    post(route, routeHandler) {
        this.methodCommon(route, "POST", routeHandler)

    }
    patch(route, routeHandler) {
        this.methodCommon(route, "PATCH", routeHandler)

    }
    delete(route, routeHandler) {
        this.methodCommon(route, "DELETE", routeHandler)
    }

    reqPreprocess(req) {
        req.params = {}
    }

    async run(req, res, routeMatchingInfo = null) {

        let index = 0
        let errIndex = 0

        const next = async () => {
            if (index < this.stackOfMiddleware.length) {
                // console.log("_________________ mid _____________________")
                // console.log(this.stackOfMiddleware[index] instanceof Router)
                const middleware = this.stackOfMiddleware[index]
                if (middleware instanceof RouteDetails) {
                    // console.log("_____________________ router _____________________")
                    // console.log(middleware)
                    // console.log("router")
                    const routeMatcher = new RouteMatcher(req, middleware.method, middleware.route, routeMatchingInfo)
                    // console.log("matcher : ", routeMatcher.isRouteMatch())
                    let routeMatchingInfoUpdated = null
                    if ((routeMatchingInfoUpdated = routeMatcher.isRouteMatch()).isRouteMatch) {
                        if (await this.stackOfMiddleware[index++].routeHandler.run(req, res, routeMatchingInfoUpdated)) { console.log("found a match in middleware"); return true }
                        index++
                        return await next()
                    } else {
                        // console.log("next middleware")
                        index++
                        return await next()
                    }
                } else {
                    return await this.stackOfMiddleware[index++](req, res, next)
                }
            }
        }

        const nextError = async (err) => {
            if (errIndex < this.stackOfErrorHandlingMiddleware.length) {
                await this.stackOfErrorHandlingMiddleware[errIndex++](err, req, res, nextError)
            } else {
                if (err) return err
            }
        }

        // console.log("Running the router...")
        try {
            if (req.params === undefined) {
                this.reqPreprocess(req)
            }

            if (await next()) {
                // console.log("found a match")
                return true
            }
            // console.log("middlewares are done")
            for (let routeDetails of this.stackOfRouteDetails) {

                // console.log("route matching...")
                const routeMatcher = new RouteMatcher(req, routeDetails.method, routeDetails.route, routeMatchingInfo)
                if (routeMatcher.isRouteMatch().isRouteMatch) {
                    // console.log("matching route found...")
                    // console.log("waiting...")
                    await routeDetails.routeHandler(req, res)
                    // console.log("done waiting")
                    // break
                    return true
                }
            }

            // res.write("end")
            // res.end()
        } catch (err) {
            console.log(err)
            const error = await nextError(err) // if the error handling middlewares cannot resolve the error it is returned by the nextError() function
            if (error) { console.log("passing error up"); throw error } // Throw that erro to be resolved by other error handing middlewares up in the router hierarcy
            // res.write("end")
            // res.end()
            return true
        }
    }


    // posible arguments
    // use(middleware)
    // use("path", router)
    use(arg1, arg2 = null) {
        if (arg2) {
            if (typeof (arg1) == "string" && arg2 instanceof Router) {
                this.stackOfMiddleware.push(new RouteDetails(arg1, "NESTED_ROUTE", arg2))
            } else {
                throw Error.Invalid
            }
        } else {
            if (arg1.length == 3) {
                this.stackOfMiddleware.push(arg1)
            } else if (arg1.length == 4) {
                this.stackOfErrorHandlingMiddleware.push(arg1)
            } else {
                throw Error.Invalid
            }
        }
    }
}

// let x = new Route();
// x.get()

class express extends Router {
    constructor() {
        super()
        // this.stackOfMiddleware = []
        // this.stackOfErrorHandlingMiddleware = []

        this.server = http.createServer();
        this.server.on("request", this.appNew())
    }

    listen(port, hostname, backlog, callback) {
        this.get("*", (req, res) => {
            res.writeHead(404)
            res.write("Not found")
            // res.end()
        })
        return this.server.listen(port, hostname, backlog, callback)
    }

    reqPreprocess(req) {
        // console.log("req.url : ", req.url)
        // removing the trailing slash in the url if exist
        // if(req.url.endsWith("/")){
        //     req.url = req.url.substr(0, req.url.length - 1)
        // }
        // console.log("req.url : ", req.url)
        req.params = {}
    }

    app() {
        async function hndl(req, res) {
            let index = 0
            let errIndex = 0

            const next = async () => {
                if (index < this.stackOfMiddleware.length) {
                    // console.log(this.stackOfMiddleware[index] instanceof Router)
                    if (this.stackOfMiddleware[index] instanceof Router) {
                        // console.log("__________________________________________")
                        if (await this.stackOfMiddleware[index++].run(req, res)) { console.log("found a match in middleware"); return true }
                    } else {
                        return await this.stackOfMiddleware[index++](req, res, next)
                    }
                }
            }

            const nextError = async (err) => {
                if (errIndex < this.stackOfErrorHandlingMiddleware.length) {
                    await this.stackOfErrorHandlingMiddleware[errIndex++](err, req, res, nextError)
                }
            }

            try {
                if (await next()) { console.log("found a match"); res.end(); return true }

                console.log("\n\n")
                this.reqPreprocess(req)
                // res.write("Hello world !");
                // res.end();
                for (let routeDetails of this.stackOfRouteDetails) {
                    // if(this.isRouteMatch(req, middleware[0])){
                    //     middleware[1](req, res)
                    // }

                    // console.log(routeDetails)

                    // console.log("route matching...")
                    const routeMatcher = new RouteMatcher(req, routeDetails.method, routeDetails.route)
                    if (routeMatcher.isRouteMatch()) {
                        // console.log("jdsfl")
                        await routeDetails.routeHandler(req, res)
                        // if(routeDetails.routeHandler.length == 2){
                        //     console.log("lenght is 2 : ", true)
                        // }else{
                        //     console.log("length is 2 : ", false)
                        // }
                        // console.log("jdsfl2")
                        break
                    }
                }

                // const x = []
                // x.push(100, 200)
                // x.push(300, 400)

                // const y = []
                // y.push(500, 600)
                // y.push(700, 800)
                // for(let i of x ){
                //     console.log(i)
                // }

                // console.log(x.concat(y))
                res.write("end")
                res.end()
            } catch (err) {
                console.log(err)
                await nextError(err)
                res.write("end")
                res.end()
            }
        }

        return hndl.bind(this)
    }

    async run(req, res) {

        // res.json = function (JSObject){
        res.json = function (data) {
            // console.log("json stringify ________________ ", this)
            // this.write(JSON.stringify(JSObject))
            this.setHeader('Content-Type', 'application/json'); // Set the JSON content type
            this.end(JSON.stringify(data)); // Send the JSON response
            return this; // Enable method chaining if needed
        }

        res.sendToClient // some aggregated method for res.writeHead, res.write, res.end,...

        res.sendStatus = function (statusCode) {
            this.statusCode = statusCode;
            this.statusMessage = http.STATUS_CODES[statusCode] || 'Unknown Status';
            this.setHeader('Content-Type', 'text/plain');
            this.end(res.statusMessage);
        }

        res.status = function (code) {
            this.statusCode = code; // Set the HTTP status code
            return this; // Enable method chaining
        };

        const originalEnd = res.end; // Store the original `end` method
        res.end = function (data, encoding, callback) {
            if (data) {
                this.write(data); // Write the data if provided
            }
            originalEnd.call(this, null, encoding, callback); // Call the original `end` method
            return this; // Enable method chaining if needed
        };

        res.sendFile = function(filePath, type = "") {
            const mimeTypes = {
                'html': 'text/html',
                'css': 'text/css',
                'js': 'application/javascript',
                'json': 'application/json',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'pdf': 'application/pdf',
                'txt': 'text/plain',
                'zip': 'application/zip',
                'mp4': 'video/mp4',
                'mp3': 'audio/mp3',
                'wav': 'audio/wav'
              };
            const absolutePath = path.resolve(filePath);
            console.log("abs path: ", absolutePath)
        
            // Check if the file exists
            fs.stat(absolutePath, (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        // File not found
                        this.statusCode = 404;
                        console.log('File not found')
                        this.end('File not found');
                    } else {
                        // Other errors
                        this.statusCode = 500;
                        console.log('Internal Server Error')
                        this.end('Internal Server Error');
                    }
                    return;
                }
        
                // Check if it's a file
                if (!stats.isFile()) {
                    this.statusCode = 403;
                    console.log('Forbidden')
                    this.end('Forbidden');
                    return;
                }
        
                // Determine the MIME type
                // const mimeType = mime.getType(absolutePath);
                // TODO : create a function to determine the mime type of a file without loading the entire file
                const mimeType = "image/png"
                this.setHeader('Content-Type', mimeType);
        
                // Set caching headers
                this.setHeader('Last-Modified', stats.mtime.toUTCString());
                this.setHeader('Cache-Control', 'public, max-age=3600');
        
                // Handle conditional GET (If-Modified-Since)
                const ifModifiedSince = this.getHeader('if-modified-since');
                if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
                    this.statusCode = 304;
                    this.end();
                    return;
                }

                // Supoort for range requests
                const fileSize = stats.size;
                const range = req.headers.range;

                if (range) {
                    console.log("range request : ", range)
                    const parts = range.replace(/bytes=/, '').split('-');
                    const start = parseInt(parts[0], 10);
                    // const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                    // const chunkSize = end - start + 1;
                    // const end = parts[1] ? parseInt(parts[1], 10) : start + 1024 * 128;
                    const chunkSize = 1024 * 1024 // chunk size should be conrolled by the backend
                    // frontend should only specify the starting position
                    let end = start + chunkSize
                    if(end > fileSize - 1){
                        end = fileSize - 1
                    }

                    res.writeHead(206, {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunkSize,
                        'Content-Type': 'video/mp4',
                    });

                    // if(res.compressionStream){
                    //     fs.createReadStream(filePath, { start, end }).pipe(res.compressionStream).pipe(res);
                    // }else{
                        fs.createReadStream(filePath, { start, end }).pipe(res);
                    // }
                } else {
                    console.log("Not a range request")
                    res.writeHead(200, {
                        'Content-Length': fileSize,
                        'Content-Type': mimeTypes[type] ? mimeTypes[type] : 'video/mp4',
                    });

                    // if(res.compressionStream){
                    //     fs.createReadStream(filePath).pipe(res.compressionStream).pipe(res);
                    // }else{
                        fs.createReadStream(filePath).pipe(res);
                    // }
                }
        
                // Stream the file
                // const fileStream = fs.createReadStream(absolutePath);
                // fileStream.on('error', (streamErr) => {
                //     this.statusCode = 500;
                //     this.end('Internal Server Error');
                // });
        
                // this.statusCode = 200;
                // fileStream.pipe(this);
            });
        }

        console.log("________________________NEW REQUEST_____________________________")
        console.log("request info : \n\tmethod:", req.method, "\n\tpath: ", req.url)
        await super.run(req, res)
        // res.write("end")
        try {
            // res.end()
        } catch (err) {
            console.log("Cannot write headers after they are sent to the client")
        }
        console.log("_____________________________________________________")
    }

    appNew() {
        return this.run.bind(this)
    }

    // function middleware(req, res, next) or
    // function middleware(err, req, res, next)
    // use(middleware){
    //     console.log(typeof(middleware), "  ", middleware instanceof Router)
    //     console.log(middleware.length)
    //     if(middleware.length == 3 || middleware instanceof Router){
    //         this.stackOfMiddleware.push(middleware)
    //     }else if(middleware.length == 4){
    //         this.stackOfErrorHandlingMiddleware.push(middleware)
    //     }else{
    //         throw Error.Invalid
    //     }
    // }

    static staticServe(staticPath) {
        if (!fs.existsSync(staticPath)) throw Error.Invalid
        const dirs = fs.readdirSync(staticPath, { encoding: "utf-8", withFileTypes: true, recursive: true })
        // console.log(dirs)
        return async function (req, res, next) {
            if (!req.url.slice(0, staticPath.length).includes(staticPath)) return await next()

            for (let dir of dirs) {
                if (dir.isDirectory()) {
                    // console.log("static serve : dir check")
                    // console.log("." + req.url, "    ", dir.parentPath)
                    if ("." + req.url == dir.parentPath) {
                        // console.log("file path : ", path.join(dir.parentPath, "index.html"))
                        fs.readFile(path.join(dir.parentPath, "/index.html"), { encoding: "utf-8" },
                            (err, file) => {
                                if (err) {
                                    res.writeHead(500)
                                    // res.end()
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'text/html' })
                                    res.write(file)
                                }
                            }
                        )
                        return true
                    }
                } else {
                    // console.log("static serve : file check")
                    // console.log("uuuuuuuuuuuurl : ", path.join(req.url).slice(1))
                    // console.log("dirrrrrrrrrrrr : ", path.join("./", dir.parentPath, dir.name))
                    const filePath = path.join(dir.parentPath, dir.name);
                    if (path.join(req.url).slice(1) == filePath) {
                        // console.log("file path : ", path.join(dir.parentPath, dir.name))
                        // fs.readFile(path.join(dir.parentPath, dir.name), { encoding: "utf-8" },
                        //     (err, file) => {
                        //         if (err) {
                        //             res.writeHead(500)
                        //             // res.end()
                        //         } else {
                        //             const fileType = dir.name.split(".")[-1]
                        //             switch (fileType) {
                        //                 case "html": case "css": case "javascript":
                        //                     res.writeHead(200, { 'Content-Type': `text/${fileType}` })
                        //                     break
                        //                 default:
                        //                     res.writeHead(200, { 'Content-Type': 'text/plain' })

                        //             }
                        //             res.write(file)
                        //         }
                        //     }
                        // )
                        fs.access(filePath, fs.constants.F_OK, (err) => {
                            if (err) {
                                res.status(404).json({ message: "File not found" });
                                return;
                            }
                        
                            const readStream = fs.createReadStream(filePath);
                            
                            readStream.on("error", (error) => {
                                console.error("Stream error:", error);
                                res.status(500).json({ message: "Error streaming the file" });
                            });
                        
                            readStream.pipe(res);
                        })
                        return true
                    }
                }

            }
            return await next()
            // fs.readFile(path, {encoding : "utf-8"} , (err, data) => {
            //     throw err
            // })
        }
    }

    static parseJsonBody() {
        return async function (req, res, next) {
            // console.log("parsing json")
            // console.log("content-type : ", req.headers["content-type"])
            // console.log("content-type 2 : ", req.headers)
            if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
                console.log("parsing body")
                // try {
                let body = '';

                // Collect the data chunks from the request
                for await (const chunk of req) {
                    body += chunk.toString(); // Convert buffer to string
                }

                // If body exists, try to parse it as JSON
                if (body) {
                    // console.log("body : ", body)
                    req.body = JSON.parse(body); // Attach parsed JSON to req.body
                }

                return await next(); // Pass control to the next middleware
                // } catch (error) {
                //     // Handle errors like invalid JSON
                //     res.writeHead(400, { 'content-type': 'application/json' });
                //     res.end(JSON.stringify({ message: 'Invalid JSON', error: error.message }));
                // }
            };

            return await next();
        }
    }

    static parseMultipartFormData(){

        async function readRequestBody(req){
            return new Promise((resolve, reject) => {
                
                const boundary = req.headers['content-type'].split('boundary=')[1]; // Get boundary from the content-type header
                // In the fronend, no need to specify the content-type automatically with the boundary
                // If we try to set it manually, we have to explicitly set the boundary which can be extracted from the form data object
                // console.log("boundary : ", boundary)
                const chunks = [];
            
                req.on('data', chunk => {
                    // console.log("chunks : ", chunk)
                    chunks.push(chunk);
                });

                
                req.on('end', async () => {
                    // console.log("chunks : ", chunks)
                    const buffer = Buffer.concat(chunks);
                    // console.log("file size : ", buffer.length)
                    // console.log("buffer : ", buffer)
                    // ASCII Encoding: Represents characters from the ASCII character set
                    //  (values 0–127). This means it can only represent printable characters
                    //  and some control characters. When you try to encode non-ASCII byte values
                    //  (like byte values greater than 127), it may not correctly convert the data
                    // , resulting in data loss or corruption.
                    const body = buffer.toString("binary"); // so use binary to work with data in text format while preserving binary data

                    // console.log("body : ", body)
                    const parts = body.split(`--${boundary}`).filter(part => part !== '' && part !== '--'); // Split parts by boundary
            
                    const files = {}
                    const formData = {};
                    // console.log("parts : ", parts)
            
                    // console.log("parts: ", parts)
                    parts.forEach(part => {
                        if(part === "--\r\n"){
                            return
                        }
                        // console.log(part)
                        // Extract content-disposition and the actual data
                        const contentDispositionMatch = part.match(/Content-Disposition: form-data; name="(.+?)"(?:; filename="(.+?)")?\r\n/);
                        // console.log("cdm : ", contentDispositionMatch)
                        const contentDisposition = contentDispositionMatch && contentDispositionMatch[1];
                        const fileName = contentDispositionMatch && contentDispositionMatch[2];
                        let content
                        let contentType
                        if(fileName){ // if the part is a file
                            const contentTypeMatch = part.match(/content-type:\s*([^\s]+)/i);
                            contentType = contentTypeMatch ? contentTypeMatch[1] : null;
                            // console.log("content type : ", contentType)
                            // content = part.split('\r\n\r\n')[1];  // Extract the content
                            const contentStartIndex = part.indexOf('\r\n\r\n') + 4; // The index where the content starts
                            content = part.slice(contentStartIndex); // Content is everything after the headers
                        }else{
                            content = part.split('\r\n\r\n')[1].split('\r\n')[0].trim();  // Extract the content
                        }

                        // console.log(`part : '${part.slice(part.length - 1000, part.length)}'`)
                        // console.log("part: ", contentDisposition, fileName, content)
            
                        // console.log("field name : ", fileName)
                        if (fileName) {
                            // For file data
                            console.log("========== contentDisposition : ", contentDisposition)
                            const fileBuffer = Buffer.from(content, 'binary');
                            // console.log("buffer to str : ", fileBuffer)
                            if(files[contentDisposition]){ // if there are multiple files with the same contentDisposition create an array of those files
                                if(files[contentDisposition] instanceof Array){
                                    files[contentDisposition] = [
                                        ...files[contentDisposition],
                                        {
                                            filename: fileName,
                                            data: fileBuffer,
                                            mimetype: contentType,
                                            size: fileBuffer.length
                                        }
                                    ]
                                    console.log("array ggggggggggggg : ", files[contentDisposition])
                                }else{
                                    files[contentDisposition] = [
                                        files[contentDisposition],
                                        {
                                            filename: fileName,
                                            data: fileBuffer,
                                            mimetype: contentType,
                                            size: fileBuffer.length
                                        }
                                    ]
                                }

                            }else{
                                files[contentDisposition] = {
                                    filename: fileName,
                                    data: fileBuffer,
                                    mimetype: contentType,
                                    size: fileBuffer.length
                                };
                            }
                        } else {
                            // For form fields (non-file data)
                            formData[contentDisposition] = content;
                        }
                    });
            
                    // callback(formData);
                    // console.log("formData : ", formData)
                    
                    resolve({formData, files})
                });
        
                req.on('error', (err) => {
                    reject(err);
                });
            });
        };

        return async function(req, res, next){
            if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
                // console.log("req headers contype: ", req.headers['content-type'])
                const {formData, files} = await readRequestBody(req)
                // console.log('form data : ', formData, files)
                req.body = {...req.body,...formData}
                req.files = files
            }
            return await next()
        }
    };
}


function customCors(allowedOrigins) {
    return async function (req, res, next) {
        // console.log("custom cors")
        const origin = req.headers.origin;

        // Check if the request origin is allowed
        if (allowedOrigins.includes(origin)) {
            // Set the Access-Control-Allow-Origin header to the request origin
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        // Always set these headers for OPTIONS requests
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, range');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length');

        // Handle preflight (OPTIONS) request
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200); // Respond with status 200 for OPTIONS requests
        }

        return await next(); // Move to the next middleware
    };
};




module.exports = { express, Router, customCors }

// middleware functions formats
// function errorHandler(err, req, res, next){
//     ;
// }

// function middleware(req, res, next){
//     ;
// }

// function routeHandlers(req, res){
//     ;
// }