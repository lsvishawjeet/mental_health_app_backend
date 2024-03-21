const express = require('express')
const feelingModel = require('../models/feelingModel')
const streakModel = require('../models/streakModel')
const { findByIdAndUpdate, findOneAndUpdate } = require('../models/streakModel')

const createStreakController = async(req, res)=>{
    try {
        const {feelNumber, feel} = req.body
        const streak = await streakModel({
            streak,
            postedBy: req.auth._id
        }).save()
        res.status(201).send({
            success: true,
            message: 'Data recorded',
            streak
        })
        console.log(req)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in streak api',
            error
        })
    }
}
const updateStreakController = async(req, res)=>{
    try {
        const id = req._id
        const newStreak = req.streak
        const streak = await findOneAndUpdate({
            postedBy: id, newStreak
        })
        res.status(201).send({
            success: true,
            message: 'Data recorded',
            streak
        })
        console.log(req)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in streak api',
            error
        })
    }
}

module.exports = {createStreakController, updateStreakController}
