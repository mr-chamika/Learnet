const mongoose = require("mongoose")
// const cors = require("cors")
const { express, Router, customCors } = require("./express")
const app = new express()
const userRouter = require("./routes/UserRouter")
// const authenticatedUserRouter = require("./routes/AuthenticatedUserRouter.js")
const UserAuthenticationMiddleware = require("./middlewares/UserAuthenticationMiddleware")
const directoryRouter = require("./routes/DirectoryRouter")
const fileRouter = require("./routes/FileRouter")
const chatimageRouter = require("./routes/ChatImageRouter.js")
const noteRouter = require("./routes/NoteRouter")
const videoRouter = require("./routes/VideoRouter")
const linkRouter = require("./routes/LinkRouter")
const { errorLoggingMiddleware } = require("./middlewares/errorLoggingMiddleware")
const { mongooseValidationEHM } = require("./middlewares/mongooseValidationEHM")
const ModeratorAuthenticationMiddleware = require("./middlewares/ModeratorAuthenticationMiddleware")
const AdminAuthenticationMiddleware = require("./middlewares/AdminAuthenticationMiddleware")
const { fileErrorHandlingMiddleware } = require("./utils/FileUtil")
const eventRouter = require("./routes/EventRouter")
const taskRouter = require("./routes/TaskRouter")
const blogRouter = require("./routes/blogRouter")
const friendsRouter = require("./routes/FriendsRouter")
const feedRouter = require("./routes/FeedRouter")
const paymentRouter = require("./routes/PaymentRouter.js")
require("dotenv").config()

const postRouter = require('./routes/PostRouter.js');
const answerRouter = require('./routes/AnswerRouter.js');
const commentRouter = require('./routes/CommentRouter.js')
const tagRouter = require("./routes/TagRouter.js")
const reportRouter = require("./routes/ReportRouter.js")
const contentRouter = require("./routes/ContentRouter.js")
const domainRouter = require("./routes/DomainRouter.js")
const compressionMiddleware = require("./middlewares/compressionMiddleware.js")
// app.use(express.staticServe("./public"))
// app.use(cors())
app.use(customCors(["http://localhost:3001", "http://localhost:3003"]))
app.use(compressionMiddleware)
app.use(express.parseMultipartFormData())
app.use(express.parseJsonBody())
// app.use(customCors(["http://localhost:3001"]))
// app.use(async (req, res, next)=>{
//     console.log("_______body: ", req.body)
//     return await next()
// })

// app.use(async (req, res, next)=>{
//     // for(let i = 0; i < 10000000000; i++);
//     console.log("1 : ", req.body)
//     // res.write("Hello ")
//     return await next()
// })

// app.use(async (req, res, next)=>{
//     console.log("2 : ", req.body)
//     // res.write("world!")
//     return await next()
// })

// const router = new Router()

// router.post("/login", (req, res)=>{
//     console.log("3 : ", req.body)
//     // res.write(" login...2")
// })

// app.use("/user", router)
// app.get("/gg", (req,res)=>{
//     console.log("gggggggggggggggg _______________________ ")
//     res.json({name : "gm"})
//     // res.end()
// })
app.use("/user", userRouter)
app.use("/tag", tagRouter)
app.use("/report", reportRouter)
app.use(UserAuthenticationMiddleware)
app.use("/content", contentRouter)
// app.use(express.staticServe("./uploads")) // works
app.use("/feed", feedRouter)
app.use("/friends", friendsRouter)
app.use("/blog", blogRouter)

// app.use("/event", eventRouter)
// app.use("/schedule", scheduleRouter)
app.use("/event", eventRouter)
app.use("/task", taskRouter)
app.use("/post", postRouter)//Done
app.use("/answer", answerRouter)//Done
app.use("/comment", commentRouter)//Done
app.use("/dir", directoryRouter)
app.use("/file", fileRouter)
app.use("/chatimage", chatimageRouter)
app.use("/note", noteRouter)
app.use("/video", videoRouter)
app.use("/link", linkRouter)
app.use("/payment", paymentRouter)
app.use("/domain", domainRouter)

app.use(ModeratorAuthenticationMiddleware)
// moderator routes here
app.use(AdminAuthenticationMiddleware)
// admin routes here

app.use(fileErrorHandlingMiddleware)
app.use(mongooseValidationEHM)
app.use(errorLoggingMiddleware)
// app.listen(8080, "localhost", 10000, () => {
//     console.log("listing to port : 8080")
// })

//app.get('http://localhost:8080/', (req, res) => { res.send('hello world') });

mongoose.connect(process.env.MONGO_DB_URI, { dbName: "Learnet" })
    .then(v => {
        console.log("Connected to MongoDB successuflly")
        app.listen(8080, "localhost", 10000, () => {
            console.log(`Listening on port 8080`)
        })
    }).catch(err => {
        console.log("Error : ", err)
    })