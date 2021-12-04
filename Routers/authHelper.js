// protect route as middleware for allowing access to only logged in user
// logic to be written for flag
// user should be asked to login first time only
// not again and again
// let flag = false;
// middleware

const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env || require("../secret");

function protectRoute(req, res, next) {
    console.log(req.cookies);
    try {
        if (req.cookies.jwt) {
            let decryptedToken = jwt.verify(req.cookies.jwt, JWT_KEY);
            if (decryptedToken) {
                req.uid = decryptedToken.id;
                next();
            }
        } else {
            res.status(401).json({
                message: "You are not allowed"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: "server error"
        })
    }
}

module.exports = protectRoute;