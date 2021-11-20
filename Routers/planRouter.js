const express = require("express");
const planModel = require("../models/planModel");
const planRouter = express.Router();

planRouter
    .route("/:id")
    .get(getPlanById)
    .patch(updatePlan)
    .delete(deletePlan);

planRouter
    .route("/")
    .get(getPlans)
    .post(createPlan);

async function createPlan(req, res) {
    try {
        let planObj = req.body;
        if (planObj) {
            let plan = await planModel.create(planObj);
            return res.status(200).json({
                message: "Plan Created",
                plan
            })
        } else {
            return res.status(400).json({
                message: "Kindly enter plan data"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        })
    }
}

async function getPlans(req, res) {
    try {
        // filter
        // sort
        // hide
        // paginate
        let plans = await planModel.find();
        return res.status(200).json({
            message: "List of all plans",
            plans
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "can't get plans"
        })
    }
}

async function getPlanById(req, res) {
    try {
        let id = req.params.id;
        let plan = await planModel.findById(id);
        return res.status(200).json({
            message: "plan retrieved",
            plan
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        })
    }
}

async function updatePlan(req, res) {
    try {
        let name = req.body.name;
        await planModel.updateOne({ name }, req.body);
        let plan = await planModel.findOne({ name });
        res.status(200).json({
            message: "plan updated",
            plan
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        })
    }
}

// pending
async function deletePlan(req, res) {

}

module.exports = planRouter;