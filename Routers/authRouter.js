const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env || require("../secret");
const userModel = require("../models/userModel");
const emailSender = require('../helpers/emailSender');

// Mounting in express
const authRouter = express.Router();

authRouter
    .post("/signup", setCreatedAt, signupUser)
    .post("/login", loginUser)
    .post("/forgetPassword", forgetPassword)
    .post("/resetPassword", resetPassword);

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
    // Logic for Login ----------------------------------------------
    // email -> find user -> user
    // password match 
    // reply - you are logged in
    // send token - to authenticate user next time
    // --------------------------------------------------------------
    // email ,password -> userModel -> 
    // findOne()
    try {
        if (req.body.email) {
            let user = await userModel.findOne({ "email": req.body.email })
            if (user) {
                if (user.password == req.body.password) {
                    // header
                    // res.cookie("test", "1234", { httpOnly: true });
                    let payload = user["_id"];
                    // console.log("Key", JWT_KEY);
                    var token = jwt.sign({ id: payload }, JWT_KEY);
                    // console.log("Token", token);
                    res.cookie("jwt", token, { httpOnly: true });
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
async function forgetPassword(req, res) {
    let email = req.body.email;
    try {
        if (email) {
            let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            // console.log(seq);
            await userModel.updateOne({ email }, { token: seq });
            // email to be send
            // nodemailer -> table tag through
            // service -> gmail
            let user = await userModel.findOne({ email });
            await emailSender(seq, user.email);
            // console.log(user);
            if (user?.token) {
                return res.status(200).json({
                    message: "Email send with OTP " + seq
                });
            } else {
                return res.status(404).json({
                    message: "user not found"
                })
            }
        } else {
            return res.status(400).json({
                message: "kindly enter email"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}

// reset
async function resetPassword(req, res) {
    let { token, password, confirmPassword } = req.body;
    try {
        if (token) {
            // findOne
            let user = await userModel.findOne({ token });
            if (user) {
                // method to update data
                user.resetHandler(password, confirmPassword);
                // save updated data in db
                await user.save();
                return res.status(200).json({
                    message: "password reset success"
                })
            } else {
                return res.status(404).json({
                    message: "incorrect token"
                })
            }
        }
        else {
            return res.status(404).json({
                message: "token not found"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}

// protect route 

module.exports = authRouter;