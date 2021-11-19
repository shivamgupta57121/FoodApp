const mongoose = require("mongoose");
let { DB_LINK } = require("../secret");

// connection form
mongoose.connect(DB_LINK).then(function (db) {
    console.log(db);
}).catch(function (err) {
    console.log("err", err);
})