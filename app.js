const express = require("express");
const cookieParser = require("cookie-parser");
// server init
const app = express();
// post accept
app.use(express.json());
app.use(cookieParser());
// Serve static files - folder designate
app.use(express.static('public'))

// code of routers will run first
const userRouter = require("./Routers/userRouter");
// auth router -> verb -> create inside user
const authRouter = require("./Routers/authRouter");
const planRouter = require("./Routers/planRouter");
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/plan", planRouter);

// localhost:8080
app.listen(8080, function () {
    console.log("server started at http://localhost:8080");
})