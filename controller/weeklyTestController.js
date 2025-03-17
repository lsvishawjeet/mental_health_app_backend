const express = require('express')
const weeklyTestModel = require('../models/weeklyTestModel')

const createWeeklyTestController = async (req, res) => {
    try {
        const { score, answers, postedBy } = req.body
        const test = await weeklyTestModel({
            score,
            answers,
            postedBy: req.auth._id
        }).save()
        res.status(201).send({
            success: true,
            message: 'Data recorded',
            test
        })
        console.log(req)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in weeklyTest api',
            error
        })
    }
}

const getWeeklyTestController = async (req, res) => {
    try {
        const patientId = req.query.patientId || req.auth._id;


        if (!patientId) {
            return res.status(400).send({
                success: false,
                message: "Patient ID is required"
            });
        }
        const test = await weeklyTestModel.find({ postedBy: patientId })
        res.status(200).send({
            success: true,
            message: 'feel',
            test
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in weeklyTest api',
            err
        });
    }
}

module.exports = { createWeeklyTestController, getWeeklyTestController }