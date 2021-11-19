const express = require("express");
const userModel = require("../models/userModel");

// Mounting in express
const authRouter = express.Router();

authRouter
    .post("/signup", setCreatedAt, signupUser)
    .post("/login", loginUser);

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
// pending
// password - encrypt in DB
// login -> flag 
async function loginUser(req, res) {
    // email ,password -> userModel -> 
    // findOne()
    try {
        if (req.body.email) {
            let user = await userModel.findOne({ "email": req.body.email })
            if (user.email == req.body.email && user.password == req.body.password) {
                return res.status(200).json({
                    user,
                    "message": "user logged in "
                })
            } else {
                return res.status(401).json({
                    "message": "Email or password is wrong"
                })
            }
        } else {
            return res.status(403).json({
                message: "Email is not present"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// middleware
function setCreatedAt(req, res, next) {
    // {}
    let body = req.body;
    // console.log(body);
    let length = Object.keys(body).length;
    if (length == 0) {
        return res.status(400).json({
            message: "can't create user when body is empty "
        })
    }
    req.body.createdAt = new Date().toISOString();
    next();
}

// forget
// reset
// protect route 

module.exports = authRouter;