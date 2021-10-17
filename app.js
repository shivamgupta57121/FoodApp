// npm init -y
// npm i express 
// npm i nodemon -g
const express = require("express");
// Server ---> route -> request -> response/file
// File System ---> path -> interact/ type -> file/folder
// server init
const app = express();
// post accept
app.use(express.json());
// Serve static files - folder designate
app.use(express.static('public'))

// function -> route path
// frontend -> req -> /
// app.get("/", function (req, res) {
//     console.log("Hello from home page");
//     res.send("<h1>Hello from Backend</h1>");
// });

// CRUD application
// let user = {
// };

// function createUser(req, res) {
//     console.log("req.body", req.body);
//     user = req.body;
//     res.status(200).send("data received and user added");
// }
// function getUser(req, res) {
//     console.log("users");
//     // for sending key value pair
//     res.json(user);
// }
// function updateUser(req, res) {
//     let obj = req.body;
//     for (let key in obj) {
//         user[key] = obj[key];
//     }
//     res.status(200).json(user);
// }
// function deleteUser(req, res) {
//     user = {};
//     res.status(200).json(user);
// }
// function getUserById(req, res) {
//     console.log(req.params);
//     res.status(200).send("Hello");
// }

// Database 
let user = [];
function signupUser(req, res) {
    //user name, email, password
    let { name, email, password } = req.body;
    console.log("user", req.body);
    user.push({
        email, name, password
    });
    res.status(200).json({
        message: "user created",
        createdUser: req.body
    })
}
function loginUser(req, res) {

}

// // Post - giving data to server
// app.post("/api/user", createUser);
// // Get - getting data from server
// app.get("/api/user", getUser);
// // Patch - update data
// app.patch("/api/user", updateUser);
// // Delete - delete data
// app.delete("/api/user", deleteUser);
// // Template Route
// app.get("/api/user/:id", getUserById);

// Mounting in express
// const userRouter = express.Router();
const authRouter = express.Router();
// app.use("/api/user", userRouter); // Common Path
app.use("/api/auth", authRouter);
// userRouter
//     .route("/")
//     .get(getUser)
//     .post(createUser)
//     .patch(updateUser)
//     .delete(deleteUser);

// userRouter
//     .route("/:id")
//     .get(getUserById);

authRouter
    .post("/signup", signupUser)
    .post("/login", loginUser);

// localhost:8080
app.listen(8080, function () {
    console.log("server started");
})

// Port, IP, localhost - Refer Notes
// IP Address 
// Port Number
// Methods
// Status Codes