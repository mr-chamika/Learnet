const User = require("../models/UserModel")
const UserDirectory = require("../models/DirectoryModel")
// const Cart = require("../models/CartModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { transpoter, generateOTP, transporter } = require("../mailer/mailer")
const isUniversityEmail = require("../utils/isUniversityEmail")
const { saveFileAsync } = require("../utils/FileUtil")
const path = require("path")
const UserFriends = require("../models/UserFriendsModel")

const validDomains = ["ac.lk", "edu.au", "university.com", "gmail.com"]; // must be fetch from a database collection

async function getVideoTest(req, res) {
    console.log("params: ", req.params)
    console.log("============= VIDEO REQUEST===============")
    res.sendFile("./uploads/videos/avf.mp4")
}

async function getUserProfilePictureController(req, res) {
    const { userId } = req.body
    console.log("userId : ", userId)

    const user = await User.getUserById(userId)
    // res.json(user)
    if(user && user.profilePicturePath){
        res.sendFile(user.profilePicturePath)
    } else {
        res.sendStatus(404)
    }
}

async function getUserController(req, res) {
    const { userId, email } = req.body

    // TODO : limit the details what others could see on a user based on the user's privacy settings
    let user
    if (userId) {
        user = await User.getUserById(userId)
    } else if (email) {
        user = await User.getUser(email)
    }
    res.json(user)
}

async function getUserControllerc(req, res) {
    const { userId } = req.body

    // TODO : limit the details what others could see on a user based on the user's privacy settings

    if (userId) {

        const user = await User.getUserByIdc(userId)

        res.json({ user })
    }
}
async function getUsersController(req, res) {
    const { userIds } = req.body
    console.log("userIds : ", userIds)

    // TODO : limit the details what others could see on a user based on the user's privacy settings
    const users = await User.getUsersById(userIds)
    res.json(users)
}

async function usernameAvailabilityController(req, res) {
    const { username } = req.body
    const userAlreadyExist = await User.findOne({ username })
    if (userAlreadyExist) {
        res.json({ error: "Username is not available" })
    } else {
        res.json({ message: "Username is available" })
    }
}

