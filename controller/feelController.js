const express = require('express')
const feelingModel = require('../models/feelingModel')

const createFeelController = async(req, res)=>{
    try {
        const {feelNumber, feel} = req.body
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

const getFeelController = async(req,res)=>{
    try {
        const feel = await feelingModel.find({postedBy: req.auth._id})
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

module.exports = {createFeelController, getFeelController}