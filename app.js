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
app.get("/", function (req, res) {
    console.log("Hello from home page");
    res.send("<h1>Hello from Backend</h1>");
});

// CRUD application
let user = {
};
// Post - giving data to server
app.post("/user", function (req, res) {
    console.log("req.body", req.body);
    user = req.body;
    res.status(200).send("data received and user added");
})
// Get - getting data from server
app.get("/user", function (req, res) {
    console.log("users");
    // for sending key value pair
    res.json(user);
})
// Patch - update data
app.patch("/user", function (req, res) {
    let obj = req.body;
    for (let key in obj) {
        user[key] = obj[key];
    }
    res.status(200).json(user);
})
// Delete - delete data
app.delete("/user", function (req, res) {
    user = {};
    res.status(200).json(user);
})

// Template Route
app.get("/user/:id", function (req, res) {
    console.log(req.params);
    res.status(200).send("Hello");
})

// localhost:8080
app.listen(8080, function () {
    console.log("server started");
})

// Port, IP, localhost - Refer Notes
// IP Address 
// Port Number
// Methods
// Status Codes