const mongoose = require("mongoose");
const emailValidator = require("email-validator")
//link
let { DB_LINK } = process.env
// connection form
mongoose.connect(DB_LINK).then(function (db) {
    // console.log(db);
    console.log("connected to db")
}).catch(function (err) {
    console.log("err", err);
})
// create schema - syntax 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email);
        }
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        minlength: 7,
        required: true
    },
    confirmPassword: {
        type: String,
        minlength: 7,
        required: true,
        validate: function () {
            return this.password == this.confirmPassword;
        }
    },
    createdAt: Date,
    token: String,
    role: {
        type: String,
        enum: ["admin", "user", "manager"],
        default: "user"
    },
    bookings: {
        // array of object id
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    }
})
// order matters 
// middleware
userSchema.pre("save", function () {
    // db confirm password will not be saved
    // console.log("Hello");
    this.confirmPassword = undefined;
})

// document method
userSchema.methods.resetHandler =
    function (password, confirmPassword) {
        this.password = password;
        this.confirmPassword = confirmPassword;
        // token reuse is not possible
        this.token = undefined;
    }

// create model
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;