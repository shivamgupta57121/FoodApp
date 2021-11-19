const mongoose = require("mongoose");
const emailValidator = require("email-validator")
//link
let { DB_LINK } = require("../secret");
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
    }
})
// create model
const userModel = mongoose.model("userModel", userSchema);
// insert entry/document
(async function createdUser() {
    let user = await userModel.create({
        name: "Shivam",
        password: "123456789",
        email: "abc@gmai.com",
        age: 24,
        confirmPassword: "123456789"
    });
    console.log("user", user);
})();