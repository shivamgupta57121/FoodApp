const express = require("express");
// server init
const app = express();
// post accept
app.use(express.json());
// Serve static files - folder designate
app.use(express.static('public'))

const userModel = require("./models/userModel");
async function signupUser(req, res) {
    try {
        let userObj = req.body;
        console.log("userObj", userObj);
        let user = await userModel.create(userObj);
        console.log("user", user);
        res.status(200).json({
            message: "user created",
            createdUser: user
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
function loginUser(req, res) {

}
// middleware
function setCreatedAt(req, res, next) {
    // {}
    let body = req.body;
    let length = Object.keys(body).length;
    if (length == 0) {
        return res.status(400).json({
            message: "can't create user when body is empty "
        })
    }
    req.body.createdAt = new Date().toISOString();
    next();
}

// Mounting in express
const authRouter = express.Router();
app.use("/api/auth", authRouter);

authRouter
    .post("/signup", setCreatedAt, signupUser)
    .post("/login", loginUser);

// localhost:8080
app.listen(8080, function () {
    console.log("server started at http://localhost:8080");
})