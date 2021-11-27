module.exports.createElement = function (ElementModel) {
    return async function (req, res) {
        try {
            let elemObj = req.body;
            if (elemObj) {
                let element = await ElementModel.create(elemObj);
                return res.status(200).json({
                    message: "Element Created",
                    element
                })
            } else {
                return res.status(400).json({
                    message: "Kindly enter user data"
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}
module.exports.getElements = function (ElementModel) {
    return async function (req, res) {
        try {
            // query params
            // localhost:8080/api/plan?select=name%price&page=1&sort=price&myQuery={"price":{"$gt":1500}}
            console.log(req.query);
            let requestPromise;
            // query
            if (req.query.myQuery) {
                requestPromise = ElementModel.find(JSON.parse(req.query.myQuery));
            } else {
                requestPromise = ElementModel.find();
            }
            // sort -> use (-) for descending order 
            if (req.query.sort) {
                requestPromise = requestPromise.sort(req.query.sort);
            }
            // select 
            if (req.query.select) {
                let params = req.query.select.split("%").join(" ");
                requestPromise = requestPromise.select(params);
            }
            // pagination - skip(), limit()
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 3;
            let toSkip = (page - 1) * limit;
            requestPromise = requestPromise
                .skip(toSkip)
                .limit(limit);
            let elements = await requestPromise;
            res.status(200).json({
                elements
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "can't get elements"
            })
        }
    }
}
module.exports.updateElement = function (ElementModel) {
    return async function (req, res) {
        try {
            let id = req.params.id;
            console.log(id);
            // await ElementModel.findByIdAndUpdate(id, req.body, { runValidators: true });
            let element = await ElementModel.findById(id);
            if (element) {
                for (let key in req.body) {
                    element[key] = req.body[key];
                }
                await element.save();
                return res.status(200).json({
                    message: "element updated",
                    element
                });
            } else {
                return res.status(404).json({
                    message: "resource not found"
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.deleteElement = function (ElementModel) {
    return async function (req, res) {
        try {
            let id = req.params.id;
            let element = await ElementModel.findByIdAndDelete({ _id: id })
            if (!element) {
                return res.status(404).json({
                    message: "resource not found"
                })
            } else {
                return res.status(200).json({
                    message: "element deleted",
                    element
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            })
        }

    }
}
module.exports.getElementById = function (ElementModel) {
    return async function (req, res) {
        try {
            let id = req.params.id;
            let element = await ElementModel.findById(id);
            return res.status(200).json({
                message: "element retrieved",
                element
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Server error"
            });
        }
    }
}