async function loginController(req, res) {
    const email = req.body.email.trim()
    const password = req.body.password

    // check if the provided email is a university email
    // if(!isUniversityEmail(email, validDomains)){
    //     res.json({error: "The email provided is not identified as a university email"})
    //     return
    // }

    console.log("body : ", req.body)

    const user = await User.findOne({ email })
    console.log(user)

    if (user) {

        if (!user.emailVerified) {
            res.json({ error: "The email address associated with your account has not yet been verified. You will be unable to log in until it is verified." })
            return
        }

        if (user.isSuspended) {
            res.json({
                error: "Your account has been suspended",
                errorCode: 7
            })
            return
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (passwordsMatch) {
            const token = jwt.sign({ name: user.name, email: user.email, userId: user._id }, process.env.SECRETE_KEY, { expiresIn: "24h" })
            res.json({ name: user.name, email: user.email, token, userId: user._id })
        } else {
            res.json({
                error: "Wrong password",
                errorCode: 3
            })
        }

    } else {
        res.json({
            error: "An account with this email does not exist",
            errorCode: 2
        })
    }
}

const otpStore = {}
// const tempUsers = {}
async function signupController(req, res) {
    const name = req.body.name
    const username = req.body.username
    const bio = req.body.bio
    const password = req.body.password
    const phone = req.body.phone
    const email = req.body.email
    const university = req.body.university
    const uid = req.body.uid
    const uidImage = req.files["uid-image"]
    const profilePicture = req.files["profile-pic"]
    const correctDetails = req.body.correctDetails
    const concent = req.body.concent
    const tags = JSON.parse(req.body.tags)

    // console.log("data : ", req.body)
    // console.log("files : ", req.files["profile-pic"])

    try{
        if(!(name && username && bio && password && phone && email && university &&
            uid && uidImage && profilePicture
        )){
            res.json({error: "All the fields are required."})
            return
        }
        
        if(correctDetails?.trim() !== "true"){
            res.json({error: "You must confirm that all the details provided above are accurate."})
            return
        }
    
        if(concent?.trim() !== "true"){
            res.json({error: "You must agree to the terms and condition of the system to continue the signup process"})
            return
        }
    
        if(tags.length < 5){
            res.json({error: "You must select at least 5 tags"})
            return
        }
    
        // check if the provided email is a university email
        if(!isUniversityEmail(email, validDomains)){
            res.json({error: "The email provided is not identified as a university email"})
            return
        }
        
        const userAlreadyExist = await User.findOne({email})
        console.log(userAlreadyExist)
    
        if(userAlreadyExist){
            res.json({
                error: "An account with this email already exist",
                errorCode: 1
            })
        }else{
            
            const userAlreadyExist = await User.findOne({username})
            if(userAlreadyExist){
                res.json({
                    error: "An account with the provided username already exist",
                    errorCode: 1
                })
                return
            }
            
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
    
            console.log("hashed : ", hashedPassword)
    
            const profilePictureName = Date.now() + profilePicture.filename
            await saveFileAsync({...profilePicture, filename: profilePictureName}, "./uploads/profile_pictures")
            const profilePicturePath = path.join("./uploads/profile_pictures", profilePictureName)
    
            const uidImageName = Date.now() + uidImage.filename
            await saveFileAsync({...uidImage, filename: uidImageName}, "./uploads/UID_images")
            const uidImagePath = path.join("./uploads/UID_images", uidImageName)
    
            console.log("uidimage path : ", uidImagePath)
    
            const userFriends = new UserFriends({
                friends: [],
                friendRequestsSent: [],
                friendRequestsReceived: []
            })
    
            const userFriendsSaved = await userFriends.save()
    
            const user = new User({name, username, bio, password: hashedPassword, phone, email, university, uid, uidImagePath, profilePicturePath, tags, friendsId: userFriendsSaved._id})
            console.log("user : ", user)
            const savedUser = await user.save()
            // const cart = new Cart({userId: savedUser._id, cartItems: []})
            // await cart.save()
    
            // creating the personal folder of the user
            const directory = new UserDirectory({
                userId: savedUser._id,
                hieracy: {
                    name: "/",
                    notes: [],
                    videos: [],
                    links: [],
                    subDirs: []
                }
            })
    
            await directory.save()
    
            // const token = jwt.sign({name: savedUser.name, email: savedUser.email}, process.env.SECRETE_KEY, {expiresIn: "24h"})
            // res.json({name: savedUser.name, email: savedUser.email, token})
            res.json({name: savedUser.name, email: savedUser.email})
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

async function emailVerificationController(req, res) {
    const {email, otp} = req.body
    // const {name, phone, uid, concent, password} = tempUsers[email]

    if(!otpStore[email]){
        res.json({ error: "OTP has been expired." })
    }else if(otpStore[email] === otp){
        const user = await User.getUser(email)
        user.emailVerified = true
        await user.save()
        // res.json({success: "Email verified successfully."})
        const token = jwt.sign({ name: user.name, email: user.email, userId: user._id }, process.env.SECRETE_KEY, { expiresIn: "24h" })
        res.json({ name: user.name, email: user.email, token, userId: user._id })
    } else {
        res.json({ error: "OTP provided is incorrect." })
    }
}

async function changePasswordController(req, res){
    const {email, otp, newPassword} = req.body
    // const {name, phone, uid, concent, password} = tempUsers[email]
    
    if(!otpStore[email]){
        res.json({error: "OTP has been expired."})
    }else if(otpStore[email] === otp){
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        
        const user = await User.getUser(email)
        user.password = hashedPassword

        await user.save()
        // res.json({success: "Email verified successfully."})
        const token = jwt.sign({name: user.name, email: user.email, userId: user._id}, process.env.SECRETE_KEY, {expiresIn: "24h"})
        res.json({name: user.name, email: user.email, token, userId: user._id})
    }else{
        res.json({error: "OTP provided is incorrect."})
    }
}

async function changePasswordController(req, res){
    const {email, otp, newPassword} = req.body
    // const {name, phone, uid, concent, password} = tempUsers[email]
    
    if(!otpStore[email]){
        res.json({error: "OTP has been expired."})
    }else if(otpStore[email] === otp){
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        
        const user = await User.getUser(email)
        user.password = hashedPassword

        await user.save()
        // res.json({success: "Email verified successfully."})
        const token = jwt.sign({name: user.name, email: user.email, userId: user._id}, process.env.SECRETE_KEY, {expiresIn: "24h"})
        res.json({name: user.name, email: user.email, token, userId: user._id})
    }else{
        res.json({error: "OTP provided is incorrect."})
    }
}

const verificationCodeBlocked = {}
const numberOfAttempts = {}
const maxNumberOfAttemps = 5
const blockedPeriod = 10000 // ms
async function sendingVerificationCodeController(req, res) {
    const { email } = req.body

    if (verificationCodeBlocked[email]) {
        res.json({ error: "Email verification for this email address has been temporarily disabled due to security reasons." })
        return
    }

    if (!numberOfAttempts[email]) {
        numberOfAttempts[email] = 1
    } else {
        numberOfAttempts[email] += 1
    }
    // console.log("number of attempts : ", numberOfAttempts[email])

    if (numberOfAttempts[email] > maxNumberOfAttemps) {
        verificationCodeBlocked[email] = true
        setTimeout(() => {
            numberOfAttempts[email] = 0
            verificationCodeBlocked[email] = false
        }, blockedPeriod);
        res.json({ error: "Maximum retry count exceeded. Please retry after 10 minutes." })
        return
    }

    const user = await User.getUser(email)
    console.log("--- user : ", user)
    // if(user.emailVerified){
    //     res.json({error: "Your email has already been verified"})
    //     return
    // }
    // saving the user data temporaly until the gmail is verified
    // tempUsers[email] = {name, email, phone, uid, concent, password}

    // verifying email provided
    const otp = generateOTP();
    otpStore[email] = otp; // Save OTP in memory

    const mailOptions = {
        from: process.env.GMAIL_USER, // Sender email
        to: email, // Receiver email
        subject: 'Learnet verification Code',
        // html: `
        //     <h2>OTP Verification</h2>
        //     <p>Your OTP code is:</p>
        //     <h3>${otp}</h3>
        //     <p>It is valid for 5 minutes.</p>
        // `,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                        color: #333333;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 30px auto;
                        background: #ffffff;
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-align: center;
                        padding: 20px;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }
                    .email-header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .email-body {
                        padding: 20px;
                    }
                    .email-body p {
                        font-size: 16px;
                        line-height: 1.6;
                        margin: 10px 0;
                    }
                    .otp-code {
                        display: block;
                        background: #f4f4f4;
                        border: 1px dashed #4CAF50;
                        font-size: 24px;
                        font-weight: bold;
                        color: #4CAF50;
                        text-align: center;
                        padding: 10px;
                        margin: 20px 0;
                        letter-spacing: 2px;
                    }
                    .email-footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #777777;
                        background-color: #f9f9f9;
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
                    .email-footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    .email-footer a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Verify Your Email - Learnet</h1>
                    </div>
                    <div class="email-body">
                        <p>Hi,</p>
                        <p>Thank you for signing up with <strong>Learnet</strong>. To complete your registration, please verify your email by using the following OTP:</p>
                        <span class="otp-code">${otp}</span>
                        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                        <p>If you didn't request this verification, please ignore this email.</p>
                    </div>
                    <div class="email-footer">
                        <p>&copy; ${new Date().getFullYear()} Learnet. All rights reserved.</p>
                        <p>
                            Need help? Visit our 
                            <a href="https://learner.com/help" target="_blank">Help Center</a> 
                            or contact our 
                            <a href="mailto:support@learner.com">support team</a>.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `,

    };

    await transporter.sendMail(mailOptions);
    console.log("------- sending verification code to : ", email)
    res.status(200).json({ success: 'OTP sent successfully.' });

    // Optional: Clear the OTP after 5 minutes
    setTimeout(() => {
        delete otpStore[email];
    }, 60000); // 5 minutes
    // -------------------------

    // setTimeout(() => {
    //     delete tempUsers[email];
    // }, 600000);

}

async function forgotPWController(req, res) {

}

module.exports = {
    getVideoTest,
    getUserProfilePictureController,
    getUserController,
    getUserControllerc,
    getUsersController,
    loginController,
    changePasswordController,
    usernameAvailabilityController,
    signupController,
    emailVerificationController,
    sendingVerificationCodeController,
    forgotPWController
}