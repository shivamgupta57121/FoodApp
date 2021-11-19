const express = require("express");
// server init
const app = express();
// post accept
app.use(express.json());
// Serve static files - folder designate
app.use(express.static('public'))

const userModel = require("./models/userModel");

// Mounting in express
const userRouter = express.Router();
const authRouter = express.Router();
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

userRouter
    .route("/")
    .get(getUsers);

userRouter
    .route("/:id")
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

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
    console.log(body);
    let length = Object.keys(body).length;
    if (length == 0) {
        return res.status(400).json({
            message: "can't create user when body is empty "
        })
    }
    req.body.createdAt = new Date().toISOString();
    next();
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

// localhost:8080
app.listen(8080, function () {
    console.log("server started at http://localhost:8080");
})