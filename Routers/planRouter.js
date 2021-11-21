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

// query params
// localhost:8080/api/plan?select=name%price&page=1&sort=price&myQuery={"price":{"$gt":1500}}
async function getPlans(req, res) {
    try {
        console.log(req.query);
        let result;
        if (Object.keys(req.query).length != 0) {
            // filter 
            // myQuery - greater than 1500
            let myQuery = JSON.parse(req.query.myQuery);
            console.log("myQuery:", myQuery);
            let plansQuery = planModel.find(myQuery);

            // sort - descending
            let sortField = req.query.sort;
            console.log("sortField:", sortField);
            let sortQuery = plansQuery.sort(`-${sortField}`);

            // show name and price only
            let selectParams = req.query.select.split("%").join(" ");
            console.log("select params:", selectParams);
            let filteredQuery = sortQuery.select(`${selectParams} -_id`);

            // pagination - skip(), limit()
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 3;
            let toSkip = (page - 1) * limit;
            let paginatedResult = filteredQuery.skip(toSkip).limit(limit);

            result = await paginatedResult;
        } else {
            result = await planModel.find();
        }
        return res.status(200).json({
            message: "List of all plans",
            result
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