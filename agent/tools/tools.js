const { json } = require("express")
const dailyTaskModel = require("../../models/dailyTaskModel")
const emotionModelChatbot = require("../../models/emotionModelChatbot")
const feelingModel = require("../../models/feelingModel")
const sleepModel = require("../../models/sleepModel")
const userModel = require("../../models/userModel")

const getBecksTestScore=async(userId)=>{
    console.log(userId)
    let mood = "excelent"
    console.log(mood)
    return mood
}

const getUserDetails=async(userId)=>{
    console.log(userId)
    const userDetails = await userModel.findById(userId).select("name DOB gender address occupation");
    const stringifyData = JSON.stringify(userDetails)
    return stringifyData
}

const getUserMoodData=async(userId)=>{
    const date = new Date(); // Current date
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 4); // Set to today-1

    const userMood = await feelingModel.find({
        postedBy: userId,
        createdAt: { 
            $gte: new Date(yesterday.setHours(0, 0, 0, 0)), // Start of week ago
            $lte: new Date(date.setHours(23, 59, 59, 999))  // End of today
        }
    }).select("feel createdAt");

    const getAiUserModeData = await emotionModelChatbot.find(
        {
            postedBy: userId,
            createdAt: { 
                $gte: new Date(yesterday.setHours(0, 0, 0, 0)), // Start of week ago
                $lte: new Date(date.setHours(23, 59, 59, 999))  // End of today
            }
        }
    ).select("emotionType emotionReason createdAt")

    console.log(userMood);

    const data = userMood.map((e) => {
        return {
            userFeeling: e.feel,
            time: e.createdAt
        };
    });

    const aiData = getAiUserModeData.map((e) => {
        return {
            userFeeling: e.emotionType,
            reasonBehindFeeling: e.emotionReason,
            time: e.createdAt
        };
    })
    const stringifyData = JSON.stringify(data);
    const stringifyAiData = JSON.stringify(aiData);
    // console.log(stringifyData)
    return JSON.stringify(JSON.stringify({stringifyData, stringifyAiData}))
}

const getUserSleepData=async(userId)=>{
    const date = new Date(); // Current date
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 7); // Set to today-1

    const sleepData = await sleepModel.find({
        postedBy: userId,
        updatedAt: { 
            $gte: new Date(yesterday.setHours(0, 0, 0, 0)), // Start of week ago
            $lte: new Date(date.setHours(23, 59, 59, 999))  // End of today
        }
    }).select("bedTime wakeTime updatedAt");

    const stringifyData = JSON.stringify(sleepData)
    return stringifyData
}

const getDailyTasks=async(userId)=>{
    const date = new Date(); // Current date
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1); // Set to today-1

    const dailyTasks = await dailyTaskModel.find({
        postedBy: userId,
        createdAt: { 
            $gte: new Date(yesterday.setHours(0, 0, 0, 0)), // Start of yesterday
            $lte: new Date(date.setHours(23, 59, 59, 999))  // End of today
        }
    }).select("newActivity selectedDate selectedDay timeIndexValue createdAt");

    console.log(dailyTasks);

    const data = dailyTasks.map((e) => {
        return {
            activityName: e.newActivity,
            date: e.selectedDate,
            day: e.selectedDay,
            time: e.timeIndexValue,
            createdAt: e.createdAt
        };
    });
    const stringifyData = JSON.stringify(data)
    console.log(stringifyData)
    return stringifyData
}

const updateEmotion=async(userId, emotionBehaviour, causeOfBehaviour)=>{
    try {
        const response = await emotionModelChatbot.create({
            postedBy: userId,
            emotionType: emotionBehaviour,
            emotionReason: causeOfBehaviour
        })
        console.log(response)
        return
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getBecksTestScore, getUserDetails, getUserMoodData, getUserSleepData, getDailyTasks, updateEmotion}