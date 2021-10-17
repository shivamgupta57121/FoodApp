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

// function -> route path
// frontend -> req -> /
// app.get("/", function (req, res) {
//     console.log("Hello from home page");
//     res.send("<h1>Hello from Backend</h1>");
// });

// CRUD application
let user = {
};

function createUser(req, res) {
    console.log("req.body", req.body);
    user = req.body;
    res.status(200).send("data received and user added");
}
function getUser(req, res) {
    console.log("users");
    // for sending key value pair
    res.json(user);
}
function updateUser(req, res) {
    let obj = req.body;
    for (let key in obj) {
        user[key] = obj[key];
    }
    res.status(200).json(user);
}
function deleteUser(req, res) {
    user = {};
    res.status(200).json(user);
}
function getUserById(req, res) {
    console.log(req.params);
    res.status(200).send("Hello");
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
const router = express.Router();
app.use("/api/user", router); // Common Path
router
    .route("/")
    .get(getUser)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser);

router
    .route("/:id")
    .get(getUserById);

// localhost:8080
app.listen(8080, function () {
    console.log("server started");
})

// Port, IP, localhost - Refer Notes
// IP Address 
// Port Number
// Methods
// Status Codes