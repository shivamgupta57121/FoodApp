// dependencies
const express = require("express");
const BookingModel = require("../models/bookingModel");
const UserModel = require("../models/userModel");
const PlanModel = require("../models/planModel");
const BookingRouter = express.Router();
const factory = require("../helpers/factory");
const protectRoute = require("./authHelper");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { KEY_ID, KEY_SECRET } = require("../secret") || process.env;
var razorpayInstance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

const getBookings = factory.getElements(BookingModel);
const updateBooking = factory.updateElement(BookingModel);
const getBookingById = factory.getElementById(BookingModel);
// create booking
const initiateBooking = async function (req, res) {
    try {
        let planId = req.body.plan;
        let plan = await PlanModel.findById(planId);
        req.body.boughtAtPrice = plan.price;
        let booking = await BookingModel.create(req.body);
        console.log("Booking Created : ");
        console.log(booking);
        let bookingId = booking["_id"];
        let userId = req.body.user;
        let user = await UserModel.findById(userId);
        user.confirmPassword = user.password;
        user.bookings.push(bookingId);
        await user.save();
        const payment_capture = 1;
        // Amount is in currency subunits. Default currency is INR.
        // Example - 100 refers to 100 paise or 1 Rs
        const amount = plan.price * 100;
        const currency = "INR";
        const options = {
            amount,
            currency,
            receipt: `rs_${bookingId}`,
            payment_capture,
        };
        const response = await razorpayInstance.orders.create(options);
        console.log("Order Created : ");
        // response.id to be sent to front end for making payment
        console.log(response);
        res.status(200).json({
            message: "booking created",
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            booking
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        })
    }
};
const deleteBooking = async function (req, res) {
    try {
        let booking = await BookingModel.findByIdAndDelete(req.params.id);
        console.log("Booking", booking);
        let userId = booking.user;
        let user = await UserModel.findById(userId);
        let idxOfBooking = user.bookings.indexOf(booking["_id"]);
        user.booking.splice(idxOfBooking, 1);
        await user.save();
        res.status(200).json({
            message: "booking deleted",
            booking
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        })
    }
};
// To confirm the authenticity of the details 
// returned to the checkout for successful payments.
async function verifyPayment(req, res) {
    console.log("Inside Verify Payment");
    const secret = KEY_SECRET;
    console.log(req.body);
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);

    if (expectedSignature === req.body.response.razorpay_signature) {
        console.log("request is legit");
        res.status(200).json({
            message: "OK",
            signatureIsValid: "true"
        });
    } else {
        res.status(403).json({ message: "Invalid" });
    }
};


BookingRouter
    .route("/verification")
    .post(verifyPayment);

BookingRouter
    .route("/:id")
    .get(getBookingById)
    .patch(protectRoute, updateBooking)
    .delete(protectRoute, deleteBooking);

BookingRouter
    .route("/")
    .get(getBookings)
    // create -> payment
    .post(protectRoute, initiateBooking);

module.exports = BookingRouter;