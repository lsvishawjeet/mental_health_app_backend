const dailyTaskModel = require("../models/dailyTaskModel")

const createDailyTaskController = async (req, res) => {
    try {
        const {
            newActivity,
            timeIndexValue,
            selectedDate,
            selectedDay
        } = req.body
        const dailyTask = await dailyTaskModel({
            newActivity,
            timeIndexValue,
            selectedDate,
            selectedDay,
            postedBy: req.auth._id
        }).save();
        res.status(201).send({
            success: true,
            message: 'Task added successfully',
            dailyTask,
        })
        console.log(req)
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in daily task api',
            err
        })
    }
}

//get daily tasks
const getDailyTasksController = async (req, res) => {
    try {
        const dailyTasks = await dailyTaskModel.find({postedBy: req.auth._id})
        res.status(200).send({
            success: true,
            message: 'dailyTask',
            dailyTasks
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in getDailyTask api',
            err
        });
    }
}

module.exports = {
    createDailyTaskController,
    getDailyTasksController
}