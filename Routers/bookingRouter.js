// dependencies
const express = require("express");
const BookingModel = require("../models/bookingModel");
const UserModel = require("../models/userModel");
const BookingRouter = express.Router();
const factory = require("../helpers/factory");
const protectRoute = require("./authHelper");

const getBookings = factory.getElements(BookingModel);
const updateBooking = factory.updateElement(BookingModel);
const getBookingById = factory.getElementById(BookingModel);
// create booking
const initiateBooking = async function (req, res) {
    try {
        let booking = await BookingModel.create(req.body);
        let bookingId = booking["_id"];
        let userId = req.body.user;
        let user = await UserModel.findById(userId);
        user.bookings.push(bookingId);
        await user.save();
        res.status(200).json({
            message: "booking created",
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

BookingRouter.use(protectRoute);
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