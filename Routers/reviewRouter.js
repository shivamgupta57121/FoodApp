// dependencies
const express = require("express");
const ReviewModel = require("../models/reviewModel");
const PlanModel = require("../models/planModel");
const ReviewRouter = express.Router();
const factory = require("../helpers/factory");
const protectRoute = require("./authHelper");

const createReview = async function (req, res) {
    try {
        let review = await ReviewModel.create(req.body);
        console.log("Review Created", review);
        let planId = review.plan;
        let plan = await PlanModel.findById(planId);
        if(plan.ratingAverage) {
            let ratingSum = plan.ratingAverage * plan.reviews.length;
            let finalAvgRating = (ratingSum + review.rating) / (plan.reviews.length + 1);
            plan.ratingAverage = finalAvgRating;
        } else {
            plan.ratingAverage = review.rating;
        }
        plan.reviews.push(review["_id"]);
        await plan.save();
        res.status(200).json({
            message: "review created",
            review
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        })
    }
};
const getReviews = factory.getElements(ReviewModel);
const updateReview = factory.updateElement(ReviewModel);
const deleteReview = async function (req, res) {
    try {
        let review = await ReviewModel.findByIdAndDelete(req.params.id);
        console.log("Review Deleted ", review);
        let planId = review.plan;
        let plan = await PlanModel.findById(planId);
        let idxOfReview = plan.reviews.indexOf(review["_id"]);
        plan.reviews.splice(idxOfReview, 1);
        await plan.save();
        res.status(200).json({
            message: "review deleted",
            review
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        })
    }
};
const getReviewById = factory.getElementById(ReviewModel);

ReviewRouter.use(protectRoute);
ReviewRouter
    .route("/:id")
    .get(getReviewById)
    .patch(updateReview)
    .delete(deleteReview);

ReviewRouter
    .route("/")
    .get(getReviews)
    .post(createReview);

module.exports = ReviewRouter;