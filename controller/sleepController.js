const sleepModel = require('../models/sleepModel')

const createSleepController = async (req, res) => {
    try {
        const {
            bedTime,
            wakeTime,
            differenceInMill
        } = req.body
        const sleep = await sleepModel({
            bedTime,
            wakeTime,
            differenceInMill,
            postedBy: req.auth._id
        }).save();
        res.status(201).send({
            success: true,
            message: 'Data updated successfully',
            sleep
        })
        console.log(req)
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in sleep api',
            err
        })
    }
}

//get daily tasks
const getSleepController = async (req, res) => {
    try {
        const sleep = await sleepModel.find({postedBy: req.auth._id})
        res.status(200).send({
            success: true,
            message: 'sleep',
            sleep
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in sleep api',
            err
        });
    }
}

module.exports = {
    createSleepController,
    getSleepController
}