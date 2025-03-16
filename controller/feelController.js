const express = require('express')
const feelingModel = require('../models/feelingModel')

const createFeelController = async (req, res) => {
    try {
        const { feelNumber, feel } = req.body
        const feeling = await feelingModel({
            feelNumber,
            feel,
            postedBy: req.auth._id
        }).save()
        res.status(201).send({
            success: true,
            message: 'Data recorded',
            feeling
        })
        console.log(req)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in feel api',
            error
        })
    }
}

const getFeelController = async (req, res) => {
    try {
        const patientId = req.query.patientId || req.auth._id;


        if (!patientId) {
            return res.status(400).send({
                success: false,
                message: "Patient ID is required"
            });
        }


        const date = new Date(); // Current date
        const yesterday = new Date(date);
        yesterday.setDate(date.getDate() - 7); // week before data
        // "sad", "happy", "angry", "fear", "excited", "disgust", "anxiety"

        const feel = await feelingModel.find(
            {
                postedBy: patientId,
                createdAt: {
                    $gte: new Date(yesterday.setHours(0, 0, 0, 0)), // Start of week ago
                    $lte: new Date(date.setHours(23, 59, 59, 999))  // End of today
                }
            },
        )

        const aiFeel = await

            res.status(200).send({
                success: true,
                message: 'feel',
                feel
            });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error in feel api',
            err
        });
    }
}


module.exports = { createFeelController, getFeelController }