const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const app = express()
const dailyTask = require("./models/dailyTaskModel")
const connectDB = require('./config/db')

//DOTENV
dotenv.config();

//Connect DB mongoose
connectDB();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//port
const port = process.env.PORT || 5000

//routes
app.use("/api/v1/auth", require('./routes/userRoutes'))
app.use("/api/v1/dailyTask", require('./routes/taskRoute'))
app.use("/api/v1/feel", require('./routes/feelingRoute'))
app.use("/api/v1/sleep", require('./routes/sleepRoute'))


app.get("/dailyTasks", async (req, res) => {
  let tasks = await dailyTask.find()
  if (tasks.length > 0) {
    res.send(tasks)
  } else {
    res.send("nothing found")
  }
})

app.post("/newItems", async (req, res) => {
  // const data = await req.body
  let data = new dailyTask(req.body)
  let result = await data.save()
  res.send(result)
  console.log(req.body)
})

app.delete('/delete/:_id', async (req, res) => {
  try {
    const result = await dailyTask.deleteOne({
      _id: req.params._id
    });

    if (result.deletedCount > 0) {
      res.json({
        success: true,
        message: 'Item deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`App is working on port ${port}`.bgWhite.black)
  }
})