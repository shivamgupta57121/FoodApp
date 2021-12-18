const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path");
const cookieParser = require("cookie-parser");
// server init
const app = express();
// cors
app.use(cors());
// rate limit
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // start blocking after 100 requests
    message:
        "Too many requests from this IP, please try again after 15 minutes"
}));
// hpp - disallow extra query params
app.use(hpp({
    whitelist: [
        'myQuery',
        'sort',
        'select',
        'page',
        'limit'
    ]
}));
// to set http headers
app.use(helmet());
// post accept
app.use(express.json());
// cross site scripting 
app.use(xss());
// mongodb query sanatize
app.use(mongoSanitize());
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