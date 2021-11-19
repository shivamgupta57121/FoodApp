const express = require("express");
// server init
const app = express();
// post accept
app.use(express.json());
// Serve static files - folder designate
app.use(express.static('public'))

// code of routers will run first
const userRouter = require("./Routers/userRouter");
const authRouter = require("./Routers/authRouter");
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// localhost:8080
app.listen(8080, function () {
    console.log("server started at http://localhost:8080");
})