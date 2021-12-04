const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
// server init
const app = express();
// post accept
app.use(express.json());
// cookies
app.use(cookieParser());
// Serve static files - folder designate
app.use(express.static('public'))

// code of routers will run first
const userRouter = require("./Routers/userRouter");
// auth router -> verb -> create inside user
const authRouter = require("./Routers/authRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/plan", planRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);

// 404 page not found
app.use(function (req, res) {
    // res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    res.status(404).json({
        message: "404 Page Not Found"
    });
})

// localhost:8080
// heroku physical -> multiple server run
app.listen(process.env.PORT || 8080, function () {
    console.log("server started at http://localhost:8080");
})