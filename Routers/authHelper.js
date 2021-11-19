// protect route as middleware for allowing access to only logged in user
// logic to be written for flag
// user should be asked to login first time only
// not again and again
let flag = false;
// middleware
function protectRoute(req, res, next) {
    try {
        if (flag) {
            next();
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