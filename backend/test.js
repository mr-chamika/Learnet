// const http = require("http")
const {express, Router} = require("./express")
const eobj = new express()

// const server = http.createServer(function (req, res){
//     res.write("Hello world !");
//     res.end();
//     // console.log(req.headers);
//     console.log(req.method)
// })

eobj.use(express.staticServe("./public"))

// const server = http.createServer((req, res) => express(req, res))
eobj.get("/route/:username/:id", function(req, res){
    res.write("route 0<br>")
    res.write(req.params.username + " " + req.params.id)
    res.end()
})

async function timeout(ms){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log("timout")
            resolve()
        }, ms)
    })
}

eobj.get("/route/:username", async function(req, res){
    // throw Error("test error")
    await timeout(5000)
    res.write("route 1")
    res.write(req.params.username)
    // for(let i = 0; i < 10000000000; i++){
    //     ;
    // }
    res.end()
})

eobj.get("/route", function(req, res){
    res.write("route 2")
    res.end()
})

// const server = http.createServer(eobj.app());

// server.listen(8080, "localhost", 10000, () => {
//     console.log("listing to port : 8080")
// })

eobj.use(async function(req, res, next){
    console.log("First middleware is running...")
    // await timeout(5000)
    return await next()
})

eobj.use(async function(req, res, next){
    console.log("Second middleware is running...")
    // await timeout(5000)
    return await next()
})

eobj.use(async (req, res, next)=>{
    console.log("Third middleware is running...")
    // await timeout(5000)
    return await next()
})

eobj.use(async (err, req, res, next) => {
    console.log("Error handling middleware is running...")
    res.write("<br>Error...")
    await timeout(5000)
})


const r = new Router()
r.get("/routenew", function(req, res){
    res.write("route new")
    res.end()
})
r.get("/routenew2", function(req, res){
    res.write("route new2")
    res.end()
})
r.use(function (req, res, next){
    res.write("nested middleware")
    // throw Error("Test error")
})
r.use(function (err, req, res, next){
    next(err)
})
eobj.use("/nested", r)

eobj.get("/test/*", (req, res) => {
    console.log("* check")
    res.write("* test check")
    res.end()
})

eobj.listen(8080, "localhost", 10000, () => {
    console.log("listing to port : 8080")
})
    