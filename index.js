const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const app = express()
const dailyTask = require("./models/dailyTaskModel")
const connectDB = require('./config/db')
const WebSocket = require('ws');
const multer = require('multer')
const fs = require('fs')
const {
  spawn
} = require('child_process')
const faceDetectModel = require('./models/faceDetectModel')
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
const wss = new WebSocket.Server({
  port: 9000
});
const socket = new WebSocket('ws://localhost:9000');

//routes
app.use("/api/v1/auth", require('./routes/userRoutes'))
app.use("/api/v1/auth", require('./routes/doctorRoutes'))
app.use("/api/v1/dailyTask", require('./routes/taskRoute'))
app.use("/api/v1/feel", require('./routes/feelingRoute'))
app.use("/api/v1/sleep", require('./routes/sleepRoute'))
app.use("/api/v1/weeklyTest", require('./routes/weeklyTestRoute'))
app.use("/api/v1/streak", require('./routes/streakRoute'))


app.get("/dailyTasks", async (req, res) => {
  let tasks = await dailyTask.find()
  if (tasks.length > 0) {
    res.send(tasks)
  } else {
    res.send("nothing found") 
  }
})

app.get("/faceData", async(req,res)=>{
  let data = await faceDetectModel.find()
  if (data.length > 0){
    res.send(data)
  } else{
    res.send("no data available")
  }
})



const executePython = (script, args) => {
  return new Promise((resolve, reject) => {
    console.log("AI model started loading....")
    const arguments = args.map(arg => arg.toString());
    const py = spawn('python', [script, ...arguments], { stdio: ['pipe', 'pipe', 'ignore'] }); // Redirect stderr to ignore
    let output = '';

    // Get output from Python script
    py.stdout.on('data', (data) => {
      output += data;
    });

    // Handle error
    py.on('error', (error) => {
      console.error(`Error executing Python script: ${error}`);
      reject(`Error executing Python script: ${error}`);
    });

    // Python script execution finished
    py.on('close', (code) => {
      console.log(`Child process executed with code ${code}`);
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Python script exited with non-zero exit code: ${code}`);
      }
    });
  });
};



const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('video'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  await fs.renameSync(file.path, `uploads/${file.originalname}`);

  // res.status(200).send({
  //   message:"Video Uploaded"
  // })
  console.log("Video Uploaded")
  try {
    const { exec }=require('child_process');
    const pythonScript='AICamTextOutput.py';
    const videoPath=`D:\\AIIMS_Project\\V1\\backend\\uploads\\${file.originalname}`

    let emotion

    exec(`python ${pythonScript} ${videoPath}`,async(error,stdout,stderr) => {
      if(error){
        console.error(`error executing python script: ${error.message}`)
        return;
      }
      const lines = stdout.split('\n');
      const lastLine = lines[lines.length - 2]; 
      emotion = lastLine.split(' ').pop();
    
      console.log(`${emotion}`);

      const saveData = await faceDetectModel({
        score: emotion
      }).save()
      res.send({
        success: true,
        message: "reports are ready",
        saveData
      })
    
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during Python script execution.');
  }
});

const executePython2 = (script, args) => {
  return new Promise((resolve, reject) => {
    console.log("AI model started loading....")
    const py = spawn('python', [script, args], { stdio: ['pipe', 'pipe', 'ignore'] }); // Pass args directly
    let output = '';

    // Get output from Python script
    py.stdout.on('data', (data) => {
      output += data;

    });

    // Handle error
    py.on('error', (error) => {
      console.error(`Error executing Python script: ${error}`);
      reject(`Error executing Python script: ${error}`);
    });

    // Python script execution finished 
    py.on('close', (code) => {
      console.log(`Child process executed with code ${code}`);
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Python script exited with non-zero exit code: ${code}`);
      }
    });
  });
};

app.post('/text/', async (req, res) => {
  const data = req.body.data;
  console.log(data);
  try { 
    const result = await executePython2('./AIAudioInterference.py', [data]); // Pass data directly as argument
    console.log(result);
    res.send(result); // Sending back the result to the client
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send('Internal Server Error'); // Sending a generic error response to the client
  }
});
 


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