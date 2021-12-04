const mongoose = require("mongoose");
let { DB_LINK } = require("../secret");

mongoose.connect(DB_LINK).then(function (db) {
    console.log("connected to db")
}).catch(function (err) {
    console.log("err", err);
})
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: true
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now()
    },
    boughtAtPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Failed", "Success"],
        required: true,
        default: "Pending"
    }
})
const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel;