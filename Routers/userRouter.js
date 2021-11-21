const express = require("express");
const userModel = require("../models/userModel");
const protectRoute = require("./authHelper");
// Mounting in express
const userRouter = express.Router();
// protect route as middleware for allowing access to only logged in user
userRouter
    .route("/")
    .get(protectRoute, authorizeUser(["admin"]), getUsers)
    .post(protectRoute, authorizeUser(["admin"]), createUser);

userRouter
    .route("/:id")
    .get(protectRoute, authorizeUser(["admin", "manager"]), getUserById)
    .patch(updateUser)
    .delete(protectRoute, authorizeUser(["admin"]), deleteUser);
    // Used closure, since we have to pass function defination of middleware 
    // and also need to accept argument to make authorization a generic middleware

async function createUser(req, res) {
    try {
        let userObj = req.body;
        if (userObj) {
            let user = await userModel.create(userObj);
            return res.status(200).json({
                message: "User Created",
                user
            })
        } else {
            return res.status(400).json({
                message: "Kindly enter user data"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        })
    }
}

async function getUsers(req, res) {
    // find()
    try {
        let users = await userModel.find();
        res.status(200).json({
            message: "list of all users",
            users: users
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            message: "can't get users"
        })
    }
}

async function getUserById(req, res) {
    // findOne()
    try {
        console.log(req.params.id);
        let user = await userModel.findOne({ "email": req.params.id });
        if (user.email == req.params.id) {
            res.status(200).json({
                message: "user retrieved",
                user
            })
        } else {
            return res.status(403).json({
                message: "Email is not present"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            message: "can't get user"
        })
    }
}

async function updateUser(req, res) {
    // findByIdAndUpdate() or findOneAndUpdate()
    try {
        console.log(req.params.id, req.body.age);
        user = await userModel.findOneAndUpdate({ "email": req.params.id }, { $set: { age: req.body.age } });
        if (user.email == req.params.id) {
            res.status(200).json({
                message: "user updated"
            })
        } else {
            return res.status(403).json({
                message: "Email is not present"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            message: "can't update user"
        })
    }
}

async function deleteUser(req, res) {
    // findByIdAndDelete() or findOneAndDelete()
    try {
        console.log(req.params.id);
        user = await userModel.findOneAndDelete({ "email": req.params.id });
        if (user.email == req.params.id) {
            res.status(200).json({
                message: "user deleted"
            })
        } else {
            return res.status(403).json({
                message: "Email is not present"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            message: "can't delete user"
        })
    }
}

// Using closure - refer above comment
function authorizeUser(roleArr) {
    return async function (req, res, next) {
        let uid = req.uid;
        let { role } = await userModel.findById(uid);
        let isAuthorized = roleArr.includes(role);
        if (isAuthorized) {
            next();
        } else {
            res.status(403).json({
                message: "user not authorized contact admin"
            })
        }
    }
}

module.exports = userRouter;